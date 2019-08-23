/*global AWS*/
const dynamo = new AWS.DynamoDB();

exports.authorise = async (event) => {
    const headers = event['headers'];
    const user = headers['x-user'];
    const appKey = headers['x-api-key'];
    const trueKey = getPortalKey(user);
    if (trueKey.Item) {
        if (trueKey['Item']['appkey'] == appKey) {
            // generate allowed policy
            return generatePolicy('user', 'Allow', event['methodArn'])
        }
    }   
    throw Exception('Unauthorized')
}

// Generate an IAM policy
const generatePolicy = (principalId, effect, resource) => {
    let authResponse = {};
    authResponse['principalId'] = principalId;
    if (effect && resource) {
        let policyDocument = {};
        policyDocument['Version'] = '2012-10-17';
        policyDocument['Statement'] = [];
        let statementOne = {};
        statementOne['Action'] = 'execute-api:Invoke';
        statementOne['Effect'] = effect;
        statementOne['Resource'] = resource;
        policyDocument['Statement'].push(statementOne);
        authResponse['policyDocument'] = policyDocument;
    }
    return authResponse;
}

const getPortalKey = (user) => {
    return dynamo.get_item(
        Key={
            'user': user,
        }
    )
}
