import express from 'express';
import { muestraProveedor, insertaProveedor, muestraProveedorPorId, actualizaProveedor, eliminaProveedor} from '../controladores/proveedorControlador.js';
 
const rutas=express.Router();
 
// rutas
rutas.get('/proveedor', muestraProveedor);
rutas.post('/proveedor', insertaProveedor);
rutas.get('/proveedor/:id_proveedor', muestraProveedorPorId);
rutas.put('/proveedor/:id_proveedor', actualizaProveedor);
rutas.delete('/proveedor/:id_proveedor', eliminaProveedor);


export default rutas;
