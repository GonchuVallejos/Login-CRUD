//Archivo para almacenar las posibles claves para utilizar en servicios, por ej Nro de puerto, conexion a BD, etc
module.exports = {
    database: {
        host: 'localhost',
        user: process.env.BD_USER,
        password:  process.env.BD_PASS,
        database: 'db_links'
    }
}