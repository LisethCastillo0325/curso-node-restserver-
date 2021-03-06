const express = require('express');
const { getAllProducts, getProductByID, createProduct, updateProduct, deleteProducto, searchProduct } = require('../controllers/producto');
const { verificarToken } = require('../middlewares/autenticacion');

const app = express();

app.get('/producto', verificarToken, getAllProducts);
app.get('/producto/:id', verificarToken, getProductByID);
app.get('/producto/buscar/:termino', verificarToken, searchProduct);
app.post('/producto', verificarToken, createProduct);
app.put('/producto/:id', verificarToken, updateProduct);
app.delete('/producto/:id', verificarToken, deleteProducto);

module.exports = app;
