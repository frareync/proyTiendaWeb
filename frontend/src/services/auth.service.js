import axios from 'axios';

// La dirección base de nuestro backend
const API_URL = 'http://localhost:3001';

// Función para pedir la imagen del captcha al servidor
export const obtenerCaptchaServicio = async () => {
  try {
    const respuesta = await axios.get(`${API_URL}/captcha`);
    return respuesta.data; // Retorna { imagen: '<svg>...', idCaptcha: '...' }
  } catch (error) {
    console.error("Error al obtener captcha:", error);
    throw error;
  }
};

// Función para enviar usuario, contraseña y captcha para iniciar sesión
export const loginServicio = async (usuario, contrasenia, captchaTexto, idCaptcha) => {
  try {
    const respuesta = await axios.post(`${API_URL}/login`, {
      usuario,
      contrasenia,
      captchaTexto,
      idCaptcha
    });
    return respuesta.data; // Si todo sale bien, retorna { token, rol, mensaje }
  } catch (error) {
    // Si hay error (contraseña mal, captcha mal), lanzamos el error para mostrarlo en pantalla
    throw error.response ? error.response.data : { error: "Error de conexión" };
  }
};

// Función para registrar un nuevo usuario (Opcional, si quisieras crear usuarios desde la web)
export const registrarServicio = async (datosUsuario) => {
  try {
    const respuesta = await axios.post(`${API_URL}/registro`, datosUsuario);
    return respuesta.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: "Error de conexión" };
  }
};
