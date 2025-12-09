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
