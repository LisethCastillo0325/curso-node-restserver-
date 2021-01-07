const express = require('express');

const { verificarToken, verificarRoleAdmin } = require('../middlewares/autenticacion');
const { getAllUser, createUser, updateUser, removeUser } = require('../controllers/usuario');

const app = express();

app.get('/usuario', verificarToken, getAllUser);
app.post('/usuario', [verificarToken, verificarRoleAdmin], createUser);
app.put('/usuario/:id', [verificarToken, verificarRoleAdmin], updateUser);
app.delete('/usuario/:id', [verificarToken, verificarRoleAdmin], removeUser);

module.exports = app;