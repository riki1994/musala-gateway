const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const gateway = require('./routes/gateway');
const peripheral = require('./routes/peripheral');
const cors = require('cors')

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(cors())

app.get('/', (req, res) => {
    res.json({'message': 'ok'});
})

app.use('/gateway', gateway);
app.use('/peripheral', peripheral);

/* Error handler middleware */
app.use((err, req, res) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});
});

module.exports = app;