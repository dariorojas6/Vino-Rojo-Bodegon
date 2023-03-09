const mongoose = require('mongoose');
require('dotenv').config();
const URL = process.env.MONGO;///uri de mongo///
const URL_DEPLOY = process.env.DB_DEPLOY
/////conexion a mongoose/////
mongoose.set('strictQuery', true);

const connection = mongoose.connect(URL_DEPLOY,{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('[Mongoose] - Conectado a MongoDB');
});
mongoose.connection.on('error',(error)=>{
    console.log('[Mongoose]-Error:',error);
});
module.exports = connection;
