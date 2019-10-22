var AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.get = async (event) => {
    const user = event.params.header['x-user'];
    var params = {
        TableName : "FracVatAccounts",
        Key: { user },
        ExpressionAttributeValues: {
            ":user": user
        }
    };
    
    const result = await dynamo.get(params).promise();
    console.log(result);
    return result.Item;
}

exports.connect = async (event) => {
    try {
        const user = event.params.header['x-user'];
        const accForm = event["body-json"];
        const item = { 
            user,
            bankId: accForm.bankId,
            bankName: accForm.bankName,
            accountId: "fakeAcc113",
            SchemeName: "IBAN",
            Identification: "GB83BANK43215378060931",
            Name: "Debit Account",
            dateAuthorised: "2018-09-06"
        }
        var toPut = {
            Item: item, 
            TableName: process.env.ACCOUNTS_TABLE
        };
        await dynamo.put(toPut).promise();
        return item;
    } catch (err) {
        console.log(err)
        throw new Error('[500] Internal Server Error');
    }
}