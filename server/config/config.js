// PUERTO

process.env.PORT = process.env.PORT || 3000;

// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// BD
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost/cafe';
}else{
    urlDB = 'mongodb+srv://lisethcastillo:bLtriQsmcRCN4cl7@cluster0.cs4cm.mongodb.net/cafe?retryWrites=true&w=majority';
}
process.env.URLDB = urlDB;