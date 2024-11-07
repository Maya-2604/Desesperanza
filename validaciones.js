const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: 'm6y407', 
  database: 'panaderia' 
});

// Verificar la conexión
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos como ID ' + connection.threadId);
});

// Función para cerrar la conexión cuando sea necesario
function cerrarConexion() {
  connection.end((err) => {
    if (err) {
      console.error('Error al cerrar la conexión:', err.stack);
    } else {
      console.log('Conexión cerrada');
    }
  });
}
 app.listen(port, () =>{
    console.log('Servidor correindo en http://localhost:${port}');
 });

// Exportar la conexión y la función de cierre
module.exports = { connection, cerrarConexion };
