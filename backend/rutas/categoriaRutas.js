import express from 'express';
import { muestraCategoria, insertaCategoria, muestraCategoriaPorId, actualizaCategoria, eliminaCategoria} from '../controladores/categoriaControlador.js';


const rutas=express.Router();
 
// rutas
rutas.get('/categoria', muestraCategoria);
rutas.post('/categoria', insertaCategoria);
rutas.get('/categoria/:id_categoria', muestraCategoriaPorId);
rutas.put('/categoria/:id_categoria', actualizaCategoria);
rutas.delete('/categoria/:id_categoria', eliminaCategoria);


export default rutas;
