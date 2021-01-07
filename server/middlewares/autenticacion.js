// Verificar Token

const jwt = require("jsonwebtoken");

const { sendResponse, sendErrorResponse } = require('../classes/Response');


let verificarToken = ( req, res, next ) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEED, ( err, decode ) => {
        if ( err ) {
            sendErrorResponse(res, 401, err, 'Usuario no autenticado. Token no valido');
        }
        req.usuario = decode.usuario;
        next();
    });

}

let verificarRoleAdmin = (req, res, next) => {

    let usuario = req.usuario;

    if ( usuario.role !== 'ADMIN_ROLE' ){
        sendErrorResponse(res, 401, null, 'El usuario no es administrador');
    } else {
        next();
    }
}

module.exports = {
    verificarToken,
    verificarRoleAdmin
}