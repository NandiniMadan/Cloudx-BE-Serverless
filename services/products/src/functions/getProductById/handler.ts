import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ApiError } from 'src/utils/apiErrors';
import { StatusCode } from '../../utils/enums/statusCode.enum'
var AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });
var ddbDocumentClient = new AWS.DynamoDB.DocumentClient();

const getProductsById = async (event) => {
  console.log(`Get product by id with path parameter: ${event.pathParameters.id}`);
  const productData = await scanForProduct(event.pathParameters.id);
  const stockData = await scanForStock(event.pathParameters.id);
  var resultData = {};

  if (productData.length) {
    const joinResults = productData.concat(stockData).reduce((acc, x) => {
      acc[x.id] = Object.assign(acc[x.product_id] || {}, x);
      delete acc[x.id].product_id;
      return acc;
    }, {});
    resultData = Object.keys(joinResults).map(k => joinResults[k])[0];
  }

  if (Object.keys(resultData).length === 0) {
    return new ApiError(`Product with id ${event.pathParameters.id} was not found.`, StatusCode.NOT_FOUND)
  }

  return formatJSONResponse({
    data: resultData
  });
};

async function scanForProduct(id) {
  try {
    var params = {
      TableName: process.env.PRODUCT_TABLE,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': id
      },
    };
    var dbItems = await ddbDocumentClient.query(params).promise()
    var resultData = dbItems.Items;
  } catch (error) {
    var resultData = error;
  }
  return resultData;
}

async function scanForStock(id) {
  try {
    var params = {
      TableName: process.env.STOCK_TABLE,
      KeyConditionExpression: 'product_id = :product_id',
      ExpressionAttributeValues: {
        ':product_id': id
      },
    };
    var dbItems = await ddbDocumentClient.query(params).promise()
    var resultData = dbItems.Items;
  } catch (error) {
    var resultData = error;
  }
  return resultData;
}

export const main = middyfy(getProductsById);
