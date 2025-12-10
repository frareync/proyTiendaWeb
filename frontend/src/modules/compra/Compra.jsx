// Importamos los hooks necesarios de React
import { useEffect, useState } from "react"
// Importamos los servicios para interactuar con el backend (Compra, Producto, Cliente, Vendedor)
import { ObtenerCompras, EnviarCompra, ActualizarCompra, EliminarCompra } from '../../services/compra.service'
import { ObtenerProductos } from '../../services/producto.service'
import { ObtenerClientes } from '../../services/cliente.service'
import { ObtenerVendedores } from '../../services/vendedor.service'
// Importamos los íconos de Material UI
import { Edit as EditIcon, Delete as DeleteIcon, LibraryAdd as LibraryAddIcon } from '@mui/icons-material';
// Importamos componentes de Material UI para la interfaz visual
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Box, Stack, MenuItem
} from '@mui/material';
// Importamos SweetAlert2 para las notificaciones
import Swal from 'sweetalert2'

/*
// REFERENCIA TABLA BASE DE DATOS
CREATE TABLE COMPRA (
    id_compra INT AUTO_INCREMENT PRIMARY KEY, // ID único
    id_producto INT NOT NULL, // FK Producto
    id_cliente INT NOT NULL,  // FK Cliente
    id_vendedor INT NOT NULL, // FK Vendedor
    cantidad INT NOT NULL,    // Cantidad comprada
    FOREIGN KEY (id_producto) REFERENCES PRODUCTO(id_producto),
    FOREIGN KEY (id_cliente) REFERENCES CLIENTE(id_cliente),
    FOREIGN KEY (id_vendedor) REFERENCES VENDEDOR(id_vendedor)
);
*/

const Compra = () => {
  // Estado para almacenar la lista de compras
  const [compras, SetCompras] = useState([]);

  // Estados para las listas de las llaves foráneas (FK)
  const [productos, SetProductos] = useState([]); // Lista de productos para el Select
  const [clientes, SetClientes] = useState([]);   // Lista de clientes para el Select
  const [vendedores, SetVendedores] = useState([]); // Lista de vendedores para el Select

  // Estado para controlar la apertura del modal (diálogo)
  const [Abrir, SetAbrir] = useState(false);

  // Estado para los datos del formulario
  const [formData, SetformData] = useState({
    id_producto: '',
    id_cliente: '',
    id_vendedor: '',
    cantidad: ''
  })

  // --- NUEVO: Estado para gestionar errores de validación visual ---
  const [errors, setErrors] = useState({});

  // Estados para controlar el modo de edición
  const [modoEdicion, SetModoEdicion] = useState(false)
  const [compraEditada, SetCompraEditada] = useState(null);

  // Función que maneja los cambios en los inputs del formulario
  const CambioEntrada = (e) => {
    const { name, value } = e.target;
    SetformData({
      ...formData,
      [name]: value
    })

    // --- NUEVO: Limpiamos el error visual del campo cuando el usuario escribe ---
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  // useEffect: Se ejecuta al cargar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Usamos Promise.all para cargar todas las tablas necesarias simultáneamente
        const [resCompras, resProductos, resClientes, resVendedores] = await Promise.all([
          ObtenerCompras(),
          ObtenerProductos(),
          ObtenerClientes(),
          ObtenerVendedores()
        ]);

        // Guardamos los resultados en sus estados correspondientes
        SetCompras(resCompras);
        SetProductos(resProductos);
        SetClientes(resClientes);
        SetVendedores(resVendedores);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    }
    cargarDatos();
  }, [])

  // --- NUEVO: Función de Validación del Formulario ---
  const validarFormulario = () => {
    let nuevosErrores = {};
    let esValido = true;

    // Validar Producto seleccionado
    if (!formData.id_producto) {
      nuevosErrores.id_producto = 'Seleccione un producto';
      esValido = false;
    }
    // Validar Cliente seleccionado
    if (!formData.id_cliente) {
      nuevosErrores.id_cliente = 'Seleccione un cliente';
      esValido = false;
    }
    // Validar Vendedor seleccionado
    if (!formData.id_vendedor) {
      nuevosErrores.id_vendedor = 'Seleccione un vendedor';
      esValido = false;
    }
    // Validar Cantidad (debe existir y ser mayor a 0)
    if (!formData.cantidad || formData.cantidad <= 0) {
      nuevosErrores.cantidad = 'Cantidad incorrecta (debe ser > 0)';
      esValido = false;
    }

    setErrors(nuevosErrores);
    return esValido;
  }

  // Función para Crear o Actualizar una Compra
  const CrearCompra = async (e) => {
    e.preventDefault(); // Evita el refresh automático del form

    // --- NUEVO: Ejecutamos validación antes de procesar ---
    if (!validarFormulario()) {
      return; // Si no es válido, detenemos la ejecución
    }

    try {
      if (modoEdicion) {
        // --- MODO EDICIÓN ---
        // Actualizamos la compra existente
        await ActualizarCompra(compraEditada, {
          id_producto: formData.id_producto,
          id_cliente: formData.id_cliente,
          id_vendedor: formData.id_vendedor,
          cantidad: formData.cantidad
        })
        // Recargamos la lista de compras
        const resultado = await ObtenerCompras();
        SetCompras(resultado);
        // Cerramos modal y mostramos éxito
        handleClose();
        Swal.fire({
          title: "¡Actualizado Correctamente!",
          icon: "success",
          timer: 4000,
          showCancelButton: false
        });
      } else {
        // --- MODO CREACIÓN ---
        // Enviamos la nueva compra al backend
        await EnviarCompra({
          id_producto: formData.id_producto,
          id_cliente: formData.id_cliente,
          id_vendedor: formData.id_vendedor,
          cantidad: formData.cantidad
        })
        // Recargamos la lista
        const resultado = await ObtenerCompras();
        SetCompras(resultado);
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

  // Función para cerrar el modal y limpiar el formulario
  const handleClose = () => {
    SetAbrir(false);
    SetModoEdicion(false);
    SetCompraEditada(null);
    SetformData({
      id_producto: '',
      id_cliente: '',
      id_vendedor: '',
      cantidad: ''
    });
    setErrors({}); // --- NUEVO: Limpiamos errores al cerrar ---
  };

  // Función para abrir el modal en modo edición con los datos cargados
  const AbrirModalEditar = (compra) => {
    SetModoEdicion(true)
    SetCompraEditada(compra.id_compra)
    SetformData({
      id_producto: compra.id_producto,
      id_cliente: compra.id_cliente,
      id_vendedor: compra.id_vendedor,
      cantidad: compra.cantidad
    })
    setErrors({}); // --- NUEVO: Limpiamos errores al abrir edición ---
    SetAbrir(true);
  }

  // Función para eliminar una compra con confirmación
  const EliminarCompraFn = async (id) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar esta compra?",
      text: "No podrás revertir los cambios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar"
    }).then(async (result) => {
      // Si el usuario confirma
      if (result.isConfirmed) {
        try {
          await EliminarCompra(id);
          const resultado = await ObtenerCompras();
          SetCompras(resultado);
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
            text: error.response?.data?.error || "No se puede eliminar la compra",
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
      {/* Botón para abrir el modal de crear compra */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<LibraryAddIcon />}
          onClick={() => SetAbrir(true)}
          sx={{ bgcolor: '#2C7873', '&:hover': { bgcolor: '#205e5a' } }}
        >
          Registrar Venta
        </Button>
      </Box>

      {/* Tabla de Compras */}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de ventas">
          <TableHead sx={{ bgcolor: 'grey.300' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Vendedor</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cantidad</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {compras.map((compra) => (
              <TableRow
                key={compra.id_compra}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {compra.id_compra}
                </TableCell>
                {/* Mostramos el nombre del producto buscando por ID */}
                <TableCell>
                  {productos.find(p => p.id_producto === compra.id_producto)?.nombre || compra.id_producto}
                </TableCell>
                {/* Mostramos Nombre y Apellido del Cliente buscando por ID */}
                <TableCell>
                  {(() => {
                    const cliente = clientes.find(c => c.id_cliente === compra.id_cliente);
                    // Concatenamos nombre y apellido paterno
                    return cliente ? `${cliente.nombre} ${cliente.paterno || ''}` : compra.id_cliente;
                  })()}
                </TableCell>
                {/* Mostramos el nombre del vendedor buscando por ID */}
                <TableCell>
                  {vendedores.find(v => v.id_vendedor === compra.id_vendedor)?.nombre || compra.id_vendedor}
                </TableCell>
                <TableCell>{compra.cantidad}</TableCell>
                <TableCell>
                  {/* Formateamos la fecha a local si existe */}
                  {compra.fecha_compra ? new Date(compra.fecha_compra).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <IconButton
                      onClick={() => AbrirModalEditar(compra)}
                      color="primary"
                      aria-label="editar"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => EliminarCompraFn(compra.id_compra)}
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

      {/* Modal/Diálogo para Crear/Editar */}
      <Dialog open={Abrir} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#2C7873', color: 'white', textAlign: 'center' }}>
          {modoEdicion ? 'Editar Venta' : 'Crear nueva Venta'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>

            {/* Select (Dropdown) para Producto */}
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

            {/* Select (Dropdown) para Cliente - Muestra Nombre Completo */}
            <TextField
              select
              label="Cliente"
              name="id_cliente"
              value={formData.id_cliente}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.id_cliente}
              helperText={errors.id_cliente}
            >
              {clientes.map((option) => (
                <MenuItem key={option.id_cliente} value={option.id_cliente}>
                  {option.nombre} {option.paterno}
                </MenuItem>
              ))}
            </TextField>

            {/* Select (Dropdown) para Vendedor */}
            <TextField
              select
              label="Vendedor"
              name="id_vendedor"
              value={formData.id_vendedor}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.id_vendedor}
              helperText={errors.id_vendedor}
            >
              {vendedores.map((option) => (
                <MenuItem key={option.id_vendedor} value={option.id_vendedor}>
                  {option.nombre} {option.paterno}
                </MenuItem>
              ))}
            </TextField>

            {/* Input para Cantidad */}
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
            onClick={CrearCompra}
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

export default Compra
