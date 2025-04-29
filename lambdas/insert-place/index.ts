import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Good practice : use iac loggers

export const lambdaHandler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback): Promise<void> => {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);
    if(!event.body) {
        return callback(null, {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing body' }),
        });
    }
    const { id, type, date } = JSON.parse(event.body);

    //Check place id exists

    const command = new PutCommand({
        TableName: process.env.TABLE_NAME_PLACE,
        Item: {
          PLACE_ID: id,
          PLACE_TYPE: type,
          PLACE_DATE: date,
          CREATED_AT: new Date().toISOString(),
        },
      });
    
    try {
        await docClient.send(command);
    } catch (error) {
        console.error('Error inserting place:', error);
        // Return explicit error for client
        return callback(null, {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error inserting place' }),
        });
    }

    console.log('Place inserted successfully:', { id, type, date });

    return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Place inserted successfully',
            id
        }),
    });
};