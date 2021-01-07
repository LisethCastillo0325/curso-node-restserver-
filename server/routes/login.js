const express = require('express');
const { login, googleSingIn } = require('../controllers/login');

const app = express();

app.post('/login', login);
app.post('/google', googleSingIn);

module.exports = app;