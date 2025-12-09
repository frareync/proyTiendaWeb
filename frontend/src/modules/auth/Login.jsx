import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerCaptchaServicio, loginServicio } from '../../services/auth.service';
import Swal from 'sweetalert2'; // Para mensajes bonitos

// Componente visual de Login
const Login = () => {
  const navigate = useNavigate(); // Para redirigir al usuario si el login es exitoso

  // ESTADOS (Memoria del componente)
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [captchaTexto, setCaptchaTexto] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState(''); // El dibujo del captcha
  const [idCaptcha, setIdCaptcha] = useState('');   // El ID para validar en el servidor

  // Estado para la calidad de la contraseña
  const [fuerzaPass, setFuerzaPass] = useState('vacía'); // 'débil', 'media', 'fuerte'

  // 1. CARGAR CAPTCHA AL INICIAR
  // useEffect con [] vacío significa "ejecutar solo una vez al cargar la página"
  useEffect(() => {
    cargarNuevoCaptcha();
  }, []);

  const cargarNuevoCaptcha = async () => {
    try {
      const datos = await obtenerCaptchaServicio();
      setCaptchaSvg(datos.imagen);
      setIdCaptcha(datos.idCaptcha);
      setCaptchaTexto(''); // Limpiar el input de texto del captcha
    } catch (error) {
      console.error("No se pudo cargar el captcha");
    }
  };

  // 2. VALIDAR FUERZA DE CONTRASEÑA
  // Esta función se ejecuta cada vez que el usuario escribe en el campo contraseña
  const manejarCambioPassword = (e) => {
    const pass = e.target.value;
    setContrasenia(pass);

    // Lógica simple de fuerza
    let fuerza = 'vacía';
    const tieneLetras = /[a-zA-Z]/.test(pass);
    const tieneNumeros = /[0-9]/.test(pass);
    const tieneSimbolos = /[^a-zA-Z0-9]/.test(pass);
    const longitud = pass.length;

    if (longitud === 0) {
      fuerza = 'vacía';
    } else if (longitud < 6) {
      fuerza = 'débil'; // Muy cortita
    } else if (tieneLetras && tieneNumeros && tieneSimbolos && longitud >= 8) {
      fuerza = 'fuerte';
    } else if ((tieneLetras && tieneNumeros) || (tieneLetras && tieneSimbolos)) {
      fuerza = 'media';
    } else {
      fuerza = 'débil';
    }

    setFuerzaPass(fuerza);
  };

  // 3. ENVIAR FORMULARIO (LOGIN)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue sola

    try {
      // Llamamos al servicio (que habla con el backend)
      const respuesta = await loginServicio(usuario, contrasenia, captchaTexto, idCaptcha);

      // Si llegamos aquí, ¡Login Exitoso!
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: respuesta.mensaje,
        timer: 1500
      });

      // Guardamos el token en la 'billetera' del navegador (localStorage)
      localStorage.setItem('token', respuesta.token);
      localStorage.setItem('rol', respuesta.rol);

      // Redirigimos según el rol (como ejemplo básico)
      navigate('/dashboard');

    } catch (error) {
      // Si falla (contraseña mal, captcha mal...)
      Swal.fire({
        icon: 'error',
        title: 'Error de acceso',
        text: error.error || 'Ocurrió un error inesperado'
      });
      // Recargamos el captcha para que intente de nuevo
      cargarNuevoCaptcha();
    }
  };

  // Estilos para el medidor de fuerza
  const obtenerColorFuerza = () => {
    if (fuerzaPass === 'débil') return 'red';
    if (fuerzaPass === 'media') return 'orange';
    if (fuerzaPass === 'fuerte') return 'green';
    return 'gray';
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>Iniciar Sesión</h2>

      <form onSubmit={handleSubmit}>
        {/* USUARIO */}
        <div style={{ marginBottom: '15px' }}>
          <label>Usuario:</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>

        {/* CONTRASEÑA */}
        <div style={{ marginBottom: '15px' }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={contrasenia}
            onChange={manejarCambioPassword}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
          {/* MEDIDOR DE FUERZA */}
          <div style={{ marginTop: '5px', fontSize: '12px' }}>
            Fuerza: <span style={{ color: obtenerColorFuerza(), fontWeight: 'bold' }}>{fuerzaPass.toUpperCase()}</span>
          </div>
        </div>

        {/* CAPTCHA */}
        <div style={{ marginBottom: '15px', textAlign: 'center' }}>
          <div
            dangerouslySetInnerHTML={{ __html: captchaSvg }}
            style={{ background: '#f0f0f0', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}
          />
          <button type="button" onClick={cargarNuevoCaptcha} style={{ fontSize: '12px', marginBottom: '5px', cursor: 'pointer' }}>
            Recargar Captcha
          </button>
          <input
            type="text"
            placeholder="Escribe las letras de arriba"
            value={captchaTexto}
            onChange={(e) => setCaptchaTexto(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <button
          type="submit"
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;
