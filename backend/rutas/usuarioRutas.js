import express from 'express';
import { registrar, login, obtenerCaptcha } from '../controladores/usuarioControlador.js';

const router = express.Router();

// Definimos las direcciones URL
router.post('/registro', registrar); // Crear nuevo usuario
router.post('/login', login);        // Iniciar sesión
router.get('/captcha', obtenerCaptcha); // Pedir nueva imagen de captcha

export default router;
