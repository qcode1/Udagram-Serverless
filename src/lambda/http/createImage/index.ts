import schema from './schema';

export default {
  handler: `src/lambda/http/createImage/createImage.handler`,
  events: [
    {
      http: {
        method: 'post',
        path: 'groups/{groupId}/images',
        cors: true,
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
