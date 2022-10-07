import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const connectionsTable = process.env.CONNECTIONS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log("Websocket disconnect", event)

    const connectionId = event.requestContext.connectionId
    const key = {
        id: connectionId
    }
    var msg = 'disconnected';

    await docClient.delete({
        TableName: connectionsTable,
        Key: key
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            msg: msg
        })
    }

}

export const main = middyfy(handler);

