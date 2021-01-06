// Verificar Token

const jwt = require("jsonwebtoken");

let verificarToken = ( req, res, next ) => {

    let token = req.get('token');

    jwt.verify( token, process.env.SEED, ( err, decode ) => {

        if ( err ) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Usuario no autenticado. Token no valido'
            });
        }

        req.usuario = decode.usuario;

        next();

    });

}

let verificarRoleAdmin = (req, res, next) => {

    let usuario = req.usuario;

    if ( usuario.role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            ok: false,
            mensaje: 'El usuario no es administrador'
        });
    } else {
        next();
    }

}

module.exports = {
    verificarToken,
    verificarRoleAdmin
}