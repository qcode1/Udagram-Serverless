// import schema from './schema';

// export default {
//   handler: `src/lambda/http/createGroup/createGroup.handler`,
//   events: [
//     {
//       http: {
//         method: 'post',
//         path: 'groups',
//         cors: {
//           headers: [
//             'Content-Type',
//             'X-Amz-Date',
//             'Authorization',
//             'X-Api-Key',
//             'X-Amz-Security-Token',
//             'X-Amz-User-Agent',
//           ],
//           allowCredentials: false,
//         },
//         authorizer: process.env.AUTH_HANDLER,
//         request: {
//           schemas: {
//             'application/json': schema,
//           },
//         },
//       },
//     },
//   ],
// };
