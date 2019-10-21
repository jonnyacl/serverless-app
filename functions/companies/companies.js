var axios = require("axios");
const dynamo = new AWS.DynamoDB();

exports.connectCompany = async (event) => {
    const user = event['userName'];
    const compName = event.companyName;
    const comp = await connectCompanyHouse();
    const item = {
            'user': { 'S': user },
            'companyName': { 'S': comp.company_name },
            'companyAddress': { 'S': deliverAddress(comp.registered_office_address) },
            'companyYearEnd': { 'S': deliverYearEnd(comp.accounting_reference_date) },
            'companyType': { 'S': comp.type }
        }
        var toUpdate = {
            Item: item, 
            TableName: process.env.APP_KEY_TABLE
            // UpdateExpression: "set info.rating = :r, info.plot=:p, info.actors=:a",
            // ExpressionAttributeValues:{
            //     ":r":5.5,
            //     ":p":"Everything happens all at once.",
            //     ":a":["Larry", "Moe", "Curly"]
            // },
            // ReturnValues:"UPDATED_NEW"
        };
        await dynamo.update(toUpdate, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        }
        });
        context.done(null, event);
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