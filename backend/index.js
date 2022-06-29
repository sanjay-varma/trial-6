const express = require('express');
const cors = require('cors');
const app = express();

const data = require('./data')
const models = require('./models')
const router = express.Router();
const apiRoute = require('./apiRoute')

app.use(cors({ credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('../frontend/build'));
app.use('/api', apiRoute);

const { user, group } = require('./models');
models.sequelize.sync()
    .then(() => {
        console.log("connected to database")
        group.findAll()
            .then((g) => {
                data.groups = g.map((d) => { return d.dataValues })
                user.findAll({ include: [group] })
                    .then((u) => {
                        data.users = u.map((d) => { return { ...d.dataValues, group: d.group.dataValues } })
                        console.log(`loaded ${data.users.length} users`);
                        app.listen("8000", () => { console.log("listening on port 8000") })
                    })
            })
    })
    .catch((err) => {
        console.error("failed to connect to database : ", err)
    })