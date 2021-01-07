const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne( { email: body.email }, (err, usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                message: 'Usuario o contraseña incorrectos.'
            })
        }

        if (! bcrypt.compareSync( body.password, usuarioDB.password )){
            return res.status(400).json({
                ok: false,
                message: 'Usuario o contraseña incorrectos'
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            data: usuarioDB,
            token
        });

    } );

});


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


app.post('/google', async (req, res) => {

    let token = req.body.idtoken;
    try {

        let googleUser = await verify( token );

        Usuario.findOne({ email: googleUser.email }, (err, usuarioDB)=>{
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            if( usuarioDB ){

                if(usuarioDB.google === false){
                    res.status(400).json({
                        ok: false,
                        message: 'Debe de usar su autenticación normal'
                    });
                }else{

                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    return res.json({
                        ok: true,
                        usuario: googleUser,
                        token
                    });
                }
            }else{
                // Si el usario no existe en la base de datos
                let usuario = new Usuario();
                usuario.nombre = googleUser.name;
                usuario.email = googleUser.email;
                usuario.img = googleUser.picture;
                usuario.google = true;
                usuario.password = 'N/A';
                usuario.save( (err, usuarioDB) => {
                    if(err){
                        res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    return res.json({
                        ok: true,
                        usuario: googleUser,
                        token
                    });
                });
            }
        });


        

    } catch (error) {
        res.status(403).json({
            ok: false,
            error
        });
    }
});

module.exports = app;