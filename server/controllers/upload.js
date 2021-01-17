const fs = require('fs');
const path = require('path');

const { sendResponse, sendErrorResponse } = require('../classes/Response');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Archivo = require('../models/archivo');
const { getHeapSnapshot } = require('v8');

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
        console.log(error);
        try {
            deleteFile(nombreArchivo, tipo);
        } catch (error) {
            sendErrorResponse(res, 500, error, error.message);
        }
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
            documentoID: id
        });
        await archivo.save();
    }
}

deleteFile = (fileName, type) => {
    let pathFile = getPath(type, fileName);
    if(fs.existsSync(pathFile)){
        fs.unlinkSync(pathFile);
    }else{
        console.log('no existe: ', pathFile);
    }
}

validateExtension = (file) => {
    let extension = getFileExtension(file);
    let extensionesValidas = ['jpg', 'png', 'jpeg', 'gif'];
    if(extensionesValidas.indexOf(extension) < 0){
        throw new Error(`La extensión ${extension} no es válida. Extensiones permitidas ${extensionesValidas.join(', ')}`);
    }
}

validateType = (tipo) => {
    let tiposValidos = ['usuario','producto'];
    if(tiposValidos.indexOf(tipo) < 0){
        throw new Error(`Los tipos validos son ${tiposValidos.join(', ')} `);
    }
}

getPath = (type, fileName) => {
    let pathFile = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);
    console.log(pathFile);
    return pathFile;
}

getFileExtension = (file) => {
    let arrArchivo = file.name.split('.');
    return arrArchivo[arrArchivo.length -1];
}

generateFileName = (id, file) => {
    let extension = getFileExtension(file);
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    return nombreArchivo;
}

module.exports = {
    fileUploadToServer
}