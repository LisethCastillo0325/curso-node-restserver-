// PUERTO

process.env.PORT = process.env.PORT || 3000;

// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del Token
process.env.CADUCIDAD_TOKEN = '30 days';

// SEED de autenticación
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

// BD
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost/cafe';
}else{
    urlDB = process.env.MONGODB_URI;
}
process.env.URLDB = urlDB;