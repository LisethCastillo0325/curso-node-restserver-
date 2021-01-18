const fs = require('fs');

const { getPath, getPathDefault, validateType, validateExtension, deleteFile, generateFileName } = require('../utils/file');
const { sendResponse, sendErrorResponse } = require('../classes/Response');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Archivo = require('../models/archivo');


fileUploadToServer = async (req, res) => {

    let tipo = req.params.tipo;
    let id   = req.params.id;
    let archivo = req.files.archivo;
    let nombreArchivo;

    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            throw new Error('No se cargó archivos');
        }
        validateExtension(archivo);
        validateType(tipo);

        nombreArchivo = generateFileName(id, archivo);
        // Use the mv() method to place the file somewhere on your server
        await archivo.mv(`uploads/${tipo}/${nombreArchivo}`);

        await persistFile(tipo, id, nombreArchivo);
    
        sendResponse(res, true, null, `El archivo ${archivo.name} se cargó correctamente`);

    } catch (error) {
        try {
            deleteFile(nombreArchivo, tipo);
        } catch (error) {
            sendErrorResponse(res, 500, error, error.message);
        }finally{
            sendErrorResponse(res, 500, error, error.message);
        }
    }
}

getFile =  (req, res) => {
    let type = req.params.tipo;
    let fileName = req.params.nombre;
    try {  
        let pathFile = getPath(type, fileName);
        if(fs.existsSync(pathFile)){
            res.sendFile(pathFile);
        }else{
            let noFilePath = getPathDefault();
            res.sendFile(noFilePath);
        }

    } catch (error) {
        sendErrorResponse(res, 500, error, error.message);
    }
}

persistFile = async (type, id, fileName) => {
    let objeto;
    if(type === 'usuario'){
        objeto = await Usuario.findById(id).exec();
    }else if(type === 'producto'){
        objeto = await Producto.findById(id).exec();
    }

    if(! objeto){
        deleteFile(fileName, type);
        sendErrorResponse(res, 400, null,`El ${type} no existe`);
    }else{
        let archivo = new Archivo({
            tipo: type,
            url: `uploads/${type}/${fileName}`,
            path: getPath(type, fileName),
            nombre: fileName,
            documentoID: id
        });
        await archivo.save();
    }
}

module.exports = {
    fileUploadToServer,
    getFile
}