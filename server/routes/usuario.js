const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificarToken, verificarRoleAdmin } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', verificarToken, function (req, res) {

    let desde  = req.query.desde || 0;
    let limite = req.query.limite || 5;

    desde  = Number(desde);
    limite = Number(limite);

    let where = {estado: true};

    Usuario.find(where, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec( (err, usuarios) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }

            Usuario.countDocuments(where)
                .exec( (err, count) => {
                    res.json({
                        ok: true,
                        data: usuarios,
                        rows: count
                    });
                });
        });

});

app.post('/usuario', [verificarToken, verificarRoleAdmin], function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
       
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    } );

});

app.put('/usuario/:id', [verificarToken, verificarRoleAdmin], function (req, res) {

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']) ;

    Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            data: usuarioDB
        });


    });

});

app.delete('/usuario/:id', [verificarToken, verificarRoleAdmin], function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate( id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {
        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                messge: 'Usuario no encontrado'
            });
        }

        res.json({
            ok: true,
            data: usuarioBorrado
        });
    });


});

module.exports = app;