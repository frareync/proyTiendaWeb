import {db} from '../config/db.js';

// MUESTRA LAS COMPRAS
export const obtTodo=async () => {
    const [resultado]=await db.query('SELECT * FROM COMPRA');
    return resultado;
}

// INSERTAR COMPRAS
export const inserta=async (compra) => {
    const {id_producto, id_cliente, id_vendedor, cantidad}=compra;
    const [resultado]=await db.query('INSERT INTO COMPRA(id_producto, id_cliente, id_vendedor, cantidad) values (?,?,?,?)',[id_producto, id_cliente, id_vendedor, cantidad]);
    return resultado;
}


// BUSCA COMPRAS POR ID
export const obtienePorId = async(id_compra) => {
  const [resultado] = await db.query('SELECT * FROM COMPRA WHERE id_compra = ?', [id_compra]);
  return resultado[0];
};

/*
// BUSCA COMPRAS POR ID (CON DATOS COMPLETOS)
export const obtienePorId = async (id_compra) => {
  const [resultado] = await db.query(
    `SELECT 
        C.id_compra,
        C.cantidad,
        
        P.id_producto,
        P.nombre AS producto,
        P.precio,
        
        CL.id_cliente,
        CL.nombre AS cliente,
        CL.paterno AS cliente_paterno,
        
        V.id_vendedor,
        V.nombre AS vendedor,
        V.paterno AS vendedor_paterno
        
    FROM COMPRA C
    INNER JOIN PRODUCTO P ON C.id_producto = P.id_producto
    INNER JOIN CLIENTE CL ON C.id_cliente = CL.id_cliente
    INNER JOIN VENDEDOR V ON C.id_vendedor = V.id_vendedor
    WHERE C.id_compra = ?`,
    [id_compra]
  );

  return resultado[0];
};
*/



// ACTUALIZA COMPRAS (ALGUN ATRIBUTO)
export const actualiza = async (id_compra, compra) => {
  const {id_producto, id_cliente, id_vendedor, cantidad} = compra;
  await db.query('UPDATE compra SET id_producto = ?, id_cliente = ?, id_vendedor = ?, cantidad = ? WHERE id_compra = ?', [id_producto, id_cliente, id_vendedor, cantidad, id_compra]);
  return {id_compra, ...compra};
};



// ELIMINA COMPRAS
export const elimina = async(id_compra) => {
  // Verificar si existe
  const [rows] = await db.query('SELECT * FROM COMPRA WHERE id_compra = ?',[id_compra]);
  if (rows.length === 0) {
    throw new Error(`La Compra no existe con el id = ${id_compra}`);
  }

  // luego eliminar productos
  await db.query('DELETE FROM compra WHERE id_compra = ?',[id_compra]);
  return id_compra;
};