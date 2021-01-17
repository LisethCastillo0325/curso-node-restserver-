const express = require('express');
const fileUpload = require('express-fileupload');
const { verificarToken } = require('../middlewares/autenticacion');
const { fileUploadToServer } = require('../controllers/upload');

const app = express();

app.use(fileUpload({ useTempFiles: true }));
app.put('/upload/:tipo/:id', verificarToken, fileUploadToServer);

module.exports = app;