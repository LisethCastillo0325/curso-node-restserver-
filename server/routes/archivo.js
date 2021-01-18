const express = require('express');
const fileUpload = require('express-fileupload');
const { verificarToken } = require('../middlewares/autenticacion');
const { fileUploadToServer, getFile } = require('../controllers/archivo');

const app = express();

app.use(fileUpload({ useTempFiles: true }));
app.put('/upload/:tipo/:id', verificarToken, fileUploadToServer);
app.get('/file/:tipo/:nombre', verificarToken, getFile);

module.exports = app;