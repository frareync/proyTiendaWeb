import { db } from '../config/db.js';

// MUESTRA LOS CLIENTES
export const obtCliente = async () => {
  const [resultado] = await db.query('SELECT * FROM CLIENTE');
  return resultado;
}


// INSERTAR CLIENTES
export const inserta = async (cliente) => {
  const { ci, nombre, paterno, materno, nacionalidad } = cliente;
  const [resultado] = await db.query('INSERT INTO CLIENTE(ci, nombre, paterno, materno, nacionalidad) values (?,?,?,?,?)', [ci, nombre, paterno, materno, nacionalidad]);
  return resultado;
}


// BUSCA CLIENTE POR ID
export const obtienePorId = async (id_cliente) => {
  const [resultado] = await db.query('SELECT * FROM cliente WHERE id_cliente = ?', [id_cliente]);
  return resultado[0];
};


// ACTUALIZA PRODUCTOS (ALGUN ATRIBUTO)
export const actualiza = async (id_cliente, cliente) => {
  const { ci, nombre, paterno, materno, nacionalidad } = cliente;
  await db.query('UPDATE cliente SET ci = ?, nombre = ?, paterno = ?, materno = ?, nacionalidad = ? WHERE id_cliente = ?', [ci, nombre, paterno, materno, nacionalidad, id_cliente]);
  return { id_cliente, ...cliente };
};


// ELIMINA CLIENTE
export const elimina = async (id_cliente) => {
  // Verificar si existe
  const [rows] = await db.query('SELECT * FROM cliente WHERE id_cliente = ?', [id_cliente]);
  if (rows.length === 0) {
    throw new Error(`El Cliente no existe con el id = ${id_cliente}`);
  }
  // luego elimino Cliente
  await db.query('DELETE FROM cliente WHERE id_cliente = ?', [id_cliente]);
  return id_cliente;
};


