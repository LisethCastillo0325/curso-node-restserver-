const fs = require('fs');
const path = require('path');

getPath = (type, fileName) => {
    let pathFile = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);
    return pathFile;
}

getPathDefault = () => {
    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    return noImagePath;
}

validateType = (tipo) => {
    let tiposValidos = ['usuario','producto'];
    if(tiposValidos.indexOf(tipo) < 0){
        throw new Error(`Los tipos validos son ${tiposValidos.join(', ')} `);
    }
}

getFileExtension = (file) => {
    let arrArchivo = file.name.split('.');
    return arrArchivo[arrArchivo.length -1];
}

validateExtension = (file) => {
    validateImageExtension(file);
}

validateImageExtension = (file) => {
    let extension = getFileExtension(file);
    let extensionesValidas = ['jpg', 'png', 'jpeg', 'gif'];
    if(extensionesValidas.indexOf(extension) < 0){
        throw new Error(`La extensión ${extension} no es válida. Extensiones permitidas ${extensionesValidas.join(', ')}`);
    }
}

deleteFile = (fileName, type) => {
    let pathFile = getPath(type, fileName);
    if(fs.existsSync(pathFile)){
        fs.unlinkSync(pathFile);
    }
}

generateFileName = (id, file) => {
    let extension = getFileExtension(file);
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    return nombreArchivo;
}

module.exports = {
    getPath,
    getPathDefault,
    validateType,
    getFileExtension,
    validateExtension,
    validateImageExtension,
    deleteFile,
    generateFileName
}