import middy from '@middy/core'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import cors from '@middy/http-cors'

import * as AWS from 'aws-sdk'
const uuid = require('uuid')


const docClient = new AWS.DynamoDB.DocumentClient()
const groupsTable = process.env.GROUPS_TABLE
const imagesTable = process.env.IMAGES_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

console.log("urlExpiration", urlExpiration)

const s3 = new AWS.S3({
    signatureVersion: 'v4'
})

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {


    console.log("Caller event", event)
    const groupId = event.pathParameters.groupId
    const imageId = uuid.v4()
    const validGroupId = await groupExists(groupId)

    if (!validGroupId) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                error: "Group does not exist"
            })
        }
    }

    const newImage = await createImage(groupId, imageId, event)

    const url = getUploadUrl(imageId)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            item: newImage,
            uploadUrl: url
        })
    };
});


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

async function createImage(groupId: string, imageId: string, event: any) {

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
        imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
    }

    console.log("Creating new image", newImage)

    await docClient.put({
        TableName: imagesTable,
        Item: newImage
    }).promise()

    return newImage
}


function getUploadUrl(imageId: string) {

    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: imageId,
        Expires: urlExpiration
    })
}

handler.use(
    cors({
        credentials: true
    })
)

