import axios from 'axios';

// Definimos la URL base para no repetirla
// Nota: En producción esto debería venir de una variable de entorno
const API_URL = 'http://localhost:3001/usuario';

// 1. OBTENER TODOS LOS USUARIOS
export const ObtenerUsuarios = async () => {
  // Hacemos una petición GET a http://localhost:3001/usuario
  const response = await axios.get(API_URL);
  return response.data; // Devolvemos solo los datos (la lista de usuarios)
};

// 2. CREAR UN USUARIO NUEVO
export const EnviarUsuario = async (usuario) => {
  // Hacemos una petición POST enviando los datos del usuario
  const response = await axios.post(API_URL, usuario);
  return response.data;
};

// 3. ACTUALIZAR UN USUARIO EXISTENTE
export const ActualizarUsuario = async (id, usuario) => {
  // Hacemos una petición PUT a http://localhost:3001/usuario/:id
  const response = await axios.put(`${API_URL}/${id}`, usuario);
  return response.data;
};

// 4. ELIMINAR UN USUARIO
export const EliminarUsuario = async (id) => {
  // Hacemos una petición DELETE a http://localhost:3001/usuario/:id
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
