import {db} from '../config/db.js';

// MOSTRAR PROVEE
export const obtTodo=async () => {
    const [resultado]=await db.query('SELECT * FROM PROVEE');
    return resultado;
}

// INSERTAR PROVEE
export const inserta=async (provee) => {
    const {id_producto, id_proveedor, fechaIngreso, cantidad}=provee;
    const [resultado]=await db.query('INSERT INTO PROVEE(id_producto, id_proveedor, fechaIngreso, cantidad) values (?,?,?,?)',[id_producto, id_proveedor, fechaIngreso, cantidad]);
    return resultado;
}

// BUSCA PROVEE POR ID
export const obtienePorId = async(id_provee) => {
  const [resultado] = await db.query('SELECT * FROM provee WHERE id_provee = ?', [id_provee]);
  return resultado[0];
};


// ACTUALIZA PROVEE (ALGÚN ATRIBUTO)
export const actualiza = async (id_provee, provee) => {
    const { id_producto, id_proveedor, fechaIngreso, cantidad } = provee;
    // Validar que el producto existe
    const [prod] = await db.query("SELECT id_producto FROM producto WHERE id_producto = ?",[id_producto]);
    if (prod.length === 0) {
        throw new Error(`El producto con id ${id_producto} no existe`);
    }
    // Validar que el proveedor existe
    const [prov] = await db.query("SELECT id_proveedor FROM proveedor WHERE id_proveedor = ?",[id_proveedor]);
    if (prov.length === 0) {
        throw new Error(`El proveedor con id ${id_proveedor} no existe`);
    }
    // Actualizar normalmente
    await db.query(
        "UPDATE provee SET id_producto = ?, id_proveedor = ?, fechaIngreso = ?, cantidad = ? WHERE id_provee = ?",[id_producto, id_proveedor, fechaIngreso, cantidad, id_provee]
    );
    return { id_provee, ...provee };
};



// ELIMINA PROVEE
export const elimina = async(id_provee) => {
  // Verificar si existe
  const [rows] = await db.query('SELECT * FROM provee WHERE id_provee = ?',[id_provee]);
  if (rows.length === 0) {
    throw new Error(`En la tabal provee no existe el id = ${id_provee}`);
  }

  // luego eliminar provee
  await db.query('DELETE FROM provee WHERE id_provee = ?',[id_provee]);
  return id_provee;
};

