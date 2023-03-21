// import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Handler } from 'aws-lambda';
import { S3, SQS } from 'aws-sdk';
const csv = require('csv-parser');
import { SendMessageRequest } from "aws-sdk/clients/sqs";
import { BUCKET_NAME, REGION, PARSE_PREFIX, UPLOAD_PREFIX } from 'src/utils/constants';

const {
  SQS_URL
} = process.env;

const s3 = new S3({ region: REGION });
const sqs = new SQS();

const fileParser: Handler = async (event) => {
  console.log(' Lambda FileParser event: ' + JSON.stringify(event));

  const promises = event.Records.map(record => {
    return new Promise<void>((resolve, reject) => {
      const sourcePath = record?.s3?.object?.key;
      const destinationPath = sourcePath.replace(UPLOAD_PREFIX, PARSE_PREFIX);
      const fileName = sourcePath.replace(UPLOAD_PREFIX, '');
      const paramsGetObject = {
        Bucket: BUCKET_NAME,
        Key: sourcePath
      };
      const paramsCopyObject = {
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${sourcePath}`,
        Key: destinationPath
      };
      const paramsDeleteObject = {
        Bucket: BUCKET_NAME,
        Key: sourcePath
      }

      const res = [];
      const stream = s3.getObject(paramsGetObject).createReadStream();
      stream
        .pipe(csv())
        .on('data', (row) => {
          // if row is empty - skip
          res.push(row);

          const sqsParams: SendMessageRequest = {
            QueueUrl: SQS_URL,
            MessageBody: JSON.stringify(row)
          };

          console.log(`sqs parameters are CONFIGURED ${sqsParams}`);

          sqs.sendMessage(sqsParams, (err, result) => {
            if (err) {
              console.log(err);

              reject(err)
            }

            console.log(`Message has been sent to queue SUCCESSFULLY with data: ${result}`);
          });
        })
        .on('error', (error) => {
          console.log(`Error occured while parsing ${paramsGetObject.Key}: ${error}`);
          reject(error);
        })
        .on('end', async () => {
          // copy object
          await s3.copyObject(paramsCopyObject).promise();
          console.log(`File ${fileName} was SUCCESSFULLY copied from '${UPLOAD_PREFIX}' to '${PARSE_PREFIX}' folder`);

          // delete object from uploaded/ folder
          await s3.deleteObject(paramsDeleteObject).promise();
          console.log(`File ${fileName} was SUCCESSFULLY removed from '${UPLOAD_PREFIX}' folder`);

          // resolves logs
          resolve()
        })
    });
  });

  try {
    await Promise.all(promises);
  } catch (error) {
    return { code: 500, message: error };
  }
};

export const main = fileParser;