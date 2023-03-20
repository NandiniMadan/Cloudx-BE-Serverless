import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import getProductById from '@functions/getProductById';
import getAllProducts from '@functions/getAllProducts';
import createProduct from '@functions/createProduct';

import dynamodbTables from 'src/utils/dynamodb-tables';

const serverlessConfiguration: AWS = {
  service: 'products',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-auto-swagger'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: "us-east-1",
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: 'us-east-1',
      STAGE: 'dev',
      PRODUCT_TABLE: 'Products',
      STOCK_TABLE: 'Stocks',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:*'],
            Resource: '*',
          },
        ]
      }
    }
  },
  functions: { hello, getProductById, getAllProducts, createProduct },
  resources: {
    Resources: dynamodbTables,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      title: 'product-service',
      apiType: 'http',
      generateSwaggerOnDeploy: true,
      schemes: ["https", "ws", "wss"],
      typefiles: ['./src/utils/interfaces/types.ts'],
      excludeStages: ['production', 'anyOtherStage'],
      host: 'xck7eiwcuj.execute-api.us-east-1.amazonaws.com/dev'
    },
  }
};

module.exports = serverlessConfiguration;
