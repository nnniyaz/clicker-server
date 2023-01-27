require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./routes/router');

const PORT = process.env.PORT || 8080;
const DB_URL = process.env.MONGO_URI;

const app = express();

app.use(cors(
    {
        origin: process.env.CLIENT_URL
    }
));
app.use(express.json());
app.use('/api', router);

const start = async () => {
    try {
        await mongoose.connect(DB_URL, {useUnifiedTopology: true, useNewUrlParser: true})
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log('Server Error', e.message);
    }
}

start();
