import { obtenerCantidadProducto } from "../controladores/estadisticaControlador.js";
import express from 'express'

const rutas=express.Router();

rutas.get('/estadistica', obtenerCantidadProducto);


export default rutas;