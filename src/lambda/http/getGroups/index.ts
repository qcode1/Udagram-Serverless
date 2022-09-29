
export default {
  handler: `src/lambda/http/getGroups/getGroups.handler`,
  events: [
    {
      http: {
        method: 'get',
        path: 'groups',
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
