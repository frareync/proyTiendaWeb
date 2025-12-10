CREATE DATABASE TIENDA;

USE TIENDA;

CREATE TABLE CLIENTE (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    ci VARCHAR(12), -- Se agrega campo CI (Cédula de Identidad)
    nombre VARCHAR(50) NOT NULL,
    paterno VARCHAR(50),
    materno VARCHAR(50),
    nacionalidad VARCHAR(50)
);

CREATE TABLE VENDEDOR (
    id_vendedor INT AUTO_INCREMENT PRIMARY KEY,
    ci VARCHAR(12), -- Se agrega campo CI (Cédula de Identidad)
    nombre VARCHAR(50) NOT NULL,
    paterno VARCHAR(50),
    materno VARCHAR(50),
    telefono VARCHAR(20),
    direccion VARCHAR(100)
);

CREATE TABLE PROVEEDOR (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    ci VARCHAR(12), -- Se agrega campo CI (Cédula de Identidad)
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
    fecha_compra DATE DEFAULT (CURRENT_DATE), -- Se agrega fecha de compra
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

CREATE TABLE USUARIO (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasenia VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('ADMIN', 'VENDEDOR')),
    id_vendedor INT UNIQUE,
    FOREIGN KEY (id_vendedor) REFERENCES VENDEDOR(id_vendedor)
);


-- Se agregan valores de CI en las inserciones de CLIENTE
INSERT INTO CLIENTE (ci, nombre, paterno, materno, nacionalidad) VALUES
('1234567', 'Carlos', 'Mendez', 'Lopez', 'Boliviana'),
('2345678', 'Ana', 'Quispe', 'Flores', 'Peruana'),
('3456789', 'Luis', 'Rojas', 'Perez', 'Boliviana'),
('4567890', 'María', 'Gutierrez', 'Vargas', 'Chilena'),
('5678901', 'Jorge', 'Arias', 'Choque', 'Argentina');


-- Se agregan valores de CI en las inserciones de VENDEDOR
INSERT INTO VENDEDOR (ci, nombre, paterno, materno, telefono, direccion) VALUES
('2776655', 'Felix', 'Apaza', 'Pari', '69454533', 'Av. Kollasuyo 10'),
('8765432', 'Pedro', 'Santos', 'Lopez', '75542111', 'Av. Libertad 120'),
('7654321', 'Lucía', 'Rojas', 'Villa', '78965412', 'Calle Sucre 45'),
('6543210', 'Marco', 'Flores', 'Cruz', '70022334', 'Av. Banzer 900'),
('5432109', 'Rita', 'Poma', 'Mamani', '71233445', 'Barrio Los Pinos'),
('4321098', 'Hugo', 'Gomez', 'Perez', '74322110', 'Av. Alemana 333');


-- Se agregan valores de CI en las inserciones de PROVEEDOR
INSERT INTO PROVEEDOR (ci, nombre, paterno, materno, telefono, direccion, correo) VALUES
('1122334', 'Mario', 'Luna', 'Vera', '71333445', 'Av. Busch 200', 'mario.luna@mail.com'),
('2233445', 'Elena', 'Tapia', 'Loza', '76544321', 'Calle Colon 89', 'elena.tapia@mail.com'),
('3344556', 'Ricardo', 'Vargas', 'Guzman', '70112233', 'Av. Cumavi 432', 'ricardo.v@mail.com'),
('4455667', 'Claudia', 'Serrano', 'Lopez', '78900112', 'Zona Central', 'claudia.s@mail.com'),
('5566778', 'Pablo', 'Montes', 'Rivera', '77654321', 'Calle Ayacucho 12', 'pablo.m@mail.com');


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


-- Se agregan fechas de compra en las inserciones
INSERT INTO COMPRA (id_producto, id_cliente, id_vendedor, cantidad, fecha_compra) VALUES
(1, 1, 1, 2, '2025-12-10'),
(2, 3, 2, 1, '2025-12-10'),
(3, 2, 3, 3, '2025-12-10'),
(4, 5, 4, 1, '2025-12-10'),
(5, 4, 5, 2, '2025-12-10');


INSERT INTO PROVEE (id_producto, id_proveedor, fechaIngreso, cantidad) VALUES
(1, 1, '2025-11-10', 50),
(2, 2, '2025-11-10', 100),
(3, 3, '2025-11-10', 40),
(4, 4, '2025-11-10', 20),
(5, 5, '2025-11-10', 60);



# CONSULTAS
# la consulta es: todos los clientes q han comprado productos, y nombre de la categoria del producto

select DISTINCT xc.nombre, xc.paterno, xc.materno, p.nombre, ca.nombre as categoria_prod
from compra c, cliente xc, producto p, categoria ca
where xc.id_cliente=c.id_cliente and c.id_producto=p.id_producto and p.id_categoria=ca.id_categoria
