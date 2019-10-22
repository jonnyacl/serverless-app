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
    try {
        const resp = await axios.post(url, body, { headers: { "Content-Type": "application/json", "x-partner-id": process.env.PARTNER_ID, "x-api-key": process.env.API_KEY, "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYW5kYm94VXNlciIsIm5hbWUiOiJGcmFjQm94IiwiaWF0IjoxNTE2MjM5MDIyLCJleHBpcmVzIjoxODAwfQ.A-Xk_RwJu3BZQ7gsUgq7nK4UPJpqIKJtxbBxkz2eJU4"}});
        return { "transactions": resp.data };
    } catch (err) {
        throw new Error('[500] Internal Server Error');
    }
  }
  
    return response;
}