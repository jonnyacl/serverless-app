var axios = require("axios");

exports.connectCompany = async (event) => {
    const compName = event.companyName;
    const comp = await connectCompanyHouse();
}

const connectCompanyHouse = async (companyName) => {
    const API_KEY = process.env.COMPANYHOUSE_KEY;
    const BASE_URI = "https://api.companieshouse.gov.uk/";
    const companyNumber = axios.get(BASE_URI+'search/companies', {
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
  const companyData = axios.get(BASE_URI+'search/company/'+companyNumber)
  .then(function (response) {
      console.log(response);
      return response;
  })
  .catch(function (error) {
    console.log(error);
  });  
  return companyData;
}