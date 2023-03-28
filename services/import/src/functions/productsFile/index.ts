import { AWS } from "@serverless/typescript";
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        authorizer: {
          name: 'basicAuthorizer',
          arn: 'arn:aws:lambda:us-east-1:484915649883:function:authorization-dev-basicAuthorizer',
          type: 'TOKEN',
          identitySource: 'method.request.header.Authorization',
        },
      },
    },
  ],
} as AWS['functions'][''];