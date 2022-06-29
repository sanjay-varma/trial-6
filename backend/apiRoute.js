const express = require('express');
const router = express.Router();
const jsencrypt = require('node-jsencrypt');
const fs = require('fs');

const privateKey = fs.readFileSync('./private.pem').toString('utf8');
const jsenc = new jsencrypt();
jsenc.setPrivateKey(privateKey);

const data = require('./data')

const { user, group } = require('./models');

const pageSize = 5;
router.get("/user", (req, res) => {
    var page = parseInt(req.query.page);
    var id = parseInt(req.query.id);

    if (id >= 0) {
        console.log("req for id: " + id);
        var u = data.users[id];

        if (u) {
            res.json({ status: true, message: "data for user: " + id, data: u });
        }
        else {
            res.json({ status: false, message: "no data found for id " + id, data: [] });
        }

        return;
    }

    if (page <= 0 || !page) {
        console.log("req for all pages");
        res.json({ status: true, message: "data for all users", data: Object.values(data.users), pageCount: Math.ceil(Object.keys(data.users).length / pageSize) })
    }
    else {
        console.log("req for page: " + page);
        var pFrom = pageSize * (page - 1);
        var pTo = pageSize * page;
        console.log("returning data from " + pFrom + " to " + pTo);
        var pageUsers = Object.values(data.users).slice(pFrom, pTo);
        if (pageUsers.length > 0) {
            res.json({ status: true, message: "data for page " + page, data: pageUsers, pageCount: Math.ceil(Object.keys(data.users).length / pageSize) });
        }
        else {
            res.json({ status: false, message: "no data on page " + page, data: [] });
        }
    }
})

router.get('/group', (req, res) => {
    res.json({ status: true, message: "list of groups", data: data.groups });
})

router.post('/login', (req, res) => {
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

router.post('/user', (req, res) => {

    console.log("post req received for email:" + req.body.email.trim())
    var u = {
        id: parseInt(req.body.id),
        email: req.body.email.trim(),
        first_name: req.body.first_name.trim(),
        last_name: req.body.last_name.trim(),
        group_id: req.body.group_id,
        group: data.groups[req.body.group_id],
        avatar: req.body.avatar.trim()
    }

    user.update({
        email: u.email,
        first_name: u.first_name,
        last_name: u.last_name,
        group_id: u.group_id,
        avatar: u.avatar
    }, { where: { 'id': u.id } })
        .then(() => {
            data.users[u.id] = u;
            res.json({ status: true, message: `id=${u.id} updated` });
        })
        .catch((err) => {
            console.error(`id=${u.id} save failed `, err);
            res.json({ status: false, message: `id=${u.id} update failed` });
        })

})

router.delete('/user', (req, res) => {
    var id = req.body.id;
    console.log(`delete req received for id: ${id}`)
    user.destroy({ where: { 'id': id } })
        .then(() => {
            delete data.users[id];
            res.json({ status: true, message: `user id=${id} deleted` });
        })
        .catch((err) => {
            console.error(`id=${id} delete failed `, err)
            res.json({ status: false, message: `id=${id} delete failed` });
        })
})

router.put('/user', (req, res) => {
    console.log("put req received for email:" + req.body.email.trim());
    var id = null;
    var u = {
        id: id,
        email: req.body.email.trim(),
        first_name: req.body.first_name.trim(),
        last_name: req.body.last_name.trim(),
        group_id: req.body.group_id,
        group: data.groups[req.body.group_id],
        avatar: req.body.avatar.trim()
    }

    user.create({
        id: id,
        email: u.email,
        first_name: u.first_name,
        last_name: u.last_name,
        group_id: u.group_id,
        avatar: u.avatar
    })
        .then((i) => {
            u.id = i.dataValues.id;
            data.users[u.id] = u;
            res.json({ status: true, message: `user id=${id} added` });
        })
        .catch((err) => {
            console.error(err);
            res.json({ status: false, message: `failed to add email=${u.email}` });
        })
})

module.exports = router;