require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('../utils');

const router = express.Router();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('http://localhost:3000/api/discord/callback');
const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

async function call(req, query, refresh_query) {
    const response = await fetch(query.url,query.data);
    const json = await response.json();
    console.log("JSON", json);
    if(json.message === '401: Unauthorized') {
        const response = await fetch(refresh_query.url, refresh_query.data);
        const json = await response.json();
        console.log("REFRESH:", json);
        req.session.set('token', `${json.access_token}`);
        req.session.set('refresh_token', `${json.refresh_token}`);
        const new_authorization = query.data.headers.Authorization = `Bearer ${json.access_token}`;
        return call(req,{ ...query, new_authorization}, refresh_query);
    } else {
        return json
    }
}

router.get('/login', (req, res) => {
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

router.get('/callback', catchAsync(async (req, res) => {
    if (!req.query.code) throw new Error('NoCodeProvided');
    const code = req.query.code;
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Basic ${creds}`,
            }
        });
    const json = await response.json();

    res.redirect(`/`);
    req.session.set('token', `${json.access_token}`);
    req.session.set('refresh_token', `${json.refresh_token}`);
}));

router.get('/get/basics', catchAsync(async (req, res) => {
    const response = await call(req, {url:`https://discordapp.com/api/users/@me`,
            data:{
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${req.session.get('token')}`,
                }
            }
        },
        {url:`https://discordapp.com/api/oauth2/token`,
            data:{
                method: 'POST',
                body: `grant_type=refresh_token&refresh_token=${req.session.get('refresh_token')}&redirect_uri=${redirect}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&scope=identify`,
                headers: {
                    contentType: `application/x-www-form-urlencoded`,
                }
            }
        },
    );


    console.log("API:",response);
    res.send(response);
}));

module.exports = router;


