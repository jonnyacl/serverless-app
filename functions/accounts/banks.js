const axios = require("axios");

exports.get = async (event) => {
    try {
        const url = "https://sandbox.fractal-dev.co.uk/banking";
        const resp = await axios.get(url, { headers: { "Content-Type": "application/json", "x-partner-id": process.env.PARTNER_ID, "x-api-key": process.env.API_KEY, "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYW5kYm94VXNlciIsIm5hbWUiOiJGcmFjQm94IiwiaWF0IjoxNTE2MjM5MDIyLCJleHBpcmVzIjoxODAwfQ.A-Xk_RwJu3BZQ7gsUgq7nK4UPJpqIKJtxbBxkz2eJU4"}});
        return { "banks": resp.data.results };
    } catch (err) {
        throw new Error('[500] Internal Server Error');
    }
}