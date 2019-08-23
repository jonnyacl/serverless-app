/*global AWS*/
const apigateway = new AWS.APIGateway();
const dynamo = new AWS.DynamoDB();

exports.go = async (event) => {
    const user = event['userName'];
    console.log(user);
    // create new key for dev portal user
    const apikey = createApiKey(user);
    console.log(apikey);
    //add it to the usage plan
    const params = {
      keyId: apikey.id,
      keyType: 'API_KEY',
      usagePlanId: process.env.USAGE_PLAN
    };
    apigateway.createUsagePlanKey(params, function(err, data) {
      if (err) console.log(err, err.stack);
      else     console.log(data);
    });
    const item = {
        'user': { 'S': user },
        'appkey': { 'S': apikey.value }
    }
    
    var toPut = {
      Item: item, 
      TableName: process.env.APP_KEY_TABLE
    };
    dynamo.putItem(toPut).then(() => {}).catch(err => {
        console.log(`Error adding key: ${err}`);
    });
    return event;
}

const createApiKey = (user) => {
    // Creates api key and returns the key back
    const params = {
      enabled: true,
      generateDistinctId: true,
      name: user
    };
    return apigateway.createApiKey(params);
}
