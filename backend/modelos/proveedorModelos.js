import { db } from '../config/db.js';

// MUESTRA LOS PROVEEDORES
export const obtTodo = async () => {
  const [resultado] = await db.query('SELECT * FROM PROVEEDOR');
  return resultado;
}



// INSERTAR PROVEEDORES
export const inserta = async (proveedor) => {
  const { ci, nombre, paterno, materno, telefono, direccion, correo } = proveedor;
  const [resultado] = await db.query('INSERT INTO PROVEEDOR(ci, nombre, paterno, materno, telefono, direccion, correo) values (?,?,?,?,?,?,?)', [ci, nombre, paterno, materno, telefono, direccion, correo]);
  return resultado;
}



// BUSCA PROVEEDOR POR ID
export const obtienePorId = async (id_proveedor) => {
  const [resultado] = await db.query('SELECT * FROM proveedor WHERE id_proveedor = ?', [id_proveedor]);
  return resultado[0];
};



// ACTUALIZA PROVEEDOR (ALGUN ATRIBUTO)
export const actualiza = async (id_proveedor, proveedor) => {
  const { ci, nombre, paterno, materno, telefono, direccion, correo } = proveedor;
  await db.query('UPDATE proveedor SET ci = ?, nombre = ?, paterno = ?, materno = ?, telefono = ?, direccion = ?, correo = ? WHERE id_proveedor= ?', [ci, nombre, paterno, materno, telefono, direccion, correo, id_proveedor]);
  return { id_proveedor, ...proveedor };
};



// ELIMINA PROVEEDORES
export const elimina = async (id_proveedor) => {
  // Verificar si existe
  const [rows] = await db.query('SELECT * FROM proveedor WHERE id_proveedor = ?', [id_proveedor]);
  if (rows.length === 0) {
    throw new Error(`El proveedor no existe con el id = ${id_proveedor}`);
  }

  // luego eliminar productos
  await db.query('DELETE FROM proveedor WHERE id_proveedor = ?', [id_proveedor]);
  return id_proveedor;
};
