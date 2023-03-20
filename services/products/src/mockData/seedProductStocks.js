var AWS = require('aws-sdk');
// AWS.config.loadFromPath('../credentials/config.json');
const { v4: uuidv4 } = require('uuid');
const data = require('../mockData/products.json');

var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10', region: 'us-east-1' });

var productTable = 'Products';
var stockTable = 'Stocks';

for (const product of data.products) {
    const id = uuidv4();
    var params = {
        TableName: productTable,
        Item: {
            'id': { S: id }, 'title': { S: product.title }, 'description': { S: product.description },
            'price': { S: product.price.toString() }
        }
    };
    post();

    var params = {
        TableName: stockTable,
        Item: { 'product_id': { S: id }, 'count': { N: product.count.toString() } }
    };
    post();
}

function post() {
    ddb.putItem(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
}