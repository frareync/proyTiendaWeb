import express from "express";
import cors from 'cors';

// IMPORTAMOS, NUESTRA TABLAS DE LA BASE DE DATOS
import productoRutas from './rutas/productoRutas.js';
import clienteRutas from './rutas/clienteRutas.js';
import vendedorRutas from './rutas/vendedorRutas.js';
import categotiaRutas from './rutas/categoriaRutas.js';
import compraRutas from './rutas/compraRutas.js';
import proveedorRutas from './rutas/proveedorRutas.js';
import proveeRutas from './rutas/proveeRutas.js';

import estadisticaRutas from './rutas/estadisticaRutas.js';


//import categoriaRutas from './rutas/categoriaRutas.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', productoRutas); // TABLA PRODUCTO
app.use('/', clienteRutas);  // TABLA CLIENTE
app.use('/', vendedorRutas);
app.use('/', categotiaRutas);
app.use('/', compraRutas);
app.use('/', proveedorRutas);
app.use('/', proveeRutas);

app.use('/', estadisticaRutas);

// define un puerto y arrancar el proyecto
const puerto = 3001;
app.listen(puerto, () => {
    console.log(`Servidor en http://localhost:${puerto}`);
});
