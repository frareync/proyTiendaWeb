import express from 'express';
import { registrar, login, obtenerCaptcha, obtenerUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario } from '../controladores/usuarioControlador.js';

const router = express.Router();

// Definimos las direcciones URL
router.post('/registro', registrar); // Crear nuevo usuario
router.post('/login', login);        // Iniciar sesión
router.get('/captcha', obtenerCaptcha); // Pedir nueva imagen de captcha

// --- RUTAS CRUD DE USUARIOS ---
router.get('/usuario', obtenerUsuarios);       // Obtener todos
router.post('/usuario', registrar);            // Crear usuario (alias de registro)
router.get('/usuario/:id', obtenerUsuario);    // Obtener uno
router.put('/usuario/:id', actualizarUsuario); // Actualizar
router.delete('/usuario/:id', eliminarUsuario);// Eliminar

export default router;
