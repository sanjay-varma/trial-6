const mysql = require('mysql');
require('dotenv').config();

let users = {}
let dbconn = null;

const connect = () => {
    dbconn = mysql.createConnection({
        host: process.env.DBSERVER,
        port: process.env.DBPORT,
        user: process.env.DBUSER,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME
    })

    return new Promise((resolve, reject) => {
        dbconn.connect((err) => {
            if (err)
                reject(err)
            else {
                dbconn.query("select * from user;", (err, result) => {
                    if (err)
                        reject(err)
                    else {
                        result.forEach((row) => { users[row['id']] = row; })
                        resolve()
                    }
                })
            }
        })
    })
}

const put_user = (user) => {
    return new Promise((resolve, reject) => {
        dbconn.query(`call put_user('${user.email}','${user.first_name}','${user.last_name}','${user.avatar}');`, (err, result) => {
            if (err)
                reject(err)
            else {
                var id = parseInt(result[0][0].id);
                user['id'] = id;
                users[id] = user;
                resolve(id);
            }
        })
    })
}

const del_user = (id) => {
    return new Promise((resolve, reject) => {
        dbconn.query(`delete from user where id=${id}`, (err, result) => {
            if (err)
                reject(err)
            else {
                delete users[id];
                resolve();
            }
        })
    })
}

module.exports = {
    connect,
    users,
    put_user,
    del_user
}