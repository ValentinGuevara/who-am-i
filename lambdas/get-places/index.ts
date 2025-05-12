import { Context, APIGatewayProxyCallback, APIGatewayEvent, APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const makeRequestPayload = (exclusiveStartKey?: string) => ({
    TableName: process.env.TABLE_NAME_PLACE,
    KeyConditionExpression: "PK = :pk AND begins_with(PLACE_ID, :googPrefix)",
    ExpressionAttributeValues: {
        ":pk": "PLACE",
        ":googPrefix": "GOOG-",
    },
    ExclusiveStartKey: exclusiveStartKey ? {
        "PK": "PLACE",
        "PLACE_ID": exclusiveStartKey,
    } : undefined,
});

const hasNextPage = async (exclusiveStartKey: string): Promise<boolean> => {
    const moreItemsResponse = new QueryCommand({
        ...makeRequestPayload(exclusiveStartKey),
        Select: "COUNT",
        Limit: 1
    });
    const { Count } = await docClient.send(moreItemsResponse);
  
    return Count && Count > 0 ? true : false;
  }

export const lambdaHandler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback): Promise<void> => {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);
    
    const { lastEvaluatedKey, limit } = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;

    try {
        const command = new QueryCommand({
            ...makeRequestPayload(lastEvaluatedKey),
            Limit: limit ? Number(limit) : 7,
            ConsistentRead: true,
          });
        
        const { Count, Items, LastEvaluatedKey, ScannedCount } = await docClient.send(command);
        const lastEvaluatedId = LastEvaluatedKey ? LastEvaluatedKey['PLACE_ID'] as string : undefined;
        
        // Check if more items are available for accurate pagination
        let hasMoreItems = false;
        if(lastEvaluatedId) {
            hasMoreItems = await hasNextPage(lastEvaluatedId);
        }
        
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                items: Items?.map(item => ({
                    location: item.PLACE_ID,
                    type: item.PLACE_TYPE,
                    date: item.PLACE_DATE,
                    createdAt: item.CREATED_AT,
                })),
                count: Count,
                lastEvaluatedKey: hasMoreItems ? lastEvaluatedId : null,
                scannedCount: ScannedCount,
            }),
        });
    } catch (error) {
        console.error('Error retrieving places:', error);
        return callback(null, {
            statusCode: 500,
            body: JSON.stringify({ message: 'Impossible de récupérer les lieux' }),
        });
    }
};