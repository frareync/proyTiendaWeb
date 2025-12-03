
import express from 'express';
import { muestraProvee, insertaProvee, muestraProveePorId, actualizaProvee, eliminaProvee} from '../controladores/proveeControlador.js';


const rutas=express.Router();

// rutas
rutas.get('/provee', muestraProvee);
rutas.post('/provee', insertaProvee);
rutas.get('/provee/:id_provee', muestraProveePorId);
rutas.put('/provee/:id_provee', actualizaProvee);
rutas.delete('/provee/:id_provee', eliminaProvee);


export default rutas;
