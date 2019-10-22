const axios = require("axios");
exports.getTrx = async (event) => {
    console.log('here')
    // TODO implement
    const response = ''
    const apiKey = 'ODPhbzdMs738Gl8F1AWyr7BbdKn9W9i18Q5xQiLM'
    const contentType = 'application/json'
    const partnerId = 'b90a254c452a4ad1b54921a27712765b'
    const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYW5kYm94VXNlciIsIm5hbWUiOiJGcmFjQm94IiwiaWF0IjoxNTE2MjM5MDIyLCJleHBpcmVzIjoxODAwfQ.A-Xk_RwJu3BZQ7gsUgq7nK4UPJpqIKJtxbBxkz2eJU4'
    const method = event.context['http-method']
    const baseUrl = 'https://sandbox.fractal-dev.co.uk'
    
    if (method === 'GET') {
      if(event.context['resource-path'] === '/transactions') {
          return getTransactions()
      }
    }
  
  const getTransactions = () => {
      let url = baseUrl + '/' + 7 + '/fakeAccount' + '/transactions/'
      let trx =  getReq(url)
      trx.forEach(function (element) {
        element.vat = "20%";
      });
  }
  
  const getReq = (url) => {
    const response = await axios.get(url, {
        headers: {
          Authorization: token,
          'X-Api-Key': apiKey,
          "X-Partner-Id": partnerId,
          Accept: contentType,
          "Content-Type": contentType,
        }
      })
    .then(function (response) {
      console.log(response);
      if (response.items.length != 0) {
      return response.items;
      }
    })
    .catch(function (error) {
      console.log(error);
    });  
  return response
  }
  
    return response;
}