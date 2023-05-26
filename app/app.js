const app = require('./config')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const port = 8080;
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGO_URI + process.env.MONGO_DATABASE)
}

app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening at http://localhost:${port}`)
});