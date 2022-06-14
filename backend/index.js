var data = require('./data');
const express = require('express');
const cors = require('cors');
const app = express();
const jsencrypt = require('node-jsencrypt');
const fs = require('fs');

const privateKey = fs.readFileSync('./private.pem').toString('utf8');
const jsenc = new jsencrypt();
jsenc.setPrivateKey(privateKey);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen("8000", () => { console.log("listening on port 8000") })

const pageSize = 5;
app.get("/user", (req, res) => {
    var page = parseInt(req.query.page);
    var id = parseInt(req.query.id);
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    if (id >= 0) {
        console.log("req for id: " + id);
        var user = data.users[id];

        if (user) {
            res.json({ status: true, message: "data for user: " + id, data: user });
        }
        else {
            res.json({ status: false, message: "no data found for id " + id });
        }

        return;
    }

    if (page <= 0 || !page) {
        console.log("req for all pages");
        res.json({ status: true, message: "data for all users", data: Object.values(data.users) })
    }
    else {
        console.log("req for page: " + page);
        var pFrom = pageSize * (page - 1);
        var pTo = pageSize * page;
        console.log("returning data from " + pFrom + " to " + pTo);
        var pageUsers = Object.values(data.users).slice(pFrom, pTo);
        if (pageUsers.length > 0) {
            res.json({ status: true, message: "data for page " + page, data: pageUsers });
        }
        else {
            res.json({ status: false, message: "no data on page " + page });
        }
    }
})

app.post('/login', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    var credentials = JSON.parse(jsenc.decrypt(req.body.credentials));


    if (!('email' in credentials)) {
        res.json({ status: false, message: "email is required" });
        return;
    }

    if (!('password' in credentials)) {
        res.json({ status: false, message: "password is required" });
        return;
    }

    var email = credentials.email.trim();
    var password = credentials.password.trim();

    console.log("login req received for email:" + email);

    if (password == '') {
        res.json({ status: false, message: "password is required" });
        return;
    }

    for (const id in data.users) {
        if (data.users[id].email == email) {
            res.json({ status: true, message: "login successful", token: Math.random().toString().substr(2, 8) });
            return;
        }
    }

    res.json({ status: false, message: "user not found" });
})

app.post('/user', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    console.log("post req received for email:" + req.body.email.trim())
    var user = {
        id: parseInt(req.body.id),
        email: req.body.email.trim(),
        first_name: req.body.first_name.trim(),
        last_name: req.body.last_name.trim(),
        avatar: req.body.avatar.trim()
    }

    var id = req.body.id;
    if (data.users[id]) {
        data.users[id] = user;
        res.json({ status: true, message: "data saved" });
    }

    else {
        res.json({ status: false, message: "id " + id + " not found" });
    }
})

app.delete('/user', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    var id = req.body.id;
    delete data.users[id];
    res.json({ status: true, message: "user id=" + id + " deleted" });
})

app.put('/user', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    console.log("put req received for email:" + req.body.email.trim());
    var id = Object.keys(data.users).length + 1;
    var user = {
        id: id,
        email: req.body.email.trim(),
        first_name: req.body.first_name.trim(),
        last_name: req.body.last_name.trim(),
        avatar: req.body.avatar.trim()
    }
    data.users[id] = user;
    res.json({ status: true, message: "user id=" + id + " added" });
})

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));