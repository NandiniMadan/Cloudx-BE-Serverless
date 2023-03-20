export default {
    Products: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
            TableName: 'Products',
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'S' }
            ],
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }
    },
    Stocks: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
            TableName: 'Stocks',
            AttributeDefinitions: [
                { AttributeName: 'product_id', AttributeType: 'S' },
            ],
            KeySchema: [
                { AttributeName: 'product_id', KeyType: 'HASH' },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }
    }
}