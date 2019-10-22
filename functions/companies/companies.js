var axios = require("axios");
const AWS = require('aws-sdk');
var documentClient = new AWS.DynamoDB.DocumentClient();

exports.connectCompany = async (event) => {
    const user = event.params.header['x-user'];
    if (!user) {
      console.error("connect company called without 'x-user' header", event);
      throw new Error("[400] Bad Request");
    }
    const compForm = event["body-json"];
    const compName = compForm.companyName;
    const comp = await connectCompanyHouse(compName);
    console.log(`COMP ${JSON.stringify(comp)}`);
    var params = {
      TableName: process.env.USER_TABLE,
      Key: {
        user
      },
      UpdateExpression: "set company = :c",
      ExpressionAttributeValues: {
        ":c": comp,
      },
      ReturnValues: "UPDATED_NEW"
    };
    try {
      await documentClient.update(params).promise();
    } catch (error) {
      console.error("updateUser failed to set company", { error, params })
      throw new Error("[400] Bad Request");
    }
}

const connectCompanyHouse = async (companyName) => {
    const API_KEY = process.env.COMPANYHOUSE_KEY;
    const BASE_URI = "https://api.companieshouse.gov.uk/";
    let companyNumber;
    const companyResp = await axios.get(`${BASE_URI}search/companies`, {
      params: {
        q: companyName
      }
    });
    console.log(companyResp.data);
    if (companyResp.data.items.length != 0) {
      companyNumber = companyResp.data.items[0].company_number;
    } else {
      throw new Error("[400] no company number");
    } 
    const companyData = await axios.get(`${BASE_URI}search/company/${companyNumber}`);
    return companyData.data;
}