import express from 'express';
import { insertaProducto, muestraProducto, muestraProductoPorId, actualizaProducto, eliminaProducto} from '../controladores/productoControlador.js';
 
const rutas=express.Router();
 
// rutas
rutas.get('/producto', muestraProducto);
rutas.post('/producto', insertaProducto);
rutas.get('/producto/:id_producto', muestraProductoPorId);
rutas.put('/producto/:id_producto', actualizaProducto);
rutas.delete('/producto/:id_producto', eliminaProducto);


export default rutas;
