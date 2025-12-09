// Importamos hooks de React
import { useEffect, useState } from "react"
// Importamos los servicios para interactuar con la API
import { ObtenerProvee, EnviarProvee, EliminarProvee, ActualizarProvee } from '../../services/provee.service';
import { ObtenerProductos } from '../../services/producto.service';
import { ObtenerProveedores } from '../../services/proveedor.service';
// Importamos íconos de Material UI
import { Edit as EditIcon, Delete as DeleteIcon, LocalShipping as LocalShippingIcon } from '@mui/icons-material';
// Importamos componentes de Material UI
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Box, Stack, MenuItem
} from '@mui/material';
// Importamos SweetAlert2
import Swal from 'sweetalert2'

/*
// REFERENCIA SQL
CREATE TABLE PROVEE (
    id_provee INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,  // FK Producto
    id_proveedor INT NOT NULL, // FK Proveedor
    fechaIngreso DATE NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto),
    FOREIGN KEY (id_proveedor) REFERENCES PROVEEDOR(id_proveedor)
);
*/

const Provee = () => {
  // Estado para la lista de abastecimientos (Provee)
  const [provees, SetProvees] = useState([]);

  // Estados para las listas de llaves foráneas
  const [productos, SetProductos] = useState([]); // Lista de productos
  const [proveedores, SetProveedores] = useState([]); // Lista de proveedores

  // Estado para el modal
  const [Abrir, SetAbrir] = useState(false);

  // Estado para el formulario (datos de la relación Provee)
  const [formData, SetformData] = useState({
    id_producto: '',
    id_proveedor: '',
    fechaIngreso: '',
    cantidad: ''
  })

  // --- NUEVO: Estado para errores de validación ---
  const [errors, setErrors] = useState({});

  // Estados para edición
  const [modoEdicion, SetModoEdicion] = useState(false)
  const [proveeEditado, SetProveeEditado] = useState(null);

  // Manejador de Inputs
  const CambioEntrada = (e) => {
    const { name, value } = e.target;
    SetformData({
      ...formData,
      [name]: value
    })

    // --- NUEVO: Limpiamos error visual al escribir ---
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  // Hook useEffect: Carga inicial de datos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Carga simultánea de Provee, Productos y Proveedores
        const [resProvee, resProductos, resProveedores] = await Promise.all([
          ObtenerProvee(),
          ObtenerProductos(),
          ObtenerProveedores()
        ]);

        SetProvees(resProvee);
        SetProductos(resProductos);
        SetProveedores(resProveedores);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    }
    cargarDatos();
  }, [])

  // --- NUEVO: Función de Validación ---
  const validarFormulario = () => {
    let nuevosErrores = {};
    let esValido = true;

    if (!formData.id_producto) {
      nuevosErrores.id_producto = 'Seleccione un producto';
      esValido = false;
    }
    if (!formData.id_proveedor) {
      nuevosErrores.id_proveedor = 'Seleccione un proveedor';
      esValido = false;
    }
    if (!formData.fechaIngreso) {
      nuevosErrores.fechaIngreso = 'Indique la fecha';
      esValido = false;
    }
    if (!formData.cantidad || formData.cantidad <= 0) {
      nuevosErrores.cantidad = 'Cantidad incorrecta (debe ser > 0)';
      esValido = false;
    }

    setErrors(nuevosErrores);
    return esValido;
  }

  // Función para Crear o Actualizar
  const CrearProvee = async (e) => {
    e.preventDefault();

    // --- NUEVO: Validación previa ---
    if (!validarFormulario()) {
      return;
    }

    try {
      if (modoEdicion) {
        // --- EDITAR REGISTRO ---
        await ActualizarProvee(proveeEditado, {
          id_producto: formData.id_producto,
          id_proveedor: formData.id_proveedor,
          fechaIngreso: formData.fechaIngreso,
          cantidad: formData.cantidad
        })
        const resultado = await ObtenerProvee();
        SetProvees(resultado);
        handleClose();
        Swal.fire({
          title: "¡Actualizado Correctamente!",
          icon: "success",
          timer: 4000,
          showCancelButton: false
        });
      } else {
        // --- NUEVO REGISTRO ---
        await EnviarProvee({
          id_producto: formData.id_producto,
          id_proveedor: formData.id_proveedor,
          fechaIngreso: formData.fechaIngreso,
          cantidad: formData.cantidad
        })
        const resultado = await ObtenerProvee();
        SetProvees(resultado);
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
        title: "Error",
        text: "Hubo un problema al procesar la solicitud",
        icon: "error",
      });
    }
  }

  // Cerrar Modal
  const handleClose = () => {
    SetAbrir(false);
    SetModoEdicion(false);
    SetProveeEditado(null);
    SetformData({
      id_producto: '',
      id_proveedor: '',
      fechaIngreso: '',
      cantidad: ''
    });
    setErrors({}); // --- NUEVO: Limpieza de errores ---
  };

  // Abrir Modal para Editar
  const AbrirModalEditar = (provee) => {
    SetModoEdicion(true)
    SetProveeEditado(provee.id_provee)

    // Formatear fecha para el input HTML (YYYY-MM-DD), necesario para inputs tipo date
    const fecha = provee.fechaIngreso ? provee.fechaIngreso.split('T')[0] : '';
    console.log("Fecha recuperada:", provee.fechaIngreso, "Fecha formateada:", fecha);

    SetformData({
      id_producto: provee.id_producto,
      id_proveedor: provee.id_proveedor,
      fechaIngreso: fecha,
      cantidad: provee.cantidad
    })
    setErrors({}); // --- NUEVO: Limpieza de errores ---
    SetAbrir(true);
  }

  // Eliminar un registro
  const EliminarProveeFn = async (id) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar este registro?",
      text: "No podrás revertir los cambios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await EliminarProvee(id);
          const resultado = await ObtenerProvee();
          SetProvees(resultado);
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
            text: error.response?.data?.error || "No se puede eliminar el registro",
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
      {/* Botón para registrar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<LocalShippingIcon />}
          onClick={() => SetAbrir(true)}
          sx={{ bgcolor: '#2C7873', '&:hover': { bgcolor: '#205e5a' } }}
        >
          Registrar nuevo suministro
        </Button>
      </Box>

      {/* Tabla de Resultados */}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de suministros">
          <TableHead sx={{ bgcolor: 'grey.300' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Proveedor</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Fecha Ingreso</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {provees.map((item) => (
              <TableRow
                key={item.id_provee}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {item.id_provee}
                </TableCell>
                {/* Nombre de Producto */}
                <TableCell>
                  {productos.find(p => p.id_producto === item.id_producto)?.nombre || item.id_producto}
                </TableCell>
                {/* Nombre y Apellido de Proveedor */}
                <TableCell>
                  {(() => {
                    const proveedor = proveedores.find(p => p.id_proveedor === item.id_proveedor);
                    return proveedor ? `${proveedor.nombre} ${proveedor.paterno || ''}` : item.id_proveedor;
                  })()}
                </TableCell>
                {/* Formato fecha local */}
                <TableCell>
                  {new Date(item.fechaIngreso).toLocaleDateString()}
                </TableCell>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton
                      onClick={() => AbrirModalEditar(item)}
                      color="primary"
                      aria-label="editar"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => EliminarProveeFn(item.id_provee)}
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

      {/* Ventana Modal */}
      <Dialog open={Abrir} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#2C7873', color: 'white', textAlign: 'center' }}>
          {modoEdicion ? 'Editar Suministro' : 'Nuevo Suministro'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>

            {/* Select Producto */}
            <TextField
              select
              label="Producto"
              name="id_producto"
              value={formData.id_producto}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.id_producto}
              helperText={errors.id_producto}
            >
              {productos.map((option) => (
                <MenuItem key={option.id_producto} value={option.id_producto}>
                  {option.nombre}
                </MenuItem>
              ))}
            </TextField>

            {/* Select Proveedor - Mostramos Nombre y Paterno */}
            <TextField
              select
              label="Proveedor"
              name="id_proveedor"
              value={formData.id_proveedor}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.id_proveedor}
              helperText={errors.id_proveedor}
            >
              {proveedores.map((option) => (
                <MenuItem key={option.id_proveedor} value={option.id_proveedor}>
                  {option.nombre} {option.paterno}
                </MenuItem>
              ))}
            </TextField>

            {/* Input Fecha */}
            <TextField
              label="Fecha Ingreso"
              name="fechaIngreso"
              type="date"
              value={formData.fechaIngreso}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.fechaIngreso}
              helperText={errors.fechaIngreso}
              InputLabelProps={{
                shrink: true,
              }}
            />

            {/* Input Cantidad */}
            <TextField
              label="Cantidad"
              name="cantidad"
              type="number"
              value={formData.cantidad}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.cantidad}
              helperText={errors.cantidad}
            />

          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cerrar
          </Button>
          <Button
            onClick={CrearProvee}
            variant="contained"
            sx={{ bgcolor: '#2C7873', '&:hover': { bgcolor: '#205e5a' } }}
          >
            {modoEdicion ? 'Editar' : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Provee
