import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';
import { S3 } from 'aws-sdk';
import { BUCKET_NAME, REGION, UPLOAD_PREFIX } from '../../utils/constants';

import schema from './schema';

const s3 = new S3({ region: REGION });

export const productsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${UPLOAD_PREFIX}/${event.queryStringParameters.name}`,
    Expires: 600,
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