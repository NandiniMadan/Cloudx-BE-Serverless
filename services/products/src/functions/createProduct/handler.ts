import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ApiError } from 'src/utils/apiErrors';
import { create } from '../../utils/validation/product.validation';
import { v4 as uuidv4 } from 'uuid';
import { StatusCode } from '../../utils/enums/statusCode.enum'

var AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });
var ddbDocumentClient = new AWS.DynamoDB.DocumentClient();

const createProduct = async (event) => {
  try {
    console.log(event.body);
    await create.body.validateAsync(event.body);
  }
  catch (err) {
    return new ApiError(err, StatusCode.BAD_REQUEST)
  }

  const resultData = await createProductItem(event.body);

  return formatJSONResponse({
    data: resultData,
    event,
  });
};

const createProductItem = async (body) => {
  const productId = uuidv4();

  try {
    await ddbDocumentClient.transactWrite({
      TransactItems: [
        {
          Put: {
            Item: {
              id: productId,
              title: body.title,
              price: body.price,
              description: body.description
            },
            TableName: process.env.PRODUCT_TABLE
          },
        },
        {
          Put: {
            Item: {
              product_id: productId,
              count: body.count
            },
            TableName: process.env.STOCK_TABLE
          },
        }
      ],
    }).promise();
    return { ...body, id: productId };
  } catch (error) {
    return error;
  }
}

export const main = middyfy(createProduct);
