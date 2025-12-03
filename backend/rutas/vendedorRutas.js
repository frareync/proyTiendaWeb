import express from 'express';
import {muestraVendedor, insertaVendedor, muestraVendedorPorId, actualizaVendedor, eliminaVendedor} from '../controladores/vendedorControlador.js';

 
const rutas=express.Router();
 
// rutas
rutas.get('/vendedor',muestraVendedor); // MUESTRA A LOS VENDEDORES
rutas.post('/vendedor', insertaVendedor);
rutas.get('/vendedor/:id_vendedor', muestraVendedorPorId);
rutas.put('/vendedor/:id_vendedor', actualizaVendedor);
rutas.delete('/vendedor/:id_vendedor', eliminaVendedor);

export default rutas;
