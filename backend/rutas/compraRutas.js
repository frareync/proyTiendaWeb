import express from 'express';
import { muestraCompra, insertaCompra, muestraCompraPorId, actualizaCompra, eliminaCompra} from '../controladores/compraControlador.js';
 
const rutas=express.Router();
 
// rutas
rutas.get('/compra', muestraCompra);
rutas.post('/compra', insertaCompra);
rutas.get('/compra/:id_compra', muestraCompraPorId);
rutas.put('/compra/:id_compra', actualizaCompra);
rutas.delete('/compra/:id_compra', eliminaCompra);


export default rutas;
