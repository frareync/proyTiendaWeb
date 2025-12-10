import { db } from '../config/db.js';

// MUESTRA LAS COMPRAS
export const obtTodo = async () => {
  const [resultado] = await db.query('SELECT * FROM COMPRA');
  return resultado;
}

// INSERTAR COMPRAS
export const inserta = async (compra) => {
  const { id_producto, id_cliente, id_vendedor, cantidad, fecha_compra } = compra;
  // Si fecha_compra viene, se usa; si no, la base de datos pondrá el default
  if (fecha_compra) {
    const [resultado] = await db.query('INSERT INTO COMPRA(id_producto, id_cliente, id_vendedor, cantidad, fecha_compra) values (?,?,?,?,?)', [id_producto, id_cliente, id_vendedor, cantidad, fecha_compra]);
    return resultado;
  } else {
    const [resultado] = await db.query('INSERT INTO COMPRA(id_producto, id_cliente, id_vendedor, cantidad) values (?,?,?,?)', [id_producto, id_cliente, id_vendedor, cantidad]);
    return resultado;
  }
}


// BUSCA COMPRAS POR ID
export const obtienePorId = async (id_compra) => {
  const [resultado] = await db.query('SELECT * FROM COMPRA WHERE id_compra = ?', [id_compra]);
  return resultado[0];
};

// BUSCA COMPRAS POR FECHA (Para Reportes)
export const obtienePorFecha = async (fecha) => {
  // Filtramos por la columna fecha_compra
  const [resultado] = await db.query('SELECT * FROM COMPRA WHERE fecha_compra = ?', [fecha]);
  return resultado;
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



// ACTUALIZA COMPRAS (SI ALGUN DATO ESTA MAL)
export const actualiza = async (id_compra, compra) => {
  // Desarmamos el objeto compra para sacar sus datos
  const { id_producto, id_cliente, id_vendedor, cantidad, fecha_compra } = compra;

  // LOGICA PARA NO PERDER LA FECHA SI NO VIENE EN EL FORMULARIO
  // Si la fecha_compra tiene valor (no es undefined), actualizamos TODO
  if (fecha_compra) {
    await db.query(
      'UPDATE compra SET id_producto = ?, id_cliente = ?, id_vendedor = ?, cantidad = ?, fecha_compra = ? WHERE id_compra = ?',
      [id_producto, id_cliente, id_vendedor, cantidad, fecha_compra, id_compra]
    );
  } else {
    // Si NO viene la fecha (es undefined o vacia), NO TOCAMOS la columna fecha_compra
    // Asi mantenemos la fecha original que ya estaba guardada
    await db.query(
      'UPDATE compra SET id_producto = ?, id_cliente = ?, id_vendedor = ?, cantidad = ? WHERE id_compra = ?',
      [id_producto, id_cliente, id_vendedor, cantidad, id_compra]
    );
  }

  // Devolvemos los datos para confirmar
  return { id_compra, ...compra };
};



// ELIMINA COMPRAS
export const elimina = async (id_compra) => {
  // Verificar si existe
  const [rows] = await db.query('SELECT * FROM COMPRA WHERE id_compra = ?', [id_compra]);
  if (rows.length === 0) {
    throw new Error(`La Compra no existe con el id = ${id_compra}`);
  }

  // luego eliminar productos
  await db.query('DELETE FROM compra WHERE id_compra = ?', [id_compra]);
  return id_compra;
};
