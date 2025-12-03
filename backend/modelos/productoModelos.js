import {db} from '../config/db.js';

// MUESTRA LOS PRODUCTOS
export const obtTodo=async () => {
    const [resultado]=await db.query('SELECT * FROM PRODUCTO');
    return resultado;
}

// INSERTAR PRODUCTOS
export const inserta=async (producto) => {
    const {nombre, precio, stock, id_categoria}=producto;
    const [resultado]=await db.query('INSERT INTO PRODUCTO(nombre, precio, stock, id_categoria) values (?,?,?,?)',[nombre,precio, stock, id_categoria]);
    return resultado;
}

// BUSCA PRODUCTOS POR ID
export const obtienePorId = async(id_producto) => {
  const [resultado] = await db.query('SELECT * FROM producto WHERE id_producto = ?', [id_producto]);
  return resultado[0];
};

// ACTUALIZA PRODUCTOS (ALGUN ATRIBUTO)
export const actualiza = async (id_producto, producto) => {
  const {nombre, precio, stock, id_categoria} = producto;
  await db.query('UPDATE producto SET nombre = ?, precio = ?, stock = ?, id_categoria = ? WHERE id_producto = ?', [nombre, precio, stock, id_categoria, id_producto]);
  return {id_producto, ...producto};
};


// ELIMINA PRODUCTOS
export const elimina = async(id_producto) => {
  // Verificar si existe
  const [rows] = await db.query('SELECT * FROM producto WHERE id_producto = ?',[id_producto]);
  if (rows.length === 0) {
    throw new Error(`El producto no existe con el id = ${id_producto}`);
  }

  // luego eliminar productos
  await db.query('DELETE FROM producto WHERE id_producto = ?',[id_producto]);
  return id_producto;
};

