const axios = require("axios");
const baseUrl = 'https://sandbox.fractal-dev.co.uk'
exports.pay = async (event) => {
    // TODO implement
    const response = {
        statusCode: 400,
        body: JSON.stringify('Errors'),
    };
    const apiKey = 'ODPhbzdMs738Gl8F1AWyr7BbdKn9W9i18Q5xQiLM'
    const contentType = 'application/json'
    const partnerId = 'b90a254c452a4ad1b54921a27712765b'
    const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXJ0bmVyX25hbWUiOiJGcmFjdGFsIiwiaXNzIjoiQVBJLkZSQUNUQUwiLCJleHAiOjE1NjIxNzE0MTcsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJpYXQiOjE1NjIxNjk2MTcsImp0aSI6ImM5NzA5YzEwLWI2NDAtNCJ9.FyM7CEMeICSfPxPRk1-nPvwKLPBEMaD0r2xXC85E_rI'
    const method = event.context['http-method']
    
    
    if (method === 'GET') {
      if(event.context['resource-path'] === '/transactions') {
          return getTransactions()
      }
    }
      
    if(method === 'POST') {
      if(event.context['resource-path'] === '/pay') {
        console.log(event["body-json"])
          return postDomesticPayments(event["body-json"])
      }
    }
    
    return response;
}
    
  const getDomesticPayments = (bank, domesticPaymentId) => {
      let url = baseUrl + '/banking/' + bank + '/domestic-payments/' + domesticPaymentId
      console.log(url)
      return getReq(url)
  }
  
  const getFundsConfirmation = (bank, consentId) => {
      let url = baseUrl + '/' + bank + '/domestic-payments-consents/' + consentId + '/funds-confirmation'
      return getReq(url)
  }
  
  const getConsentId = (bank, consentId) => {
      let url = baseUrl + '/' + bank + '/domestic-payments-consents/' + consentId 
      return getReq(url)
  }
  
  const postDomesticPaymentsConsent = async (bank, body) => {
      let url = baseUrl + '/banking/' + bank + '/domestic-payment-consents'
      console.log(url)
      return postReq(url, body)
      
  }
  
  const getTransactions = async () => {
    console.log('Attempting GET trx')
      let url = baseUrl + '/' + 7 + '/fakeAccount' + '/transactions/'
      console.log(url)
      let trx =  getReq(url)
      console.log(trx)
      trx = trx.forEach(function (element) {
        element.vat = "20%";
      })
      console.log(trx)
      return trx
  }
  
  const postDomesticPayments = async (body) => {
      const bank = body.bankId
      const paymentBody =  await postDomesticPaymentsConsent(bank, body)
      console.log(paymentBody)
      let url = baseUrl + '/banking/' + bank + '/domestic-payments/'
      console.log(url)
      const paymentpostresponse = await postReq(url, paymentBody);
       return getDomesticPayments(bank, paymentpostresponse.Data.DomesticPaymentId)
  }
  
  const getReq = async (url) => {
    try {
        const resp = await axios.get(url, { headers: { "Content-Type": "application/json", "x-partner-id": process.env.PARTNER_ID, "x-api-key": process.env.API_KEY,  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYW5kYm94VXNlciIsIm5hbWUiOiJGcmFjQm94IiwiaWF0IjoxNTE2MjM5MDIyLCJleHBpcmVzIjoxODAwfQ.A-Xk_RwJu3BZQ7gsUgq7nK4UPJpqIKJtxbBxkz2eJU4"}});
        return resp.data ;
    } catch (err) {
        throw new Error('[500] Internal Server Error');
    }
  }
  
  const postReq = async (url, body) => {
    try {
        const resp = await axios.post(url, body, { headers: { "Content-Type": "application/json", "x-partner-id": process.env.PARTNER_ID, "x-api-key": process.env.API_KEY, "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYW5kYm94VXNlciIsIm5hbWUiOiJGcmFjQm94IiwiaWF0IjoxNTE2MjM5MDIyLCJleHBpcmVzIjoxODAwfQ.A-Xk_RwJu3BZQ7gsUgq7nK4UPJpqIKJtxbBxkz2eJU4"}});
        return resp.data ;
    } catch (err) {
        throw new Error('[500] Internal Server Error');
    }
  }
