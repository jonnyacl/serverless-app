const axios = require("axios");

exports.get = async (event) => {
    const url = "https://sandbox.fractal-dev.co.uk/banking";
    const banks = await axios.get(url, { "x-api-key": process.env.API_KEY, "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXJ0bmVyX25hbWUiOiJGcmFjdGFsIiwiaXNzIjoiQVBJLkZSQUNUQUwiLCJleHAiOjE1NjIxNzE0MTcsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJpYXQiOjE1NjIxNjk2MTcsImp0aSI6ImM5NzA5YzEwLWI2NDAtNCJ9.FyM7CEMeICSfPxPRk1-nPvwKLPBEMaD0r2xXC85E_rI"});
}