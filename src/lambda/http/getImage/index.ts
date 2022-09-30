
export default {
  handler: `src/lambda/http/getImage/getImage.handler`,
  events: [
    {
      http: {
        method: 'get',
        path: 'images/{imageId}',
        cors: {
          headers: [
            'Content-Type',
            'X-Amz-Date',
            'Authorization',
            'X-Api-Key',
            'X-Amz-Security-Token',
            'X-Amz-User-Agent',
          ],
          allowCredentials: false,
        }
      },
    },
  ],
};
