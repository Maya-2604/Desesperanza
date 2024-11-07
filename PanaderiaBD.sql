-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS panaderia;

-- Usar la base de datos
USE panaderia;

-- Crear la tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  imagen VARCHAR(255) NOT NULL
);

-- Insertar algunos productos de ejemplo
INSERT INTO productos (nombre, precio, imagen) VALUES
('Pan de Muerto', 25.00,'img/pan_muerto.jpg'),
('Galletas Día de Muertos', 30.00,  'img/galletas_DM.jpg'),
('Pie de Monstruo', 75.00, 'img/monster_pie.jpg');
