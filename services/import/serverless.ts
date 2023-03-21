import type { AWS } from '@serverless/typescript';

import productsFile from '@functions/productsFile';
import fileParser from '@functions/fileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  useDotenv: true,
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-auto-swagger'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'us-east-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SQS_URL: {
        Ref: 'SQSQueue'
      }
    },
    lambdaHashingVersion: '20201221',
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['s3:ListBucket'],
            Resource: 'arn:aws:s3:::magnum-imports'
          },
          {
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: 'arn:aws:s3:::magnum-imports/*'
          },
          {
            Effect: 'Allow',
            Action: [
              "lambda:InvokeFunction"
            ],
            Resource: "*"
          },
          {
            Effect: "Allow",
            Action: [
              "logs:PutLogEvents",
              "logs:CreateLogGroup",
              "logs:CreateLogStream"
            ],
            Resource: "arn:aws:s3:::magnum-imports/*"
          },
          {
            Effect: 'Allow',
            Action: 'sqs:*',
            Resource: {
              'Fn::GetAtt': ['SQSQueue', 'Arn']
            }
          }
        ]
      }
    }
  },
  resources: {
    Resources: {
      s3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: 'magnum-imports',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedHeaders: ["Content-Type"],
                AllowedMethods: ["GET", "PUT"],
                AllowedOrigins: ["*"]
              }
            ]
          }
        }
      },
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalog-items-sqs-queue'
        }
      }
    },
    Outputs: {
      SQSArn: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn']
        },
        Export: {
          Name: 'SQSArn'
        }
      }
    },
  },
  // import the function via paths
  functions: { productsFile, fileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      title: 'import-service',
      useStage: true,
      basePath: '/dev',
    },
  },
};

module.exports = serverlessConfiguration;