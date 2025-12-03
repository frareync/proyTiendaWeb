import {db} from '../config/db.js';

export const obtenerCantidadCategoria=async()=>{
    const [resultado]=await db.query(`SELECT c.nombre, count(*) cantidad
                    from producto p, categoria c
                    where p.id_categoria=c.id_categoria
                    Group by c.nombre`)
    return resultado
}