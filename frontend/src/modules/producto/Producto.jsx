// Importamos hooks de React
import { useEffect, useState } from "react"
// Importamos funciones del servicio de Producto
import { ObtenerProductos, EnviarProducto, EliminarProducto, ActualizarProducto } from '../../services/producto.service';
// Importamos el servicio de categorías para el dropdown
import { ObtenerCategorias } from '../../services/categoria.service';
// Importamos íconos de Material UI
import { Edit as EditIcon, Delete as DeleteIcon, AddBox as AddBoxIcon } from '@mui/icons-material';
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
CREATE TABLE PRODUCTO (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    id_categoria INT,
    FOREIGN KEY (id_categoria) REFERENCES CATEGORIA(id_categoria)
);
*/

const Producto = () => {
  // Estado para la lista de productos
  const [productos, SetProductos] = useState([]);
  // Estado para la lista de categorías
  const [categorias, SetCategorias] = useState([]);

  // Estado para abrir/cerrar modal
  const [Abrir, SetAbrir] = useState(false);

  // Estado para los datos del formulario
  const [formData, SetformData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    id_categoria: '',
  })

  // Estado para validaciones visuales
  const [errors, setErrors] = useState({});

  // Estados para modo edición
  const [modoEdicion, SetModoEdicion] = useState(false)
  const [productoEditado, SetProductoEditado] = useState(null);

  // Manejador de Inputs
  const CambioEntrada = (e) => {
    const { name, value } = e.target;
    SetformData({
      ...formData,
      [name]: value
    })

    // Limpiamos errores al escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  // Carga inicial
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const resultado = await ObtenerProductos();
        SetProductos(resultado);
      } catch (error) {
        console.log('Error al cargar productos:', error);
      }
    }
    const cargarCategorias = async () => {
      try {
        const resultado = await ObtenerCategorias();
        SetCategorias(resultado);
      } catch (error) {
        console.log('Error al cargar categorias:', error);
      }
    }
    cargarProductos();
    cargarCategorias();
  }, [])

  // Función de Validación
  const validarFormulario = () => {
    let nuevosErrores = {};
    let esValido = true;

    // Regex Alfanumérico para nombres de productos (Letras, números, espacios)
    const regexAlfanumerico = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9][a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s]*$/;

    // Validación Nombre: Requerido, >3 chars, Alfanumérico
    if (!formData.nombre || formData.nombre.trim() === '') {
      nuevosErrores.nombre = 'El nombre es obligatorio';
      esValido = false;
    } else if (formData.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'Mínimo 3 caracteres';
      esValido = false;
    } else if (!regexAlfanumerico.test(formData.nombre)) {
      nuevosErrores.nombre = 'Sin símbolos especiales';
      esValido = false;
    }

    // Validación Precio: Requerido, > 0
    if (!formData.precio || formData.precio === '') {
      nuevosErrores.precio = 'El precio es obligatorio';
      esValido = false;
    } else if (parseFloat(formData.precio) <= 0) {
      nuevosErrores.precio = 'El precio debe ser mayor a 0';
      esValido = false;
    }

    // Validación Stock: Requerido, >= 0
    if (formData.stock === '' || formData.stock === null || formData.stock === undefined) {
      nuevosErrores.stock = 'El stock es obligatorio';
      esValido = false;
    } else if (parseInt(formData.stock) < 0) {
      nuevosErrores.stock = 'No puede ser negativo';
      esValido = false;
    }

    // Validación Categoría: Requerido
    if (!formData.id_categoria) {
      nuevosErrores.id_categoria = 'Seleccione una categoría';
      esValido = false;
    }

    setErrors(nuevosErrores);
    return esValido;
  }

  // Guardar (Crear/Editar)
  const CrearProducto = async (e) => {
    e.preventDefault();

    // Validamos antes de enviar
    if (!validarFormulario()) {
      return;
    }

    try {
      if (modoEdicion) {
        // --- EDITAR ---
        await ActualizarProducto(productoEditado, {
          nombre: formData.nombre,
          precio: formData.precio,
          stock: formData.stock,
          id_categoria: formData.id_categoria
        })
        const resultado = await ObtenerProductos();
        SetProductos(resultado);
        handleClose();
        Swal.fire({
          title: "¡Actualizado Correctamente!",
          icon: "success",
          timer: 4000,
          showCancelButton: false
        });
      } else {
        // --- CREAR ---
        await EnviarProducto({
          nombre: formData.nombre,
          precio: formData.precio,
          stock: formData.stock,
          id_categoria: formData.id_categoria
        })
        const resultado = await ObtenerProductos();
        SetProductos(resultado);
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
        text: 'Hubo un error al guardar el producto'
      });
    }
  }

  // Cerrar Modal
  const handleClose = () => {
    SetAbrir(false);
    SetModoEdicion(false);
    SetProductoEditado(null);
    SetformData({
      nombre: '',
      precio: '',
      stock: '',
      id_categoria: ''
    });
    setErrors({});
  };

  // Abrir Modal Editar
  const AbrirModalEditar = (producto) => {
    SetModoEdicion(true)
    SetProductoEditado(producto.id_producto)
    SetformData({
      nombre: producto.nombre || '',
      precio: producto.precio || '',
      stock: producto.stock || '',
      id_categoria: producto.id_categoria || ''
    })
    setErrors({});
    SetAbrir(true);
  }

  // Eliminar
  const EliminarProductoFn = async (id) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar este producto?",
      text: "No podrás revertir los cambios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await EliminarProducto(id);
          const resultado = await ObtenerProductos();
          SetProductos(resultado);
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
            text: error.response?.data?.error || "No se puede eliminar el producto",
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
          startIcon={<AddBoxIcon />}
          onClick={() => SetAbrir(true)}
          sx={{ bgcolor: '#2C7873', '&:hover': { bgcolor: '#205e5a' } }}
        >
          Crear Producto
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de productos">
          <TableHead sx={{ bgcolor: 'grey.300' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow
                key={producto.id_producto}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {producto.id_producto}
                </TableCell>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>{producto.precio}</TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell>
                  {categorias.find(c => c.id_categoria === producto.id_categoria)?.nombre || producto.id_categoria}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton
                      onClick={() => AbrirModalEditar(producto)}
                      color="primary"
                      aria-label="editar"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => EliminarProductoFn(producto.id_producto)}
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
          {modoEdicion ? 'Editar Producto' : 'Crear nuevo Producto'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {/* Input Nombre con validación */}
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
            {/* Input Precio con validación */}
            <TextField
              label="Precio"
              name="precio"
              value={formData.precio}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              type="number"
              error={!!errors.precio}
              helperText={errors.precio}
            />
            {/* Input Stock con validación */}
            <TextField
              label="Stock"
              name="stock"
              value={formData.stock}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              type="number"
              error={!!errors.stock}
              helperText={errors.stock}
            />
            {/* Select Categoría con validación */}
            <TextField
              select
              label="Categoría"
              name="id_categoria"
              value={formData.id_categoria}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.id_categoria}
              helperText={errors.id_categoria}
            >
              {categorias.map((option) => (
                <MenuItem key={option.id_categoria} value={option.id_categoria}>
                  {option.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cerrar
          </Button>
          <Button
            onClick={CrearProducto}
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

export default Producto
