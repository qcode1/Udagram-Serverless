
export default {
  handler: `src/lambda/http/getImages/getImages.handler`,
  events: [
    {
      http: {
        method: 'get',
        path: 'groups/{groupId}/images',
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
