//Es el archivo que tiene la conexion a MySQL pero no acepta promesas
const mysql = require('mysql'); 
const {promisify} = require('util'); //Se exporta util para poder usar promesas

const {database} = require('./keys');

const pool = mysql.createPool(database); //Hace la coneccion con pool xq crea hilos y es más liviano

pool.getConnection((err, connection) => {//SE VALIDAN 3 TIPOS DE ERRORES
    if (err){
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { //1° LA CONEXION SE PERDIO
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') { //2° COMPROBAR CUANTAS CONEXIONES TIENE HASTA EL MOMENTO
            console.error('DATABASE HAS TO MANY CONNECTION');
        }
        if(err.code === 'ECONREFUSED') { //3° CUANDO LA CONEXION HAYA SIDO RECHAZADA
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if (connection) connection.release();
    console.log('DB IS CONNECT');
    return;
});

//Promisify Pool Querys
pool.query = promisify(pool.query);

module.exports = pool;