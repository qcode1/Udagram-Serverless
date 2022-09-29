import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()
const groupsTable = process.env.GROUPS_TABLE
const imagesTable = process.env.IMAGES_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


    console.log("Caller event", event)
    const groupId = event.pathParameters.groupId

    const validGroupId = await groupExists(groupId)

    if (!validGroupId) {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: "Group does not exist"
            })
        }
    }

    const images = await getImagesPerGroup(groupId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            items: images
        })
    };
};

export const main = middyfy(handler);


async function getImagesPerGroup(groupId: string) {
    
    let params = { // Call parameters
        TableName: imagesTable,
        KeyConditionExpression: 'groupId = :groupId',
        ExpressionAttributeValues: {
            ':groupId': groupId
        },
        ScanIndexForward: false
    }
    const result = await docClient.query(params).promise()

    console.log("Get Images Per Group: ", result)

    return result.Items
}

async function groupExists(groupId: string) {

    let params = { // Call parameters
        TableName: groupsTable,
        Key: {
            id: groupId
        }
    }
    const result = await docClient.get(params).promise()

    console.log("Get group: ", result)
    return !!result.Item
    
}