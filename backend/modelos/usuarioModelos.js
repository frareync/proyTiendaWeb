import { db } from '../config/db.js';

// BUSCAR USUARIO POR NOMBRE
// Usado para verificar si existe al registrarse y para buscar la contraseña al hacer login
export const buscarPorNombre = async (nombreUsuario) => {
  const [resultado] = await db.query('SELECT * FROM USUARIO WHERE usuario = ?', [nombreUsuario]);
  return resultado[0]; // Retorna el primer usuario encontrado o undefined
};

// INSERTAR NUEVO USUARIO
export const insertarUsuario = async (datosUsuario) => {
  const { usuario, contrasenia, rol, id_vendedor } = datosUsuario;
  // Si id_vendedor es null o undefined, se guarda como NULL en la BD
  const [resultado] = await db.query(
    'INSERT INTO USUARIO (usuario, contrasenia, rol, id_vendedor) VALUES (?, ?, ?, ?)',
    [usuario, contrasenia, rol, id_vendedor || null]
  );
  return resultado;
};

// ELIMINAR USUARIO POR ID DE VENDEDOR (Para corregir conflictos en el seed)
export const eliminarPorIdVendedor = async (id_vendedor) => {
  if (!id_vendedor) return;
  await db.query('DELETE FROM USUARIO WHERE id_vendedor = ?', [id_vendedor]);
};

// --- OPERACIONES CRUD COMPLETAS ---

// 1. OBTENER TODOS LOS USUARIOS
export const obtUsuario = async () => {
  // Seleccionamos todo
  const [resultado] = await db.query('SELECT * FROM USUARIO');
  return resultado;
}

// 2. BUSCAR USUARIO POR ID (IDENTIFICADOR UNICO)
export const obtienePorId = async (id_usuario) => {
  const [resultado] = await db.query('SELECT * FROM USUARIO WHERE id_usuario = ?', [id_usuario]);
  // Retornamos solo el primer elemento (el usuario encontrado)
  return resultado[0];
};

// 3. ACTUALIZAR USUARIO
export const actualiza = async (id_usuario, datosUsuario) => {
  const { usuario, contrasenia, rol, id_vendedor } = datosUsuario;

  // LOGICA PARA LA CONTRASEÑA:
  // Si viene una contraseña nueva (no está vacía), actualizamos TODO
  if (contrasenia && contrasenia.trim() !== '') {
    await db.query(
      'UPDATE USUARIO SET usuario = ?, contrasenia = ?, rol = ?, id_vendedor = ? WHERE id_usuario = ?',
      [usuario, contrasenia, rol, id_vendedor || null, id_usuario]
    );
  } else {
    // Si NO viene contraseña, actualizamos todo MENOS la contraseña para no borrarla/dañarla
    await db.query(
      'UPDATE USUARIO SET usuario = ?, rol = ?, id_vendedor = ? WHERE id_usuario = ?',
      [usuario, rol, id_vendedor || null, id_usuario]
    );
  }

  return { id_usuario, ...datosUsuario };
};

// 4. ELIMINAR USUARIO
export const elimina = async (id_usuario) => {
  // Verificar primero si existe para ser amigables
  const [rows] = await db.query('SELECT * FROM USUARIO WHERE id_usuario = ?', [id_usuario]);
  if (rows.length === 0) {
    throw new Error(`El Usuario no existe con el id = ${id_usuario}`);
  }

  // Si existe, lo borramos
  await db.query('DELETE FROM USUARIO WHERE id_usuario = ?', [id_usuario]);
  return id_usuario;
};
