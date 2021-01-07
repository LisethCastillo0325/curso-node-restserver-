const express = require('express');

const { verificarToken, verificarRoleAdmin } = require('../middlewares/autenticacion');
const { getAllCategories, createCategory, getCategoryByID, updateCategory, deleteCategory } = require('../controllers/categoria');

const app = express();


app.get('/categoria', verificarToken, getAllCategories);
app.get('/categoria/:id', verificarToken, getCategoryByID);
app.post('/categoria', verificarToken, createCategory);
app.put('/categoria/:id', verificarToken, updateCategory);
app.delete('/categoria/:id', [verificarToken, verificarRoleAdmin], deleteCategory);


module.exports = app;