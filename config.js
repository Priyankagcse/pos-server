const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const {v4: uuidv4} = require('uuid');

// const DBHost = process.env.DBHost;
// const DBUser = process.env.DBUser;
// const DBPassword = process.env.DBPassword;
// const DBName = process.env.DBName;

const DBHost = '127.0.0.1';
const DBUser = 'root';
const DBPassword = 'Welcome@123';
const DBName = 'testing';

const db = mysql.createPool({
    connectionLimit: 10,
    host: DBHost,
    user: DBUser,
    password: DBPassword,
    database: DBName
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

module.exports = { app, uuidv4, db, DBHost, DBUser, DBPassword, DBName };