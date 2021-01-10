const _ = require('underscore');
const { sendResponse, sendErrorResponse } = require('../classes/Response');
const Producto = require('../models/producto');

getAllProducts = async (req, res) =>{
    
    let desde  = req.query.desde || 0;
    let limite = req.query.limite || 5;
    let where  = {disponible: true};

    desde  = Number(desde);
    limite = Number(limite);
    
    try {
        
        let productos = await Producto.find(where)
            .populate('categoria')
            .populate('usuario', 'nombre email')
            .skip(desde)
            .limit(limite)
            .exec();
        
        let rows = await Producto.countDocuments(where).exec();

        sendResponse(res, true, {productos, rows});

    } catch (error) {
        sendErrorResponse(res, 500, error, 'Error al obtener los productos');
    }
}

getProductByID = async (req, res) => {
    let id = req.params.id;
    try {
        let producto = await Producto.findById(id)
            .populate('categoria')
            .populate('usuario', 'nombre email')
            .exec();

        if(!producto){
            sendErrorResponse(res, 400, null, 'El id de producto no existe');
        }
        sendResponse(res, true, {producto});
    } catch (error) {
        sendErrorResponse(res, 500, error, 'Error al consultar producto por id');
    }
}

createProduct = async (req, res) => {
    
    let body = req.body;
    let usuario =  req.usuario;
    
    try {
        
        let producto = new Producto();
        producto.nombre = body.nombre;
        producto.precioUnitario = body.precioUnitario;
        producto.descripcion = body.descripcion;
        producto.disponible = body.disponible;
        producto.categoria = body.categoria;
        producto.usuario = usuario._id;
        await producto.save();

        sendResponse(res, true, { producto }, 'Se creó el producto correctamente');

    } catch (error) {
        sendErrorResponse(res, 500, error, 'Error al crear el producto');
    }
}

updateProduct = async (req, res) => {
    
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUnitario', 'descripcion', 'categoria']);

    try {
        
        let producto = await Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}).exec();

        if(!producto){
            sendErrorResponse(res, 400, null, 'El id no existe');
        }

        sendResponse(res, true, {producto}, 'Se actualizó el producto correctamente');

    } catch (error) {
        sendErrorResponse(res, 500, error, 'Error al actualizar el producto');
    }
}

deleteProducto = async (req, res) => {
    
    let id = req.params.id;
    let cambiaDisponibilidad = {
        disponible: false
    };

    try {
        
        let producto = await Producto.findByIdAndUpdate(id, cambiaDisponibilidad, {new: true}).exec();

        if(!producto){
            sendErrorResponse(res, 400, null, 'El id no existe');
        }

        sendResponse(res, true, {producto}, 'Se deshabilitó el producto correctamente');

    } catch (error) {
        sendErrorResponse(res, 500, error, 'Error al eliminar el producto');
    }
}

module.exports = {
    getAllProducts,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProducto
}