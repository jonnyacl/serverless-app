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
    // const comp = await connectCompanyHouse();
    // const item = {
    //   'user': { 'S': user },
    //   'companyName': { 'S': comp.company_name },
    //   'companyAddress': { 'S': deliverAddress(comp.registered_office_address) },
    //   'companyYearEnd': { 'S': deliverYearEnd(comp.accounting_reference_date) },
    //   'companyType': { 'S': comp.type }
    // };
    var params = {
      TableName: process.env.USER_TABLE,
      Key: {
        user
      },
      UpdateExpression: "set #com = :c",
      ExpressionAttributeNames: {
        "#com": "company"
      },
      ExpressionAttributeValues: {
        ":c": compName
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
    const companyNumber = await axios.get(BASE_URI+'search/companies', {
    params: {
      q: companyName
    }
  })
  .then(function (response) {
    console.log(response);
    if (response.items.length != 0) {
    return response.items[0].company_number;
    }
  })
  .catch(function (error) {
    console.log(error);
  });  
//   Probably buggy, still runs if previous call returned an error
  if (companyNumber !== 'undefined') {
    const companyData = await axios.get(BASE_URI+'search/company/'+companyNumber)
    .then(function (response) {
        console.log(response);
        return response;
    })
    .catch(function (error) {
      console.log(error);
    });
    return companyData;
  }
  else {
    return {};
  }
}

const deliverAddress = async (addressObject) => {
  const addressList = Object.keys(addressObject).reduce(function(res, v) {
    return res.concat(addressObject[v]);
  }, []);
  return addressList.join(" ");
}

const deliverYearEnd = async (yearEndObject) => {
  // "day": "30",
  // "month": "04"
  const yearEndList = Object.keys(yearEndObject).reduce(function(res, v) {
    return res.concat(yearEndObject[v]);
  }, []);
  return yearEndList.join("-");
}