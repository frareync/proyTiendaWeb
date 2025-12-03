import {db} from '../config/db.js';

// MUESTAR LAS CATEGORIAS
export const obtTodo=async () => {
    const [resultado]=await db.query('SELECT * FROM CATEGORIA');
    return resultado;
}

// INSERTAR CATEGORIA
export const inserta=async (categoria) => {
    const {nombre, descripcion}=categoria;
    const [resultado]=await db.query('INSERT INTO categoria(nombre, descripcion) values (?,?)',[nombre, descripcion]);
    return resultado;
}

// BUSCA CATEGORIA POR ID
export const obtienePorId = async(id_categoria) => {
  const [resultado] = await db.query('SELECT * FROM categoria WHERE id_categoria = ?', [id_categoria]);
  return resultado[0];
};

// ACTUALIZA CATEGORIA (ALGUN ATRIBUTO)
export const actualiza = async (id_categoria, categoria) => {
  const {nombre, descripcion} = categoria;
  await db.query('UPDATE categoria SET nombre = ?, descripcion = ? WHERE id_categoria = ?', [nombre, descripcion, id_categoria]);
  return {id_categoria, ...categoria};
};

// ELIMINA CATEGORIA
export const elimina = async(id_categoria) => {
  // Verificar si existe
  const [rows] = await db.query('SELECT * FROM categoria WHERE id_categoria = ?',[id_categoria]);
  if (rows.length === 0) {
    throw new Error(`La Categoria no existe con el id = ${id_categoria}`);
  }

  // luego eliminar productos
  await db.query('DELETE FROM categoria WHERE id_categoria = ?',[id_categoria]);
  return id_categoria;
};

