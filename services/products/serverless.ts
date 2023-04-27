import type { AWS } from '@serverless/typescript';

import getProductById from '@functions/getProductById';
import getAllProducts from '@functions/getAllProducts';
import createProduct from '@functions/createProduct';
import batchProcess from '@functions/catalogBatchProcess';

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
      SNS_TOPIC_CREATE_PRODUCT: { Ref: 'createProductTopic' },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:*'],
            Resource: '*',
          },
          {
            Effect: 'Allow',
            Action: ['sqs:*'],
            Resource: [
              {
                'Fn::GetAtt': ['catalogItemsQueue', 'Arn'],
              },
            ],
          },
          {
            Effect: 'Allow',
            Action: ['sns:*'],
            Resource: {
              Ref: 'createProductTopic',
            },
          },
        ]
      }
    }
  },
  functions: { getProductById, getAllProducts, createProduct, batchProcess },
  resources: {
    Resources: {
      ...dynamodbTables,
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
        },
      },
      createProductSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'vladyslav_palyvoda@epam.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic',
          },
        },
      },
    }
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
