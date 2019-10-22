var AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB();

exports.go = async (event, context) => {
    const user = event['userName'];
    const appKey = await getAppKey(user);
    if (appKey.Item) {
        event["response"]["claimsOverrideDetails"] = {
            "claimsToAddOrOverride": {
                "appkey": appKey.Item.appkey.S,
                "company": appKey.Item.company ? appKey.Item.company.S : null,
            }
        }
    } else {
        throw new Error("Could not find app key");
    }
    context.done(null, event);
}

const getAppKey = async (user) => {
    var params = {
        TableName: process.env.APP_KEY_TABLE,
        Key: {
            "user": {
                S: user
            }
        }
    };
    const appKey = await dynamo.getItem(params).promise();
    return appKey;
}