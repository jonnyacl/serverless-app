var AWS = require('aws-sdk');
const apigateway = new AWS.APIGateway();
const dynamo = new AWS.DynamoDB();

exports.go = async (event, context) => {
    const user = event['userName'];
    // create new key for dev portal user
    const keyParams = {
      enabled: true,
      generateDistinctId: true,
      name: user
    };
    let apikey = await apigateway.createApiKey(keyParams).promise();
    // get usage plan ID
    const uPlans = await apigateway.getUsagePlans({ limit: 100 }).promise();
    const uPlan = uPlans.items.filter(plan => {
        return plan.name === process.env.USAGE_PLAN;
    });
    if (uPlan.length == 1) {
        //add it to the usage plan
        const params = {
            keyId: apikey.id,
            keyType: 'API_KEY',
            usagePlanId: uPlan[0].id
        };
        await apigateway.createUsagePlanKey(params).promise();
        const item = {
            'user': { 'S': user },
            'appkey': { 'S': apikey.value }
        }
        var toPut = {
            Item: item, 
            TableName: process.env.APP_KEY_TABLE
        };
        await dynamo.putItem(toPut).promise();
        context.done(null, event);
    }
    throw new Error("Could not find usage plan")
}
