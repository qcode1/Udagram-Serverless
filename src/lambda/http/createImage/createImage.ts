import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import * as AWS from 'aws-sdk'
const uuid = require('uuid')


const docClient = new AWS.DynamoDB.DocumentClient()
const groupsTable = process.env.GROUPS_TABLE
const imagesTable = process.env.IMAGES_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


    console.log("Caller event", event)
    const groupId = event.pathParameters.groupId
    const imageId = uuid.v4()
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

    const newImage = await createImage(groupId, imageId, event)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            item: newImage
        })
    };
};

export const main = middyfy(handler);


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



async function createImage(groupId:string, imageId:string, event:any) {

    let parsedBody;
    if (event.body) {
        parsedBody = JSON.parse(event.body)
    }

    const timestamp = new Date().toISOString()
    const newImage = {
        groupId: groupId,
        timestamp: timestamp,
        imageId: imageId,
        title: parsedBody.title,
    }

    console.log("Creating new image", newImage)

    await docClient.put({
        TableName: imagesTable,
        Item: newImage
    }).promise()

    return newImage
    
}