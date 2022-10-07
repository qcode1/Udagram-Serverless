import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import middy from '@middy/core'
import cors from '@middy/http-cors'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import {getUserId} from 'src/auth/utils'

import * as AWS from 'aws-sdk'
const uuid = require('uuid')

const docClient = new AWS.DynamoDB.DocumentClient()
const groupsTable = process.env.GROUPS_TABLE

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log('Processing event: ', event)
    const itemId = uuid.v4()

    const parsedBody = JSON.parse(event.body)

    const authorization = event.headers.Authorization
    console.log("Authorization here", authorization)
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const userId = getUserId(jwtToken)

    const newItem = {
        id: itemId,
        name: parsedBody.name,
        userId: userId,
        description: parsedBody.description
    }

    await docClient.put({
        TableName: groupsTable,
        Item: newItem
    }).promise()

    return {
        statusCode: 201,
        body: JSON.stringify({
            newItem
        })
    }
});

handler.use(
    cors({
        credentials: true
    })
)

// export const main = middyfy(handler);