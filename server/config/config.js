//=======================================
// Puerto
//=======================================
process.env.PORT = process.env.PORT || 3000;
//=======================================
// Entorno
//=======================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//=======================================
// Base de datos
//=======================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://strider:VqsyXwvRUL0OuPK2@cluster0-d8ugc.mongodb.net/cafe'
}
process.env.URLDB = urlDB;
