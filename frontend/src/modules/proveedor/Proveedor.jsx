// Importamos Hooks de React
import { useEffect, useState } from "react"
// Importamos funciones del servicio
import { ObtenerProveedores, EnviarProveedor, EliminarProveedor, ActualizarProveedor } from '../../services/proveedor.service';
// Importamos íconos Material UI
import { Edit as EditIcon, Delete as DeleteIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
// Importamos componentes visuales de Material UI
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Box, Stack
} from '@mui/material';
// Importamos SweetAlert2
import Swal from 'sweetalert2'

/*
// REFERENCIA SQL
CREATE TABLE PROVEEDOR (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    paterno VARCHAR(50),
    materno VARCHAR(50),
    telefono VARCHAR(20),
    direccion VARCHAR(100),
    correo VARCHAR(100)
);
*/

const Proveedor = () => {
  // Estado para la lista de proveedores
  const [proveedores, SetProveedores] = useState([]);

  // Estado para controlar la apertura del modal
  const [Abrir, SetAbrir] = useState(false);

  // Estado para los datos del formulario
  const [formData, SetformData] = useState({
    nombre: '',
    paterno: '',
    materno: '',
    telefono: '',
    direccion: '',
    correo: ''
  })

  // Estado 'errors' para manejar validaciones visuales en Inputs
  const [errors, setErrors] = useState({});

  // Estados para modo edición
  const [modoEdicion, SetModoEdicion] = useState(false)
  const [proveedorEditado, SetProveedorEditado] = useState(null);

  // Función al escribir en inputs
  const CambioEntrada = (e) => {
    const { name, value } = e.target;
    // Actualizamos formData con lo que se escribe
    SetformData({
      ...formData,
      [name]: value
    })

    // Si el usuario escribe, limpiamos el error visual de ese campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  // Carga inicial de datos
  useEffect(() => {
    const cargarProveedores = async () => {
      try {
        const resultado = await ObtenerProveedores();
        SetProveedores(resultado);
      } catch (error) {
        console.log('Error al cargar proveedores:', error);
      }
    }
    cargarProveedores();
  }, [])

  // Función de Validación
  const validarFormulario = () => {
    let nuevosErrores = {};
    let esValido = true;

    // Regex solo letras para nombre/apellidos
    const regexSoloLetras = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ][a-zA-ZÁÉÍÓÚáéíóúÑñ\s]*$/;
    // Regex básico para correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validar Nombre: Requerido, >3 letras, Solo texto
    if (!formData.nombre || formData.nombre.trim() === '') {
      nuevosErrores.nombre = 'Nombre obligatorio';
      esValido = false;
    } else if (formData.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'Mínimo 3 caracteres';
      esValido = false;
    } else if (!regexSoloLetras.test(formData.nombre)) {
      nuevosErrores.nombre = 'Solo letras';
      esValido = false;
    }

    // Validar Paterno: Requerido, >3 letras, Solo texto
    if (!formData.paterno || formData.paterno.trim() === '') {
      nuevosErrores.paterno = 'Apellido Paterno obligatorio';
      esValido = false;
    } else if (formData.paterno.trim().length < 3) {
      nuevosErrores.paterno = 'Mínimo 3 caracteres';
      esValido = false;
    } else if (!regexSoloLetras.test(formData.paterno)) {
      nuevosErrores.paterno = 'Solo letras';
      esValido = false;
    }

    // Validar Teléfono: Requerido
    if (!formData.telefono || formData.telefono.trim() === '') {
      nuevosErrores.telefono = 'Teléfono obligatorio';
      esValido = false;
    }

    // Validar Dirección: Requerido
    if (!formData.direccion || formData.direccion.trim() === '') {
      nuevosErrores.direccion = 'Dirección obligatoria';
      esValido = false;
    }

    // Validar Correo: Requerido y formato válido
    if (!formData.correo || formData.correo.trim() === '') {
      nuevosErrores.correo = 'Correo obligatorio';
      esValido = false;
    } else if (!regexCorreo.test(formData.correo)) {
      nuevosErrores.correo = 'Formato de correo inválido';
      esValido = false;
    }

    setErrors(nuevosErrores);
    return esValido;
  }

  // Función Guardar (Crear/Editar)
  const CrearProveedor = async (e) => {
    e.preventDefault();

    // Validamos antes de enviar
    if (!validarFormulario()) {
      return;
    }

    try {
      if (modoEdicion) {
        // --- EDITAR ---
        await ActualizarProveedor(proveedorEditado, {
          nombre: formData.nombre,
          paterno: formData.paterno,
          materno: formData.materno,
          telefono: formData.telefono,
          direccion: formData.direccion,
          correo: formData.correo
        })
        const resultado = await ObtenerProveedores();
        SetProveedores(resultado);
        handleClose();
        Swal.fire({
          title: "¡Actualizado Correctamente!",
          icon: "success",
          timer: 4000,
          showCancelButton: false
        });
      } else {
        // --- CREAR ---
        await EnviarProveedor({
          nombre: formData.nombre,
          paterno: formData.paterno,
          materno: formData.materno,
          telefono: formData.telefono,
          direccion: formData.direccion,
          correo: formData.correo
        })
        const resultado = await ObtenerProveedores();
        SetProveedores(resultado);
        handleClose();
        Swal.fire({
          title: "¡Se creó exitosamente!",
          icon: "success",
          timer: 4000
        });
      }
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al guardar el proveedor'
      });
    }
  }

  // Cerrar Modal y Limpiar
  const handleClose = () => {
    SetAbrir(false);
    SetModoEdicion(false);
    SetProveedorEditado(null);
    SetformData({
      nombre: '',
      paterno: '',
      materno: '',
      telefono: '',
      direccion: '',
      correo: ''
    });
    setErrors({});
  };

  // Abrir Modal para Editar
  const AbrirModalEditar = (proveedor) => {
    SetModoEdicion(true)
    SetProveedorEditado(proveedor.id_proveedor)
    SetformData({
      nombre: proveedor.nombre || '',
      paterno: proveedor.paterno || '',
      materno: proveedor.materno || '',
      telefono: proveedor.telefono || '',
      direccion: proveedor.direccion || '',
      correo: proveedor.correo || ''
    })
    setErrors({});
    SetAbrir(true);
  }

  // Eliminar
  const EliminarProveedorFn = async (id) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar este proveedor?",
      text: "No podrás revertir los cambios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await EliminarProveedor(id);
          const resultado = await ObtenerProveedores();
          SetProveedores(resultado);
          Swal.fire({
            title: "¡Se eliminó exitosamente!",
            icon: "success",
            timer: 4000,
            showCancelButton: false
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: "Error al eliminar",
            text: error.response?.data?.error || "No se puede eliminar el proveedor",
            icon: "error",
            timer: 4000,
            showCancelButton: false
          });
        }
      }
    });
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => SetAbrir(true)}
          sx={{ bgcolor: '#2C7873', '&:hover': { bgcolor: '#205e5a' } }}
        >
          Crear Proveedor
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de proveedores">
          <TableHead sx={{ bgcolor: 'grey.300' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Paterno</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Materno</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Dirección</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Correo</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedores.map((proveedor) => (
              <TableRow
                key={proveedor.id_proveedor}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {proveedor.id_proveedor}
                </TableCell>
                <TableCell>{proveedor.nombre}</TableCell>
                <TableCell>{proveedor.paterno}</TableCell>
                <TableCell>{proveedor.materno}</TableCell>
                <TableCell>{proveedor.telefono}</TableCell>
                <TableCell>{proveedor.direccion}</TableCell>
                <TableCell>{proveedor.correo}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton
                      onClick={() => AbrirModalEditar(proveedor)}
                      color="primary"
                      aria-label="editar"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => EliminarProveedorFn(proveedor.id_proveedor)}
                      color="error"
                      aria-label="eliminar"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Abrir} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#2C7873', color: 'white', textAlign: 'center' }}>
          {modoEdicion ? 'Editar Proveedor' : 'Crear nuevo Proveedor'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {/* Input Nombre con validación visual */}
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.nombre}
              helperText={errors.nombre}
            />
            {/* Input Paterno con validación visual */}
            <TextField
              label="Paterno"
              name="paterno"
              value={formData.paterno}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.paterno}
              helperText={errors.paterno}
            />
            {/* Input Materno */}
            <TextField
              label="Materno"
              name="materno"
              value={formData.materno}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
            />
            {/* Input Teléfono */}
            <TextField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.telefono}
              helperText={errors.telefono}
            />
            {/* Input Dirección */}
            <TextField
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.direccion}
              helperText={errors.direccion}
            />
            {/* Input Correo con validación visual */}
            <TextField
              label="Correo"
              name="correo"
              value={formData.correo}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.correo}
              helperText={errors.correo}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cerrar
          </Button>
          <Button
            onClick={CrearProveedor}
            variant="contained"
            sx={{ bgcolor: '#2C7873', '&:hover': { bgcolor: '#205e5a' } }}
          >
            {modoEdicion ? 'Editar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Proveedor
