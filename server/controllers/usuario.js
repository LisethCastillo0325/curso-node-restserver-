const bcrypt = require('bcrypt');
const _ = require('underscore');

const { sendResponse, sendErrorResponse } = require('../classes/Response');
const Usuario = require('../models/usuario');

function getAllUser(req, res) {

    let desde  = req.query.desde || 0;
    let limite = req.query.limite || 5;
    let where  = {estado: true};

    desde  = Number(desde);
    limite = Number(limite);

    Usuario.find(where, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec( (err, usuarios) => {
            if(err){
                sendErrorResponse(res, 500, err, 'Error en la solicitud');
            }else{
                Usuario.countDocuments(where)
                .exec( (err, count) => {
                    sendResponse(res, true, {
                        usuarios,
                        rows: count
                    });
                });
            }
        });
}

function createUser(req, res) {

    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {
        if(err){
            sendErrorResponse(res, 500, err, 'Error al crear el usuario');
        }else{
            sendResponse(res, true, {
                usuario: usuarioDB
            });
        }
    } );
}

function updateUser(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']) ;

    Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if(err){
            sendErrorResponse(res, 500, err, 'Error al actualizar el usuario');
        }else{
            sendResponse(res, true, {
                usuario: usuarioDB
            });
        }
    });
}

function removeUser(req, res) {
    
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate( id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {
        if(err){
            sendErrorResponse(res, 500, err, 'Error al eliminar el usuario');
        }else{
            if(!usuarioBorrado){
                sendErrorResponse(res, 400, null, 'Usuario no encontrado');
            }else{
                sendResponse(res, true, {
                    usuario: usuarioBorrado
                });
            }
        }
    });
}

module.exports = {
    getAllUser,
    createUser,
    updateUser,
    removeUser
}