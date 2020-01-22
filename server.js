const express = require('express');
const next = require('next');

//Sessions
const cookie = require("cookie-parser");
const crypto = require('crypto');

//Next custom server
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

class Sessions {
    constructor(maxAge) {
        this.maxAge = maxAge;
        this.sessions = {};
        this.middleware.bind(this);
    }
    middleware(req, res, next) {
        const buff = crypto.randomBytes(75);
        if (!req.cookies.SESSID) res.cookie("SESSID", buff.toString('hex'), {
            maxAge: this.maxAge
        });
        if (!this.sessions[req.cookies.SESSID]) this.sessions[req.cookies.SESSID] = {};
        req.session = {
            get: (name) => this.sessions[req.cookies.SESSID][name],
            set: (name, value) => this.sessions[req.cookies.SESSID][name] = value,
            getRaw: () => this.sessions[req.cookies.SESSID],
            remove: () => {
                delete this.sessions[req.cookies.SESSID];
                res.cookie("SESSID", '', {
                    expires: new Date(0)
                });
            }
        };
        next()
    }
}

function sessionFactory(maxAge) {
    const session = new Sessions(maxAge);
    console.log(session);
    return session.middleware.bind(session);
}


app.prepare().then(() => {
    const server = express();

    server.use(cookie());
    //Sessions
    server.use(sessionFactory(1000 * 60 * 60 * 24 * 30));

    //Discord
    server.use('/api/discord', require('./api/discord'));


    server.use((err, req, res, next) => {
        switch (err.message) {
            case 'NoCodeProvided':
                return res.status(400).send({
                    status: 'ERROR',
                    error: err.message,
                });
            default:
                return res.status(500).send({
                    status: 'ERROR',
                    error: err.message,
                });
        }
    });
    server.all('*', (req, res) => {
        return handle(req, res)
    });

    server.listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`)
    })
});