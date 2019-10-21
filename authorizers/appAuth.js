const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');
const jwkEndpoint = `https://cognito-idp.${process.env.REGION}.amazonaws.com/${process.env.POOL_ID}/.well-known/jwks.json`;

exports.authorise = async (event) => {
    const headers = event['headers'];
    const user = headers['x-user'];
    const appKey = headers['x-api-key'];
    let jwtBearer = headers['Authorization'];
    if (!jwtBearer) {
        // browsers sometimes convert header names to lowercase
        jwtBearer = headers['authorization'];
        if (!jwtBearer) {
            console.log("Missing auth header");
            throw new Error('Unauthorized');
        }
    }
    const token = jwtBearer.split("Bearer ")[1];
    if (!token) {
        throw new Error('Unauthorized');
    }
    await verifyToken(token);
    const trueKey = await getAppKey(user);
    if (trueKey.Item) {
        if (trueKey.Item.appkey.S == appKey) {
            return generateAuthPolicy('user', 'Allow', event['methodArn']);
        }
        console.log(`Api key ${appKey} does not match user ${user} key`);
    } else {
        console.log(`Api key ${appKey} not found`);
    }
    throw new Error('Unauthorized');
};

const generateAuthPolicy = (principalId, effect, resource) => {
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
};

const verifyToken = async token => {
    try {
        const resp = await axios.get(jwkEndpoint);
        const tokenKid = JSON.parse(Buffer.from(token.split(".")[0], 'base64').toString('utf-8')).kid;
        if (!tokenKid) {
            throw new Error("No kid found in token");
        }
        let jwk = resp.data.keys;
        var publicJwk = jwk.filter(j => j.kid === tokenKid)[0];
        if (!publicJwk) {
            throw new Error(`Failed to find key based on kid ${tokenKid}`);
        }
        var publicPem = jwkToPem(publicJwk);
        jwt.verify(token, publicPem);
    } catch (err) {
        console.log(`Failed to verify token ${err}`);
        throw new Error('Unauthorized');
    }
};

const getAppKey = async (user) => {
    const dynamo = new AWS.DynamoDB();
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
};
