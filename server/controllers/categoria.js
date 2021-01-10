const { sendResponse, sendErrorResponse } = require('../classes/Response');
const Categoria = require('../models/categoria');
const _ = require('underscore');

async function getAllCategories(req, res) {
    try {
        let categorias = await Categoria.find()
            .populate('usuario', 'nombre email')
            .exec();
        sendResponse(res, true, {categorias});
    } catch (error) {
        sendErrorResponse(res, 500, error);
    }
}

async function getCategoryByID(req, res){
    let id = req.params.id;
    try {
        let categoriaDB = await Categoria.findById(id).exec();
        if(!categoriaDB){
            sendErrorResponse(res, 400, null, 'El id no existe');
        }
        sendResponse(res, true, { categoria: categoriaDB });
    } catch (error) {
        sendErrorResponse(res, 500, error, 'Error al obtener la categoria');
    }
}

async function createCategory(req, res){
    let body = req.body;
    try {
        let categoria = new Categoria({
            nombre: body.nombre,
            usuario: req.usuario._id
        });
        await categoria.save();
        sendResponse(res, true, { categoria }, 'Se creó la categoría correctamente');
    } catch (error) {
        sendErrorResponse(res, 500, error);
    }
}

async function updateCategory(req, res){
    let id = req.params.id;
    let body = _.pick( req.body, ['nombre'] );

    try {
        let options = {
            new: true, 
            runValidators: true, 
            context: 'query'
        };
        let categoria = await Categoria.findByIdAndUpdate(id, body, options).exec();
        if(!categoria){
            sendErrorResponse(res, 400, null, 'El id no existe');
        }
        
        sendResponse(res, true, {categoria}, 'Se actualizó la categoría correctamente');

    } catch (error) {
        sendErrorResponse(res, 500, error);
    }
}

async function deleteCategory(req, res){
    let id = req.params.id;
    try {
        let categoria = await Categoria.findByIdAndRemove(id, {new: true, runValidators: true}).exec();
        if(!categoria){
            sendErrorResponse(res, 400, null, 'El id no existe');
        }
        sendResponse(res, true, {categoria}, 'Se eliminó la categoría correctamente');
    } catch (error) {
        sendErrorResponse(res, 500, error);
    }
}

module.exports = {
    getAllCategories,
    getCategoryByID,
    createCategory,
    updateCategory,
    deleteCategory
}