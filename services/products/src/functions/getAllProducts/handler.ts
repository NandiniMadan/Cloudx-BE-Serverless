import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
var AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });
var ddbDocumentClient = new AWS.DynamoDB.DocumentClient();

const getAllProducts = async (event) => {
  const productData = await getDataFromTable(process.env.PRODUCT_TABLE);
  const stockData = await getDataFromTable(process.env.STOCK_TABLE);
  console.log(`Products Data: ${JSON.stringify(productData)}, Stock Data: ${JSON.stringify(stockData)}`);
  const joinResults = productData.concat(stockData).reduce((acc, x) => {
    acc[x.id] = Object.assign(acc[x.product_id] || {}, x);
    delete acc[x.id].product_id;
    return acc;
  }, {});

  const resultData = Object.keys(joinResults).map(k => joinResults[k]);

  return formatJSONResponse({
    data: resultData
  });
};

async function getDataFromTable(tableName) {
  try {
    var params = {
      TableName: tableName
    };
    var dbItems = await ddbDocumentClient.scan(params).promise();
    var resultData = dbItems.Items;
  } catch (error) {
    var resultData = error;
  }
  return resultData;
}


export const main = middyfy(getAllProducts);