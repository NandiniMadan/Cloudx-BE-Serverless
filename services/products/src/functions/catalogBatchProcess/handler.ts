import { APIGatewayEvent } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import * as AWS from 'aws-sdk';
AWS.config.update({ region: 'eu-west-1' });

interface CatalogBatchProcessEvent extends APIGatewayEvent {
    Records: {
        body: string;
    }[];
}

const catalogBatchProcessHandler = async (
    event: CatalogBatchProcessEvent,
): Promise<void> => {
    const DynamoDBClient = new AWS.DynamoDB.DocumentClient();
    const SNSClient = new SNS({
        region: 'eu-west-1',
    });

    try {
        await Promise.all(
            event.Records.map(async record => {
                const product = JSON.parse(record.body);
                const {
                    id,
                    title,
                    description,
                    price,
                    count
                } = product;

                await DynamoDBClient.put({
                    TableName: String(process.env.PRODUCT_TABLE),
                    Item: {
                        id: Number(id),
                        title: String(title),
                        description: String(description),
                        price: Number(price)
                    },
                }).promise();
                await DynamoDBClient.put({
                    TableName: String(process.env.STOCK_TABLE),
                    Item: {
                        product_id: Number(id),
                        count: Number(count)
                    },
                }).promise();

                await SNSClient.publish({
                    Subject: 'New Batch Catalog Created',
                    Message: JSON.stringify(product),
                    TopicArn: process.env.SNS_TOPIC_CREATE_PRODUCT,
                }).promise();
            }),
        );
    } catch (error: any) {
        console.log(error, error.message);
    }
};

export const main = catalogBatchProcessHandler;