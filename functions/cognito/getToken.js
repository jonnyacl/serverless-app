var AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB();

exports.go = async (event, context) => {
    const user = event['userName'];
    console.log(`User ${user}`)
    const appKey = await getAppKey(user);
    
    if (appKey.Item) {
        console.log(`appkey ${JSON.stringify(appKey.Item.appkey.S)}`)
        event["response"]["claimsOverrideDetails"] = {
            "claimsToAddOrOverride": {
                "appkey": appKey.Item.appkey.S
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