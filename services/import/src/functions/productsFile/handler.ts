import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { S3 } from 'aws-sdk';

import schema from './schema';

const s3 = new S3({ region: 'us-east-1' });

export const productsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const params = {
    Bucket: 'magnum-imports',
    Key: `uploaded/${event.queryStringParameters.name}`,
    Expires: 6000,
    ContentType: 'text/csv'
  };

  const signedURL = await s3.getSignedUrlPromise('putObject', params).catch(error => {
    console.log(500, error);
  });
  console.log(200, signedURL);

  return formatJSONResponse({
    signedURL
  });
};

export const main = middyfy(productsFile);