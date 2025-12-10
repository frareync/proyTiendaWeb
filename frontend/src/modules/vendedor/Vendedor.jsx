// Importamos los hooks necesarios de React: 'useEffect' para cargar datos y 'useState' para manejar el estado
import { useEffect, useState } from "react"
// Importamos las funciones del servicio 'vendedor.service' para interactuar con la API (backend)
import { ObtenerVendedores, EnviarVendedor, EliminarVendedor, ActualizarVendedor } from '../../services/vendedor.service';
// Importamos los iconos de Material UI usados en la interfaz
import { Edit as EditIcon, Delete as DeleteIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
// Importamos los componentes de Material UI para la construcción visual de la app
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Box, Stack
} from '@mui/material';
// Importamos SweetAlert2 para mostrar alertas y confirmaciones
import Swal from 'sweetalert2'

/*
// COMENTARIO DE REFERENCIA SOBRE LA TABLA EN BASE DE DATOS
CREATE TABLE VENDEDOR (
    id_vendedor INT AUTO_INCREMENT PRIMARY KEY, // ID único
    ci VARCHAR(12), // Cédula de Identidad
    nombre VARCHAR(50) NOT NULL, // Nombre obligatorio
    paterno VARCHAR(50), // Paterno (Validaremos que no esté vacío)
    materno VARCHAR(50), // Materno
    telefono VARCHAR(20), // Teléfono
    direccion VARCHAR(100) // Dirección
);
*/

// Definición del componente 'Vendedor'
const Vendedor = () => {
  // Estado 'vendedores': Almacena la lista de vendedores traídos del backend
  const [vendedores, SetVendedores] = useState([]);
  // Estado 'Abrir': Controla la visibilidad del diálogo de registro/edición
  const [Abrir, SetAbrir] = useState(false);

  // Estado 'formData': Almacena los valores de los inputs del formulario
  const [formData, SetformData] = useState({
    ci: '',
    nombre: '',
    paterno: '',
    materno: '',
    telefono: '',
    direccion: ''
  })

  // Estado 'errors': Almacena los mensajes de error para la validación visual en los inputs
  const [errors, setErrors] = useState({});

  // Estado 'modoEdicion': Indica si se está actualizando (true) o creando (false)
  const [modoEdicion, SetModoEdicion] = useState(false)
  // Estado 'vendedorEditado': Guarda el ID del vendedor que se está editando
  const [vendedorEditado, SetVendedorEditado] = useState(null);

  // Función 'CambioEntrada': Actualiza el estado cuando el usuario escribe en un input
  const CambioEntrada = (e) => {
    const { name, value } = e.target;
    // Actualizamos formData con el nuevo valor
    SetformData({
      ...formData,
      [name]: value
    })

    // Si había un error en este campo, lo limpiamos al escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  // Hook 'useEffect': Se ejecuta al cargar el componente
  useEffect(() => {
    const cargarVendedores = async () => {
      try {
        const resultado = await ObtenerVendedores();
        SetVendedores(resultado);
      } catch (error) {
        console.log('Error al cargar vendedores:', error);
      }
    }
    cargarVendedores();
  }, [])

  // Función para validar el formulario antes de enviarlo
  const validarFormulario = () => {
    let nuevosErrores = {}; // Objeto para recolectar errores
    let esValido = true;    // Bandera de validez

    // Validación CI: Obligatorio
    if (!formData.ci || formData.ci.trim() === '') {
      nuevosErrores.ci = 'El CI es obligatorio';
      esValido = false;
    }

    // Regex para validar que solo haya letras y espacios (para Nombre y Paterno)
    const regexSoloLetras = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ][a-zA-ZÁÉÍÓÚáéíóúÑñ\s]*$/;

    // Validación Nombre: Obligatorio, longitud mínima 3, formato de solo letras
    if (!formData.nombre || formData.nombre.trim() === '') {
      nuevosErrores.nombre = 'El nombre es obligatorio';
      esValido = false;
    } else if (formData.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'Mínimo 3 caracteres';
      esValido = false;
    } else if (!regexSoloLetras.test(formData.nombre)) {
      nuevosErrores.nombre = 'Solo se permiten letras';
      esValido = false;
    }

    // Validación Paterno: Obligatorio, longitud mínima 3, solo letras
    if (!formData.paterno || formData.paterno.trim() === '') {
      nuevosErrores.paterno = 'El apellido paterno es obligatorio';
      esValido = false;
    } else if (formData.paterno.trim().length < 3) {
      nuevosErrores.paterno = 'Mínimo 3 caracteres';
      esValido = false;
    } else if (!regexSoloLetras.test(formData.paterno)) {
      nuevosErrores.paterno = 'Solo se permiten letras';
      esValido = false;
    }

    // Validación Telefono: Obligatorio (por lógica de negocio)
    if (!formData.telefono || formData.telefono.trim() === '') {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
      esValido = false;
    }

    // Validación Dirección: Obligatoria
    if (!formData.direccion || formData.direccion.trim() === '') {
      nuevosErrores.direccion = 'La dirección es obligatoria';
      esValido = false;
    }

    // Actualizamos el estado de errores
    setErrors(nuevosErrores);
    return esValido;
  }

  // Función asíncrona para Guardar (Crear o Editar)
  const CrearVendedor = async (e) => {
    e.preventDefault();

    // Ejecutamos validaciones, si falla retornamos y no enviamos nada
    if (!validarFormulario()) {
      return;
    }

    try {
      if (modoEdicion) {
        // --- LOGICA EDITAR ---
        await ActualizarVendedor(vendedorEditado, {
          ci: formData.ci,
          nombre: formData.nombre,
          paterno: formData.paterno,
          materno: formData.materno,
          telefono: formData.telefono, // Enviamos los datos validados
          direccion: formData.direccion
        })
        const resultado = await ObtenerVendedores();
        SetVendedores(resultado);
        handleClose();
        Swal.fire({
          title: "¡Actualizado Correctamente!",
          icon: "success",
          timer: 4000,
          showCancelButton: false
        });
      } else {
        // --- LOGICA CREAR ---
        await EnviarVendedor({
          ci: formData.ci,
          nombre: formData.nombre,
          paterno: formData.paterno,
          materno: formData.materno,
          telefono: formData.telefono,
          direccion: formData.direccion
        })
        const resultado = await ObtenerVendedores();
        SetVendedores(resultado);
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
        text: 'Hubo un problema al guardar el vendedor'
      });
    }
  }

  // Función para cerrar el modal y limpiar datos
  const handleClose = () => {
    SetAbrir(false);
    SetModoEdicion(false);
    SetVendedorEditado(null);
    SetformData({
      ci: '',
      nombre: '',
      paterno: '',
      materno: '',
      telefono: '',
      direccion: ''
    });
    setErrors({}); // Limpiamos errores
  };

  // Función para abrir el modal en modo edición
  const AbrirModalEditar = (vendedor) => {
    SetModoEdicion(true)
    SetVendedorEditado(vendedor.id_vendedor)
    SetformData({
      ci: vendedor.ci || '',
      nombre: vendedor.nombre || '',
      paterno: vendedor.paterno || '',
      materno: vendedor.materno || '',
      telefono: vendedor.telefono || '',
      direccion: vendedor.direccion || ''
    })
    setErrors({}); // Limpia errores previos
    SetAbrir(true);
  }

  // Función para eliminar un vendedor
  const EliminarVendedorFn = async (id) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar este vendedor?",
      text: "No podrás revertir los cambios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await EliminarVendedor(id);
          const resultado = await ObtenerVendedores();
          SetVendedores(resultado);
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
            text: error.response?.data?.error || "No se puede eliminar el vendedor",
            icon: "error",
            timer: 4000,
            showCancelButton: false
          });
        }
      }
    });
  }

  // Interfaz Gráfica
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => SetAbrir(true)}
          sx={{ bgcolor: '#2C7873', '&:hover': { bgcolor: '#205e5a' } }}
        >
          Crear Vendedor
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de vendedores">
          <TableHead sx={{ bgcolor: 'grey.300' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>CI</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Paterno</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Materno</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Dirección</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendedores.map((vendedor) => (
              <TableRow
                key={vendedor.id_vendedor}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {vendedor.id_vendedor}
                </TableCell>
                <TableCell>{vendedor.ci}</TableCell>
                <TableCell>{vendedor.nombre}</TableCell>
                <TableCell>{vendedor.paterno}</TableCell>
                <TableCell>{vendedor.materno}</TableCell>
                <TableCell>{vendedor.telefono}</TableCell>
                <TableCell>{vendedor.direccion}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton
                      onClick={() => AbrirModalEditar(vendedor)}
                      color="primary"
                      aria-label="editar"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => EliminarVendedorFn(vendedor.id_vendedor)}
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
          {modoEdicion ? 'Editar Vendedor' : 'Crear nuevo Vendedor'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {/* Input CI con validación visual MUI */}
            <TextField
              label="CI"
              name="ci"
              value={formData.ci}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.ci} // Muestra borde rojo
              helperText={errors.ci} // Mensaje de error
            />
            {/* Input Nombre con validación visual MUI */}
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.nombre} // Muestra borde rojo
              helperText={errors.nombre} // Mensaje de error
            />
            {/* Input Paterno con validación visual MUI */}
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
            {/* Input Materno (Opcional) */}
            <TextField
              label="Materno"
              name="materno"
              value={formData.materno}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
            />
            {/* Input Teléfono con validación visual MUI */}
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
            {/* Input Dirección con validación visual MUI */}
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
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cerrar
          </Button>
          <Button
            onClick={CrearVendedor}
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

export default Vendedor
