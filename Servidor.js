const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Crear la conexión a la base de datos
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

// Middleware para manejar las peticiones JSON y urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ruta para obtener todos los productos y mostrar en tabla HTML
app.get('/obtenerProductos', (req, res) => {
  connection.query('SELECT * FROM productos', (err, results) => {
    if (err) {
      console.error('Error al obtener productos', err);
      return res.status(500).send('Error al obtener productos');
    }

    let productHTML = '';
    results.forEach((product, index) => {
      productHTML += `
        <tr>
          <td>${product.id}</td>
          <td>${product.nombre}</td>
          <td>${product.precio}</td>
          <td><img src="${product.imagen}" alt="${product.nombre}" width="50"></td>
          <td>
            <form action="/eliminar_producto/${product.id}" method="POST" style="display:inline;">
              <button type="submit" class="btn btn-danger">Eliminar</button>
            </form>
          </td>
        </tr>
      `;
    });

    res.send(`
      <html>
        <head>
          <title>Lista de Productos</title>
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
          <h1>Productos de Panadería</h1>
          <a href="/agregarProductoForm" class="btn btn-success">Agregar Producto</a>
          <table border="1" cellpadding="10" cellspacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${productHTML}
            </tbody>
          </table>
        </body>
      </html>
    `);
  });
});

// Ruta para mostrar el formulario de agregar producto
app.get('/agregarProductoForm', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Agregar Producto</title>
      </head>
      <body>
        <h1>Agregar Producto</h1>
        <form action="/agregar_producto" method="POST">
          <label for="nombreProducto">Nombre del Producto</label>
          <input type="text" name="nombreproducto" id="nombreProducto" required><br>
          <label for="precioProducto">Precio del Producto</label>
          <input type="number" name="precioProducto" id="precioProducto" required><br>
          <label for="imagenProducto">URL de la Imagen</label>
          <input type="url" name="imagenProducto" id="imagenProducto" required><br>
          <button type="submit">Agregar Producto</button>
        </form>
        <a href="/obtenerProductos">Ver Productos</a>
      </body>
    </html>
  `);
});

// Ruta para agregar un producto
app.post('/agregar_producto', (req, res) => {
  const { nombreproducto, precioProducto, imagenProducto } = req.body;

  if (!nombreproducto || !precioProducto || !imagenProducto) {
    return res.status(400).send('Faltan datos');
  }

  const query = 'INSERT INTO productos (nombre, precio, imagen) VALUES (?, ?, ?)';
  connection.query(query, [nombreproducto, precioProducto, imagenProducto], (err, respuesta) => {
    if (err) {
      res.status(500).send('Error al agregar el producto');
      console.log(err);
      
      return;
    }
    // Redirigir a la página de productos después de agregar
    res.redirect('/obtenerProductos');
  });
});

// Ruta para eliminar un producto
app.post('/eliminar_producto/:id', (req, res) => {
  const { id } = req.params;

  // Consulta SQL para eliminar el producto
  connection.query('DELETE FROM productos WHERE id = ?', [id], (err, resultado) => {
    if (err) {
      console.log('Error al eliminar producto:', err);
      return res.status(500).send('Error al eliminar producto');
    }

    // Si el producto no fue encontrado
    if (resultado.affectedRows === 0) {
      return res.status(404).send('Producto no encontrado');
    }

    // Redirigir de vuelta a la lista de productos después de eliminar
    res.redirect('/obtenerProductos');
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
