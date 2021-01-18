const express = require('express');
const usuario = require('./usuario');
const login = require('./login');
const categoria = require('./categoria');
const producto = require('./producto');
const archivo = require('./archivo');

const app = express();

app.use( usuario );
app.use( login );
app.use( categoria );
app.use( producto );
app.use( archivo );


module.exports = app;