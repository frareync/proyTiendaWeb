import { obtenerCantidadCategoria } from "../modelos/estadisticaModelos.js";

export const obtenerCantidadProducto=async(req, res)=>{
    try{
        const resultado = await obtenerCantidadCategoria();
        res.status(200).json(resultado);
    }catch(error){
        console.error(error)
    }
}