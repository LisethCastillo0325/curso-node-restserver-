const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const Usuario = require('../models/usuario');
const { sendResponse } = require('../classes/Response');

const client = new OAuth2Client(process.env.CLIENT_ID);

async function login( req, res ) {

    let body = req.body;
    try {
        let usuarioDB = await Usuario.findOne( { email: body.email } ).exec();
        if(!usuarioDB){
            sendErrorResponse(res, 400, null,'Usuario o contraseña incorrectos.');
        }
        if (! bcrypt.compareSync( body.password, usuarioDB.password )){
            sendErrorResponse(res, 400, null,'Usuario o contraseña incorrectos');
        }

        let token = generateToken(usuarioDB);
        sendResponse(res, true, {usuario: usuarioDB, token});
    } catch (error) {
        sendErrorResponse(res, 500, error);
    }
}


async function googleSingIn ( req, res ) {

    let token = req.body.idtoken;
    try {
        let googleUser = await verify( token );
        let usuarioDB  = await Usuario.findOne({ email: googleUser.email }).exec();
           
        if( usuarioDB ){
            if(usuarioDB.google === false){
                sendErrorResponse(res, 400, null, 'Debe de usar su autenticación normal');
            }else{
                let token = generateToken(usuarioDB);
                sendResponse(res, true, {usuario: googleUser, token});
            }
        }else{
            // Si el usario no existe en la base de datos
            let usuario = new Usuario();
            usuario.nombre = googleUser.name;
            usuario.email  = googleUser.email;
            usuario.img    = googleUser.picture;
            usuario.google = true;
            usuario.password = 'N/A';
            usuarioDB = await usuario.save();

            let token = generateToken(usuarioDB);
            sendResponse(res, true, {usuario: googleUser, token});
        }
        
    } catch (error) {
        sendErrorResponse(res, 403, error);
    }
}

async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

function generateToken( usuarioDB ){
    return jwt.sign(
        {
            usuario: usuarioDB
        }, 
        process.env.SEED, 
        { 
            expiresIn: process.env.CADUCIDAD_TOKEN 
        }
    );
}


module.exports = {
    login,
    googleSingIn
}