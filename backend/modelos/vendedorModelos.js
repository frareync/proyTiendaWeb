import {db} from '../config/db.js';

// MUESTRA LOS VENDEDORES
export const obtVendedor=async () => {
    const [resultado]=await db.query('SELECT * FROM VENDEDOR');
    return resultado;
}

// INSERTAR VENDEDOR
export const inserta=async (vendedor) => {
    const {nombre, paterno, materno, telefono, direccion}=vendedor;
    const [resultado]=await db.query('INSERT INTO VENDEDOR(nombre, paterno, materno, telefono, direccion) values (?,?,?,?,?)',[nombre, paterno, materno, telefono, direccion]);
    return resultado;
}

// BUSCA VENDEDOR POR ID
export const obtienePorId = async(id_vendedor) => {
  const [resultado] = await db.query('SELECT * FROM vendedor WHERE id_vendedor = ?', [id_vendedor]);
  return resultado[0];
};

// ACTUALIZA VENDEDOR (ALGUN ATRIBUTO)
export const actualiza = async (id_vendedor, vendedor) => {
  const {nombre, paterno, materno, telefono, direccion} = vendedor;
  await db.query('UPDATE vendedor SET nombre = ?, paterno = ?, materno = ?, telefono = ?, direccion = ? WHERE id_vendedor = ?', [nombre, paterno, materno, telefono, direccion, id_vendedor]);
  return {id_vendedor, ...vendedor};
};


// ELIMINA VENDEDOR
export const elimina = async(id_vendedor) => {
    // Verificar si existe
    const [rows] = await db.query('SELECT * FROM vendedor WHERE id_vendedor = ?',[id_vendedor]);
    if (rows.length === 0) {
        throw new Error(`El vendedor no existe con el id = ${id_vendedor}`);
    }
    
    // primero eliminar compras asociadas
    await db.query('DELETE FROM compra WHERE id_vendedor = ?', [id_vendedor]);
    // luego eliminar vendedor
    await db.query('DELETE FROM vendedor WHERE id_vendedor = ?',[id_vendedor]);
    return id_vendedor;
};





