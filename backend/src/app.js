const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');
const postRoutes = require('../routes/post');
const userRoutes = require('../routes/user');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

// parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true}));

const db = require("../models/index");
db.sequelize.sync();

app.get('/', (req, res) => {
    res.send({
        message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄'
    });
});

app.use('/api/v1', api);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users', userRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
