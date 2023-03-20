import { S3 } from 'aws-sdk';
const csv = require('csv-parser');
import { S3Event } from "aws-lambda";
const s3 = new S3({ region: 'us-east-1' });

const fileParser = async (event: S3Event) => {
  const { Records } = event;

  for (const record of Records) {
    const [, file] = record.s3.object.key.split('/');

    const streamS3Response = s3.getObject({
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key
    }).createReadStream();

    const data = streamS3Response.pipe(csv({ separator: ';' }));
    const chunks = [];

    for await (const chunk of data) {
      chunks.push(chunk);
      console.log('Data Read: ', JSON.stringify(chunk));
    }

    await s3.putObject({
      Bucket: record.s3.bucket.name,
      Body: JSON.stringify(chunks),
      Key: `parsed/${file.replace('csv', 'json')}`,
      ContentType: 'application/json'
    }).promise().catch(error => {
      console.log(500, error);
    });

    await s3.deleteObject({
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key
    }).promise().catch(error => {
      console.log(500, error);
    });

    console.log(200, event);
  }
};

export const main = fileParser;