import { handlerPath } from '@libs/handler-resolver';
import { AWS } from "@serverless/typescript";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: 'magnum-imports',
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'uploaded'
          }
        ],
        existing: true
      }
    },
  ],
} as AWS['functions'][''];