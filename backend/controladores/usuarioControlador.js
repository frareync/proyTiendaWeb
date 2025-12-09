import { buscarPorNombre, insertarUsuario } from "../modelos/usuarioModelos.js";
import bcrypt from 'bcryptjs'; // "La Trituradora" de contraseñas
import jwt from 'jsonwebtoken'; // El "Carnet Digital"
import svgCaptcha from 'svg-captcha'; // Generador de dibujos de texto

const CLAVE_SECRETA = 'mi_secreto_super_seguro_123'; // En producción esto va en variables de entorno

// ALMACEN TEMPORAL DE CAPTCHAS (En memoria RAM)
// Guardamos: { "id_unico_o_ip": "texto_correcto" }
// Nota: Si reinicias el servidor, se borran.
let captchasAlmacenados = {};

// --- 1. REGISTRAR USUARIO ---
export const registrar = async (req, res) => {
  try {
    const { usuario, contrasenia, rol, id_vendedor } = req.body;

    // Validaciones básicas
    if (!usuario || !contrasenia || !rol) {
      return res.status(400).json({ error: "Faltan datos obligatorios (usuario, contraseña, rol)" });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await buscarPorNombre(usuario);
    if (usuarioExistente) {
      return res.status(400).json({ error: "El nombre de usuario ya está ocupado" });
    }

    // PASO CLAVE: Encriptar la contraseña antes de guardar
    // 10 es el "salt rounds" (qué tanto barajamos la contraseña, 10 es un buen balance velocidad/seguridad)
    const contraseniaEncriptada = await bcrypt.hash(contrasenia, 10);

    // Guardar en Base de Datos
    await insertarUsuario({
      usuario,
      contrasenia: contraseniaEncriptada, // Guardamos la encriptada, NUNCA la original
      rol,
      id_vendedor
    });

    res.status(201).json({ mensaje: "Usuario registrado con éxito" });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno del servidor al registrar" });
  }
};

// --- 2. GENERAR CAPTCHA ---
export const obtenerCaptcha = (req, res) => {
  // Creamos un captcha nuevo
  const captcha = svgCaptcha.create({
    size: 5, // Cantidad de letras
    noise: 2, // Cantidad de líneas de ruido
    color: true, // Letras de colores
    background: '#f0f0f0' // Fondo gris claro
  });

  // Guardamos la respuesta correcta en la memoria del servidor
  // Usamos el texto como clave por simplicidad didáctica,
  // pero idealmente usaríamos un ID único que enviamos al cliente.
  // Para simplificar: Le enviamos al cliente un "id" aleatorio y guardamos ese id.
  const idCaptcha = Date.now().toString(); // Usamos la hora como ID simple
  captchasAlmacenados[idCaptcha] = captcha.text.toLowerCase(); // Guardamos en minúsculas para comparar fácil

  // Limpiamos memoria después de 5 minutos para que no se llene infinitamente
  setTimeout(() => {
    delete captchasAlmacenados[idCaptcha];
  }, 5 * 60 * 1000);

  // Respondemos con la imagen (data) y el id (para que nos lo devuelvan al validar)
  res.status(200).json({
    imagen: captcha.data,
    idCaptcha: idCaptcha
  });
};

// --- 3. INICIAR SESIÓN (LOGIN) ---
export const login = async (req, res) => {
  try {
    const { usuario, contrasenia, captchaTexto, idCaptcha } = req.body;

    // A. VALIDAR CAPTCHA
    if (!captchasAlmacenados[idCaptcha]) {
      return res.status(400).json({ error: "El captcha ha expirado o no es válido" });
    }
    if (captchasAlmacenados[idCaptcha] !== captchaTexto.toLowerCase()) {
      return res.status(400).json({ error: "El texto del captcha es incorrecto" });
    }
    // Si pasó, borramos el captcha usado para seguridad
    delete captchasAlmacenados[idCaptcha];

    // B. BUSCAR USUARIO
    const usuarioEncontrado = await buscarPorNombre(usuario);
    if (!usuarioEncontrado) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    // C. COMPARAR CONTRASEÑA ENCRIPTADA
    // bcrypt.compare(texto_plano, texto_encriptado)
    const passwordCorrecta = await bcrypt.compare(contrasenia, usuarioEncontrado.contrasenia);

    if (!passwordCorrecta) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    // D. GENERAR TOKEN (JWT)
    // Guardamos datos útiles en el token (payload)
    const datosToken = {
      id: usuarioEncontrado.id_usuario,
      usuario: usuarioEncontrado.usuario,
      rol: usuarioEncontrado.rol
    };

    // Firmamos el token. Expira en 2 horas.
    const token = jwt.sign(datosToken, CLAVE_SECRETA, { expiresIn: '2h' });

    // E. RESPONDER
    res.json({
      mensaje: "Login exitoso",
      token: token,
      rol: usuarioEncontrado.rol
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
