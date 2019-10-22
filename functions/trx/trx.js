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
          let trx =  await getTransactions()
          trx.forEach(t => {
             t["vat"] = "20%";
           });
           console.log(trx);
         return trx
        }
    }
return response;
}
  const getTransactions = async () => {
    const baseUrl = 'https://sandbox.fractal-dev.co.uk'
      let url = baseUrl + '/banking/' + 7 + '/accounts/fakeAccount/transactions/'
      console.log(url)
      let trx = await getReq(url)
      return trx
  }
  
  const getReq = async (url) => {
    try {
        const resp = await axios.get(url, { headers: { "Content-Type": "application/json", "x-partner-id": process.env.PARTNER_ID, "x-api-key": process.env.API_KEY, "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYW5kYm94VXNlciIsIm5hbWUiOiJGcmFjQm94IiwiaWF0IjoxNTE2MjM5MDIyLCJleHBpcmVzIjoxODAwfQ.A-Xk_RwJu3BZQ7gsUgq7nK4UPJpqIKJtxbBxkz2eJU4"}});
        return resp.data.results ;
    } catch (err) {
        throw new Error('[500] Internal Server Error');
    }
  }
  
    