const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const CategoriaSchema = new mongoose.Schema({

    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es requerido']
    },
    usuario: {
        type: String,
        required: [true, 'El usuario es requerido']
    }

});

CategoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});

module.exports = mongoose.model('Categoria', CategoriaSchema);