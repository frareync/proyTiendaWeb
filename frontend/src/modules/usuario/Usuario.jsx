// Importamos los hooks de React
import { useEffect, useState } from "react"
// Importamos nuestros servicios (backend)
import { ObtenerUsuarios, EnviarUsuario, ActualizarUsuario, EliminarUsuario } from '../../services/usuario.service';
import { ObtenerVendedores } from '../../services/vendedor.service'; // Para listar vendedores en el select

// Importamos íconos visuales y de Material UI
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

// Importamos componentes de interfaz Material UI
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Box, Stack, MenuItem, Typography, Alert, LinearProgress
} from '@mui/material';
// Importamos SweetAlert para mensajes bonitos
import Swal from 'sweetalert2'

const Usuario = () => {
  // --- ESTADOS ---
  const [usuarios, SetUsuarios] = useState([]);       // Lista de usuarios
  const [vendedores, SetVendedores] = useState([]);   // Lista de vendedores disponible para vincular
  const [Abrir, SetAbrir] = useState(false);          // Controla si el modal está abierto

  // Estado para el usuario actual (el que está logueado)
  const [usuarioActual, SetUsuarioActual] = useState({ rol: '' });

  // Datos del formulario
  const [formData, SetformData] = useState({
    usuario: '',
    contrasenia: '',
    rol: '',        // 'ADMIN' o 'VENDEDOR'
    id_vendedor: '' // ID del vendedor vinculado (si aplica)
  });

  // Manejo de errores visuales
  const [errors, setErrors] = useState({});

  // Control de Edición
  const [modoEdicion, SetModoEdicion] = useState(false);
  const [usuarioEditado, SetUsuarioEditado] = useState(null);

  // Estado para la fortaleza de la contraseña
  const [fortalezaPassword, SetFortalezaPassword] = useState(0); // 0-100

  // --- CARGA INICIAL DE DATOS ---
  useEffect(() => {
    // 1. Verificar quién es el usuario actual usando LocalStorage (donde guardamos el rol al hacer login)
    // Nota: Es importante que al hacer login guardemos el 'rol' para leerlo aquí.
    const rolGuardado = localStorage.getItem('userRole'); // Asumimos que guardamos esto en el Login
    if (rolGuardado) {
      SetUsuarioActual({ rol: rolGuardado });
    }

    // 2. Cargar datos
    cargarDatos();
  }, [])

  const cargarDatos = async () => {
    try {
      // Cargamos usuarios y vendedores en paralelo
      const [resUsuarios, resVendedores] = await Promise.all([
        ObtenerUsuarios(),
        ObtenerVendedores()
      ]);
      SetUsuarios(resUsuarios);
      SetVendedores(resVendedores);
    } catch (error) {
      console.log('Error al cargar datos:', error);
    }
  }

  // --- CALCULAR FORTALEZA DE CONTRASEÑA ---
  // Función auxiliar para determinar qué tan segura es la contraseña
  const calcularFortaleza = (password) => {
    let fuerza = 0;
    if (!password) return 0;

    // Criterio 1: Longitud
    if (password.length > 5) fuerza += 20;
    if (password.length > 8) fuerza += 20;

    // Criterio 2: Tiene números
    if (/\d/.test(password)) fuerza += 20;

    // Criterio 3: Tiene letras mayúsculas y minúsculas
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) fuerza += 20;

    // Criterio 4: Tiene caracteres especiales
    if (/[^A-Za-z0-9]/.test(password)) fuerza += 20;

    return fuerza; // Retorna valor de 0 a 100
  }

  // Función para obtener color según la fuerza
  const obtenerColorFortaleza = (fuerza) => {
    if (fuerza < 40) return "error";    // Rojo (Débil)
    if (fuerza < 80) return "warning";  // Amarillo (Intermedio)
    return "success";                   // Verde (Fuerte)
  }

  const obtenerTextoFortaleza = (fuerza) => {
    if (fuerza < 40) return "Débil";
    if (fuerza < 80) return "Intermedia";
    return "Fuerte";
  }


  // --- MANEJO DE INPUTS ---
  const CambioEntrada = (e) => {
    const { name, value } = e.target;
    SetformData({
      ...formData,
      [name]: value
    });

    // Si escriben en contraseña, calculamos su fuerza en tiempo real
    if (name === 'contrasenia') {
      SetFortalezaPassword(calcularFortaleza(value));
    }

    // Limpiar error al escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // --- VALIDACIÓN ---
  const validarFormulario = () => {
    let nuevosErrores = {};
    let esValido = true;

    // Validación Usuario
    if (!formData.usuario || formData.usuario.trim() === '') {
      nuevosErrores.usuario = 'El nombre de usuario es obligatorio';
      esValido = false;
    }

    // Validación Contraseña
    if (!modoEdicion) {
      // Al crear es obligatoria
      if (!formData.contrasenia || formData.contrasenia.trim() === '') {
        nuevosErrores.contrasenia = 'La contraseña es obligatoria';
        esValido = false;
      } else {
        // Validar que no sea muy débil (Opcional, pero recomendado)
        if (calcularFortaleza(formData.contrasenia) < 20) {
          nuevosErrores.contrasenia = 'La contraseña es demasiado débil';
          esValido = false;
        }
      }
    } else {
      // Al editar es opcional, pero si escribe algo, validamos fuerza mínima
      if (formData.contrasenia && formData.contrasenia.trim() !== '') {
        if (calcularFortaleza(formData.contrasenia) < 20) {
          nuevosErrores.contrasenia = 'La contraseña es demasiado débil';
          esValido = false;
        }
      }
    }

    // Validación Rol
    if (!formData.rol || formData.rol.trim() === '') {
      nuevosErrores.rol = 'Debe seleccionar un rol';
      esValido = false;
    }

    setErrors(nuevosErrores);
    return esValido;
  };

  // --- GUARDAR (CREAR O EDITAR) ---
  const GuardarUsuario = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      if (modoEdicion) {
        // ACTUALIZAR
        await ActualizarUsuario(usuarioEditado, {
          usuario: formData.usuario,
          contrasenia: formData.contrasenia, // Si va vacía, el backend la ignora
          rol: formData.rol,
          id_vendedor: formData.id_vendedor || null // Enviamos null si está vacío
        });

        Swal.fire({ title: "¡Actualizado!", icon: "success", timer: 3000, showCancelButton: false });
      } else {
        // CREAR
        await EnviarUsuario({
          usuario: formData.usuario,
          contrasenia: formData.contrasenia,
          rol: formData.rol,
          id_vendedor: formData.id_vendedor || null
        });

        Swal.fire({ title: "¡Registrado!", icon: "success", timer: 3000 });
      }

      // Recargar y cerrar
      cargarDatos();
      handleClose();

    } catch (error) {
      console.log(error);
      const sms = error.response?.data?.error || 'Error al guardar';
      Swal.fire({ icon: 'error', title: 'Error', text: sms });
    }
  };

  // --- FUNCIONES AUXILIARES ---
  const handleClose = () => {
    SetAbrir(false);
    SetModoEdicion(false);
    SetUsuarioEditado(null);
    SetFortalezaPassword(0); // Reset fuerza
    SetformData({ usuario: '', contrasenia: '', rol: '', id_vendedor: '' });
    setErrors({});
  };

  const AbrirModalEditar = (user) => {
    SetModoEdicion(true);
    SetUsuarioEditado(user.id_usuario);
    SetFortalezaPassword(0); // Reset al abrir
    SetformData({
      usuario: user.usuario,
      contrasenia: '', // No mostramos la contraseña encriptada
      rol: user.rol,
      id_vendedor: user.id_vendedor || ''
    });
    setErrors({});
    SetAbrir(true);
  };

  const EliminarUsuarioFn = async (id) => {
    Swal.fire({
      title: "¿Eliminar Usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await EliminarUsuario(id);
          cargarDatos();
          Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
        }
      }
    });
  };

  // --- RENDERIZADO CONDICIONAL POR ROL ---
  // NOTA: Para esta primera iteración se permite acceso total a todos los roles.
  // El control de acceso está deshabilitado.

  return (
    <Box sx={{ p: 4 }}>
      {/* Botón Crear */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => SetAbrir(true)}
          sx={{ bgcolor: '#2C7873', '&:hover': { bgcolor: '#205e5a' } }}
        >
          Nuevo Usuario
        </Button>
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.300' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Rol</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Vendedor Vinculado</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((user) => (
              <TableRow key={user.id_usuario}>
                <TableCell>{user.id_usuario}</TableCell>
                <TableCell>{user.usuario}</TableCell>
                <TableCell>
                  {/* Etiqueta colorida simple según el rol */}
                  <span style={{
                    fontWeight: 'bold',
                    color: user.rol === 'ADMIN' ? '#d32f2f' : '#1976d2'
                  }}>
                    {user.rol}
                  </span>
                </TableCell>
                <TableCell>
                  {/* Buscamos nombre del vendedor si tiene ID asociado */}
                  {user.id_vendedor
                    ? vendedores.find(v => v.id_vendedor === user.id_vendedor)?.nombre || `ID: ${user.id_vendedor}`
                    : '-'
                  }
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton onClick={() => AbrirModalEditar(user)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => EliminarUsuarioFn(user.id_usuario)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Formulario */}
      <Dialog open={Abrir} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#2C7873', color: 'white', textAlign: 'center' }}>
          {modoEdicion ? 'Editar Usuario' : 'Crear Usuario'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>

            <TextField
              label="Nombre de Usuario"
              name="usuario"
              value={formData.usuario}
              onChange={CambioEntrada}
              error={!!errors.usuario}
              helperText={errors.usuario}
              fullWidth
            />

            {/* Input Password con Medidor de Fortaleza */}
            <Box>
              <TextField
                label={modoEdicion ? "Nueva Contraseña (Opcional)" : "Contraseña"}
                name="contrasenia"
                type="password"
                value={formData.contrasenia}
                onChange={CambioEntrada}
                error={!!errors.contrasenia}
                helperText={errors.contrasenia}
                fullWidth
              />

              {/* Barra de progreso visual para la fortaleza */}
              {(formData.contrasenia && formData.contrasenia.length > 0) && (
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Seguridad:
                    </Typography>
                    <Typography
                      variant="caption"
                      color={obtenerColorFortaleza(fortalezaPassword)}
                      fontWeight="bold"
                    >
                      {obtenerTextoFortaleza(fortalezaPassword)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={fortalezaPassword}
                    color={obtenerColorFortaleza(fortalezaPassword)}
                    sx={{ height: 6, borderRadius: 5 }}
                  />
                </Box>
              )}
            </Box>

            <TextField
              select
              label="Rol"
              name="rol"
              value={formData.rol}
              onChange={CambioEntrada}
              error={!!errors.rol}
              helperText={errors.rol}
              fullWidth
            >
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="VENDEDOR">VENDEDOR</MenuItem>
            </TextField>

            <TextField
              select
              label="Vincular a Vendedor (Opcional)"
              name="id_vendedor"
              value={formData.id_vendedor}
              onChange={CambioEntrada}
              fullWidth
              helperText="Seleccione si este usuario pertenece a un vendedor"
            >
              <MenuItem value="">
                <em>Seleccionar Vendedor</em>
              </MenuItem>
              {vendedores.map((v) => (
                <MenuItem key={v.id_vendedor} value={v.id_vendedor}>
                  {v.nombre} {v.paterno} (CI: {v.ci})
                </MenuItem>
              ))}
            </TextField>

          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="error" variant="outlined">Cancelar</Button>
          <Button onClick={GuardarUsuario} variant="contained" sx={{ bgcolor: '#2C7873' }}>
            {modoEdicion ? 'Guardar Cambios' : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Usuario
