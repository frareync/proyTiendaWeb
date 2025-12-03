CREATE DATABASE TIENDA;

USE TIENDA;

CREATE TABLE CLIENTE (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    paterno VARCHAR(50),
    materno VARCHAR(50),
    nacionalidad VARCHAR(50)
);

CREATE TABLE VENDEDOR (
    id_vendedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    paterno VARCHAR(50),
    materno VARCHAR(50),
    telefono VARCHAR(20),
    direccion VARCHAR(100)
);

CREATE TABLE PROVEEDOR (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    paterno VARCHAR(50),
    materno VARCHAR(50),
    telefono VARCHAR(20),
    direccion VARCHAR(100),
    correo VARCHAR(100)
);

CREATE TABLE CATEGORIA (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200)
);

CREATE TABLE PRODUCTO (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    id_categoria INT,
    FOREIGN KEY (id_categoria) REFERENCES CATEGORIA(id_categoria)
);

CREATE TABLE COMPRA (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    id_cliente INT NOT NULL,
    id_vendedor INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto),
    FOREIGN KEY (id_cliente) REFERENCES CLIENTE(id_cliente),
    FOREIGN KEY (id_vendedor) REFERENCES VENDEDOR(id_vendedor)
);

CREATE TABLE PROVEE (
    id_provee INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    id_proveedor INT NOT NULL,
    fechaIngreso DATE NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto),
    FOREIGN KEY (id_proveedor) REFERENCES PROVEEDOR(id_proveedor)
);



INSERT INTO CLIENTE (nombre, paterno, materno, nacionalidad) VALUES
('Carlos', 'Mendez', 'Lopez', 'Boliviana'),
('Ana', 'Quispe', 'Flores', 'Peruana'),
('Luis', 'Rojas', 'Perez', 'Boliviana'),
('María', 'Gutierrez', 'Vargas', 'Chilena'),
('Jorge', 'Arias', 'Choque', 'Argentina');


INSERT INTO VENDEDOR (nombre, paterno, materno, telefono, direccion) VALUES
('Pedro', 'Santos', 'Lopez', '75542111', 'Av. Libertad 120'),
('Lucía', 'Rojas', 'Villa', '78965412', 'Calle Sucre 45'),
('Marco', 'Flores', 'Cruz', '70022334', 'Av. Banzer 900'),
('Rita', 'Poma', 'Mamani', '71233445', 'Barrio Los Pinos'),
('Hugo', 'Gomez', 'Perez', '74322110', 'Av. Alemana 333');


INSERT INTO PROVEEDOR (nombre, paterno, materno, telefono, direccion, correo) VALUES
('Mario', 'Luna', 'Vera', '71333445', 'Av. Busch 200', 'mario.luna@mail.com'),
('Elena', 'Tapia', 'Loza', '76544321', 'Calle Colon 89', 'elena.tapia@mail.com'),
('Ricardo', 'Vargas', 'Guzman', '70112233', 'Av. Cumavi 432', 'ricardo.v@mail.com'),
('Claudia', 'Serrano', 'Lopez', '78900112', 'Zona Central', 'claudia.s@mail.com'),
('Pablo', 'Montes', 'Rivera', '77654321', 'Calle Ayacucho 12', 'pablo.m@mail.com');


INSERT INTO CATEGORIA (nombre, descripcion) VALUES
('Bebidas', 'Productos líquidos para consumo'),
('Snacks', 'Aperitivos y botanas'),
('Limpieza', 'Artículos para limpieza del hogar'),
('Electrónica', 'Dispositivos y accesorios'),
('Ropa', 'Prendas de vestir');


INSERT INTO PRODUCTO (nombre, precio, stock, id_categoria) VALUES
('Coca-Cola 2L', 10.50, 30, 1),
('Doritos', 7.00, 50, 2),
('Detergente OMO', 22.00, 15, 3),
('Auriculares Bluetooth', 85.00, 10, 4),
('Polera Algodón', 35.00, 25, 5);


INSERT INTO COMPRA (id_producto, id_cliente, id_vendedor, cantidad) VALUES
(1, 1, 1, 2),
(2, 3, 2, 1),
(3, 2, 3, 3),
(4, 5, 4, 1),
(5, 4, 5, 2);


INSERT INTO PROVEE (id_producto, id_proveedor, fechaIngreso, cantidad) VALUES
(1, 1, '2025-01-10', 50),
(2, 2, '2025-01-12', 100),
(3, 3, '2025-01-14', 40),
(4, 4, '2025-01-15', 20),
(5, 5, '2025-01-18', 60);



# CONSULTAS
# la consulta es: todos los clientes q han comprado productos, y nombre de la categoria del producto

select DISTINCT xc.nombre, xc.paterno, xc.materno, p.nombre, ca.nombre as categoria_prod
from compra c, cliente xc, producto p, categoria ca
where xc.id_cliente=c.id_cliente and c.id_producto=p.id_producto and p.id_categoria=ca.id_categoria
