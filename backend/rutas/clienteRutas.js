import express from 'express';
import {muestraCliente, insertaCliente, muestraClientePorId, actualizaCliente, eliminaCliente} from '../controladores/clienteControlador.js';

 
const rutas=express.Router();
 
// rutas
rutas.get('/cliente',muestraCliente); // MUESTRA A LOS CLIENTES
rutas.post('/cliente', insertaCliente); // DIRECCION
rutas.get('/cliente/:id_cliente', muestraClientePorId); 
rutas.put('/cliente/:id_cliente', actualizaCliente);
rutas.delete('/cliente/:id_cliente', eliminaCliente);


export default rutas;
