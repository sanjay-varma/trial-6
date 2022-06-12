var data = require('./data');
const express = require('express');
const cors = require('cors');
const app = express();

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

app.post('/user', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    var user = {
        id: parseInt(req.body.id),
        email: req.body.email.trim(),
        first_name: req.body.first_name.trim(),
        last_name: req.body.last_name.trim()
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

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));