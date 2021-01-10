const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productoSchema = new Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es requerido'] 
    },
    precioUnitario: { 
        type: Number, 
        required: [true, 'El precio únitario es requerido'] 
    },
    descripcion: { 
        type: String, 
        required: false 
    },
    disponible: { 
        type: Boolean, 
        required: [true, 'La disponibilidad es requerida'], 
        default: true 
    },
    categoria: { 
        type: Schema.Types.ObjectId, 
        ref: 'Categoria', 
        required: [true, 'La categoria es requerida'] 
    },
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario' 
    }
});


module.exports = mongoose.model('Producto', productoSchema);