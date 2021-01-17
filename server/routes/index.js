const express = require('express');
const usuario = require('./usuario');
const login = require('./login');
const categoria = require('./categoria');
const producto = require('./producto');
const upload = require('./upload');

const app = express();

app.use( usuario );
app.use( login );
app.use( categoria );
app.use( producto );
app.use( upload );


module.exports = app;