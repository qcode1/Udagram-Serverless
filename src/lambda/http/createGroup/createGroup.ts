import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import * as AWS from 'aws-sdk'
const uuid = require('uuid')

const docClient = new AWS.DynamoDB.DocumentClient()
const groupsTable = process.env.GROUPS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log('Processing event: ', event)
    const itemId = uuid.v4()

    console.log(event)

    let parsedBody;
    if (event.body) {
        parsedBody = JSON.parse(event.body)
    }

    const newItem = {
        id: itemId,
        name: parsedBody.name,
        description: parsedBody.description
    }

    await docClient.put({
        TableName: groupsTable,
        Item: newItem
    }).promise()

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            newItem
        })
    }
};

export const main = middyfy(handler);