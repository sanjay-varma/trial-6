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

const { user } = require('./models');
models.sequelize.sync()
    .then(() => {
        console.log("connected to database")
        user.findAll()
            .then((u) => {
                data.users = u.map((d) => { return d.dataValues })
                console.log(`loaded ${data.users.length} users`);
                app.listen("8000", () => { console.log("listening on port 8000") })
            })
    })
    .catch((err) => {
        console.error("failed to connect to database : ", err)
    })



