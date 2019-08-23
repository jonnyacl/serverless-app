/*global AWS*/
const dynamo = new AWS.DynamoDB().DocumentClient();

exports.go = (event) => {
    const user = event['userName']
    const appKey = getAppKey(user)
    if (appKey.Item) {
        event["response"]["claimsOverrideDetails"] = {
            "claimsToAddOrOverride": {
                "appkey": appKey.Item.appKey
            }  
        }
    }
    return event
}

const getAppKey = (user) => {
    var params = {
        TableName: process.env.APP_KEY_TABLE,
        Key: {
            "user": user
        }
    };
    return dynamo.get(params);
}