const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const CategoriaSchema = new Schema({

    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es requerido']
    },
    usuario: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario'
    }

});

CategoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});

module.exports = mongoose.model('Categoria', CategoriaSchema);