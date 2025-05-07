import { Context, APIGatewayProxyCallback, APIGatewayEvent, APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const lambdaHandler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback): Promise<void> => {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);
    
    const { lastEvaluatedKey, limit } = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
    
    try {
        const command = new QueryCommand({
            TableName: process.env.TABLE_NAME_PLACE,
            KeyConditionExpression: "PK = :pk AND begins_with(PLACE_ID, :googPrefix)",
            ExpressionAttributeValues: {
                ":pk": "PLACE",
                ":googPrefix": "GOOG-",
            },
            ExclusiveStartKey: lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : undefined,
            Limit: limit ? Number(limit) : 7,
            ConsistentRead: true,
          });
        
        const { Count, Items, LastEvaluatedKey, ScannedCount } = await docClient.send(command);
        return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                items: Items,
                count: Count,
                lastEvaluatedKey: LastEvaluatedKey,
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