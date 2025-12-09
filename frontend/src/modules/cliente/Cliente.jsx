// Importamos los hooks necesarios de React: 'useEffect' para efectos secundarios y 'useState' para el estado del componente
import { useEffect, useState } from "react"
// Importamos las funciones del servicio 'cliente.service' para interactuar con la API (backend)
import { ObtenerClientes, EnviarCliente, EliminarCliente, ActualizarCliente } from '../../services/cliente.service';
// Importamos los iconos de Material UI que usaremos en la interfaz: Editar, Eliminar y Agregar Persona
import { Edit as EditIcon, Delete as DeleteIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
// Importamos los componentes de Material UI para construir la interfaz gráfica (Tablas, Botones, Inputs, Diálogos, etc.)
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Typography, Box, Stack
} from '@mui/material';
// Importamos SweetAlert2 para mostrar alertas bonitas y modales de confirmación
import Swal from 'sweetalert2'

/*
// COMENTARIO DE REFERENCIA SOBRE LA TABLA EN BASE DE DATOS
CREATE TABLE CLIENTE (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY, // Identificador único
    nombre VARCHAR(50) NOT NULL, // Nombre obligatorio
    paterno VARCHAR(50), // Apellido Paterno
    materno VARCHAR(50), // Apellido Materno
    nacionalidad VARCHAR(50) // Nacionalidad
)
*/

// Definición del componente funcional 'Cliente'
const Cliente = () => {
  // Estado 'clientes': Almacena la lista de clientes obtenidos de la base de datos (array vacío inicial)
  const [clientes, SetClientes] = useState([]);
  // Estado 'Abrir': Controla si el modal (diálogo) de crear/editar está abierto (true) o cerrado (false)
  const [Abrir, SetAbrir] = useState(false);

  // Estado 'formData': Almacena los datos del formulario que el usuario está escribiendo
  const [formData, SetformData] = useState({
    nombre: '',       // Campo para el nombre
    paterno: '',      // Campo para el apellido paterno
    materno: '',      // Campo para el apellido materno
    nacionalidad: '', // Campo para la nacionalidad
  })

  // Estado 'errors': Almacena los mensajes de error de validación para cada campo
  // Si un campo tiene error, su clave aquí tendrá el mensaje (ej: errors.nombre = "Campo requerido")
  const [errors, setErrors] = useState({});

  // Estado 'modoEdicion': Indica si estamos editando un cliente existente (true) o creando uno nuevo (false)
  const [modoEdicion, SetModoEdicion] = useState(false)
  // Estado 'clienteEditado': Almacena el ID del cliente que se está editando actualmente (si aplica)
  const [clienteEditado, SetClienteEditado] = useState(null);

  // Función 'CambioEntrada': Se ejecuta cada vez que el usuario escribe en un input
  const CambioEntrada = (e) => {
    // Desestructuramos el nombre del campo y su valor del evento
    const { name, value } = e.target;

    // Actualizamos el estado 'formData' manteniendo los valores anteriores
    SetformData({
      ...formData,
      [name]: value
    })

    // Limpiamos el error del campo específico cuando el usuario empieza a corregirlo/escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '' // Borramos el mensaje de error para este campo
      })
    }
  }

  // Hook 'useEffect': Se ejecuta una vez cuando el componente se monta (al cargar la página)
  useEffect(() => {
    // Definimos una función asíncrona para cargar los clientes
    const cargarClientes = async () => {
      try {
        // Llamamos al servicio 'ObtenerClientes' para pedir los datos al servidor
        const resultado = await ObtenerClientes();
        // Guardamos los datos recibidos en el estado 'clientes'
        SetClientes(resultado);
      } catch (error) {
        // Si hay error, lo mostramos en consola
        console.log('Error al cargar clientes:', error);
      }
    }
    // Ejecutamos la función de carga
    cargarClientes();
  }, [])

  // Función para validar el formulario antes de enviar
  const validarFormulario = () => {
    let nuevosErrores = {}; // Objeto temporal para acumular errores detectados
    let esValido = true; // Bandera para indicar si el formulario pasa la validación

    // Validación: Nombre obligatorio y sin espacios vacíos
    if (!formData.nombre || formData.nombre.trim() === '') {
      nuevosErrores.nombre = 'El nombre es obligatorio';
      esValido = false;
    } else if (formData.nombre.trim().length < 3) {
      // Validación: Nombre muy corto
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 letras';
      esValido = false;
    }

    // Validación: Apellido Paterno obligatorio
    if (!formData.paterno || formData.paterno.trim() === '') {
      nuevosErrores.paterno = 'El apellido paterno es requerido';
      esValido = false;
    } else if (formData.paterno.trim().length < 3) {
      nuevosErrores.paterno = 'El apellido paterno debe tener al menos 3 letras';
      esValido = false;
    }

    // Validación: Nacionalidad obligatoria y con formato válido
    // Expresión Regular (Regex):
    // ^ -> Inicio de la cadena
    // [a-zA-ZÁÉÍÓÚáéíóúÑñ] -> Debe empezar obligatoriamente con una letra (mayúscula o minúscula, con tilde o ñ)
    // [a-zA-ZÁÉÍÓÚáéíóúÑñ\s]* -> Después puede tener letras o espacios (para nombres compuestos como "Costa Rica")
    // $ -> Fin de la cadena
    // Esto asegura que no tenga números ni símbolos especiales y no empiece con número.
    const regexNacionalidad = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ][a-zA-ZÁÉÍÓÚáéíóúÑñ\s]*$/;

    if (!formData.nacionalidad || formData.nacionalidad.trim() === '') {
      nuevosErrores.nacionalidad = 'Indique la nacionalidad';
      esValido = false;
    } else if (!regexNacionalidad.test(formData.nacionalidad)) {
      // Mensaje de error si no cumple el formato
      nuevosErrores.nacionalidad = 'Solo letras, sin números ni símbolos especiales';
      esValido = false;
    }

    // Actualizamos el estado de errores con los encontrados
    setErrors(nuevosErrores);
    // Retornamos true si no hubo errores, false si hubo alguno
    return esValido;
  }

  // FUNCION ASINCRONA PARA CREAR O ACTUALIZAR UN CLIENTE
  const CrearCliente = async (e) => {
    // Evitamos recarga de página
    e.preventDefault();

    // Ejecutamos la validación. Si devuelve 'false', detenemos el proceso aqui.
    if (!validarFormulario()) {
      // Opcional: Mostrar una alerta general avisando que hay errores, aunque los helpers ya los muestran
      /* Swal.fire({
          icon: 'error',
          title: 'Formulario con errores',
          text: 'Por favor corrija los campos marcados en rojo'
      }); */
      return;
    }

    try {
      // Verificamos si estamos en 'modoEdicion'
      if (modoEdicion) {
        // --- LOGICA PARA ACTUALIZAR (EDITAR) ---
        await ActualizarCliente(clienteEditado, {
          nombre: formData.nombre,
          paterno: formData.paterno,
          materno: formData.materno,
          nacionalidad: formData.nacionalidad
        })

        const resultado = await ObtenerClientes();
        SetClientes(resultado);
        handleClose();

        Swal.fire({
          title: "¡Actualizado Correctamente!",
          icon: "success",
          timer: 4000,
          showCancelButton: false
        });
      } else {
        // --- LOGICA PARA CREAR (NUEVO) ---
        await EnviarCliente({
          nombre: formData.nombre,
          paterno: formData.paterno,
          materno: formData.materno,
          nacionalidad: formData.nacionalidad
        })

        const resultado = await ObtenerClientes();
        SetClientes(resultado);
        handleClose();

        Swal.fire({
          title: "¡Se creó exitosamente!",
          icon: "success",
          timer: 4000
        });
      }
    } catch (error) {
      console.log(error)
      // Si el servidor devuelve error 400 (Bad Request), podríamos mostrarlo también en los fields si parseamos la respuesta
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al guardar el cliente'
      });
    }
  }

  // Función 'handleClose': Cierra el modal y limpia el formulario y errores
  const handleClose = () => {
    SetAbrir(false); // Cierra el diálogo
    SetModoEdicion(false); // Desactiva modo edición
    SetClienteEditado(null); // Borra el ID del cliente editado
    // Resetea el formulario a valores vacíos
    SetformData({
      nombre: '',
      paterno: '',
      materno: '',
      nacionalidad: ''
    });
    // Limpia los errores acumulados
    setErrors({});
  };

  // Función 'AbrirModalEditar': Prepara el formulario con los datos de un cliente para editarlo
  const AbrirModalEditar = (cliente) => {
    SetModoEdicion(true)
    SetClienteEditado(cliente.id_cliente)
    SetformData({
      nombre: cliente.nombre || '',
      paterno: cliente.paterno || '',
      materno: cliente.materno || '',
      nacionalidad: cliente.nacionalidad || ''
    })
    setErrors({}); // Limpiamos errores previos al abrir edición
    SetAbrir(true);
  }

  // Función 'EliminarClienteFn': Pide confirmación y elimina un cliente
  const EliminarClienteFn = async (id) => {
    // Muestra alerta de confirmación
    Swal.fire({
      title: "¿Estás seguro de eliminar este cliente?",
      text: "No podrás revertir los cambios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar"
    }).then(async (result) => {
      // Si el usuario confirma (da clic en Sí)
      if (result.isConfirmed) {
        try {
          // Llama al servicio para eliminar el cliente por ID
          await EliminarCliente(id);
          // Recarga la lista de clientes
          const resultado = await ObtenerClientes();
          SetClientes(resultado);
          // Muestra mensaje de éxito
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
            text: error.response?.data?.error || "No se puede eliminar el cliente",
            icon: "error",
            timer: 4000,
            showCancelButton: false
          });
        }
      }
    });
  }

  // --- RENDERIZADO DEL COMPONENTE (Interfaz Gráfica) ---
  return (
    // Contenedor principal con padding (espaciado interno) de 4 unidades
    <Box sx={{ p: 4 }}>
      {/* Caja para el botón de crear, alineado a la derecha */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
        {/* Botón para abrir el modal de creación */}
        <Button
          variant="contained" // Estilo relleno
          startIcon={<PersonAddIcon />} // Icono de agregar persona
          onClick={() => SetAbrir(true)} // Al hacer clic, abre el modal
          sx={{ bgcolor: '#2C7873', '&:hover': { bgcolor: '#205e5a' } }} // Estilos personalizados de color
        >
          Crear Cliente
        </Button>
      </Box>

      {/* Contenedor de la tabla con efecto de elevación (sombra) */}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        {/* Tabla de Material UI */}
        <Table sx={{ minWidth: 650 }} aria-label="tabla de clientes">
          {/* Cabecera de la tabla */}
          <TableHead sx={{ bgcolor: 'grey.300' }}>
            <TableRow>
              {/* Celdas de cabecera con texto en negrita */}
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Paterno</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Materno</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nacionalidad</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          {/* Cuerpo de la tabla donde se muestran los datos */}
          <TableBody>
            {/* Iteramos sobre el array 'clientes' para crear una fila por cada cliente */}
            {clientes.map((cliente) => (
              <TableRow
                key={cliente.id_cliente} // Clave única para React
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }} // Estilo para quitar borde en última fila
              >
                {/* Celda del ID */}
                <TableCell component="th" scope="row">
                  {cliente.id_cliente}
                </TableCell>
                {/* Celda del Nombre */}
                <TableCell>{cliente.nombre}</TableCell>
                {/* Celda del Apellido Paterno */}
                <TableCell>{cliente.paterno}</TableCell>
                {/* Celda del Apellido Materno */}
                <TableCell>{cliente.materno}</TableCell>
                {/* Celda de la Nacionalidad */}
                <TableCell>{cliente.nacionalidad}</TableCell>
                {/* Celda de Acciones (Editar/Eliminar) */}
                <TableCell align="center">
                  {/* Stack para alinear botones horizontalmente */}
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {/* Botón de Editar */}
                    <IconButton
                      onClick={() => AbrirModalEditar(cliente)} // Abre modal con datos
                      color="primary" // Color primario (azul)
                      aria-label="editar"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    {/* Botón de Eliminar */}
                    <IconButton
                      onClick={() => EliminarClienteFn(cliente.id_cliente)} // Llama función eliminar
                      color="error" // Color error (rojo)
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

      {/* Componente Dialog (Modal) para Formulario */}
      <Dialog open={Abrir} onClose={handleClose} maxWidth="sm" fullWidth>
        {/* Título del Diálogo */}
        <DialogTitle sx={{ bgcolor: '#2C7873', color: 'white', textAlign: 'center' }}>
          {/* Cambia el texto según si es edición o creación */}
          {modoEdicion ? 'Editar Cliente' : 'Crear nuevo Cliente'}
        </DialogTitle>
        {/* Contenido del Diálogo (El formulario) */}
        <DialogContent sx={{ mt: 2 }}>
          {/* Caja flexible vertical para los inputs */}
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {/* Input para Nombre con Validación Visual (MUI) */}
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.nombre} // Muestra el borde rojo si hay error en 'nombre'
              helperText={errors.nombre} // Muestra el mensaje de error debajo del input
            />
            {/* Input para Paterno con Validación Visual */}
            <TextField
              label="Paterno"
              name="paterno"
              value={formData.paterno}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.paterno} // Borde rojo si hay error
              helperText={errors.paterno} // Mensaje de error
            />
            {/* Input para Materno (Opcional, sin validación estricta por ahora) */}
            <TextField
              label="Materno"
              name="materno"
              value={formData.materno}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
            />
            {/* Input para Nacionalidad con Validación Visual */}
            <TextField
              label="Nacionalidad"
              name="nacionalidad"
              value={formData.nacionalidad}
              onChange={CambioEntrada}
              fullWidth
              variant="outlined"
              error={!!errors.nacionalidad} // Borde rojo si hay error
              helperText={errors.nacionalidad} // Mensaje de error
            />
          </Box>
        </DialogContent>
        {/* Acciones del Diálogo (Botones abajo) */}
        <DialogActions sx={{ p: 2 }}>
          {/* Botón Cerrar */}
          <Button onClick={handleClose} color="error" variant="outlined">
            Cerrar
          </Button>
          {/* Botón Acción (Crear/Editar) */}
          <Button
            onClick={CrearCliente} // Ejecuta la función principal
            variant="contained"
            sx={{ bgcolor: '#2C7873', '&:hover': { bgcolor: '#205e5a' } }}
          >
            {/* Texto dinámico */}
            {modoEdicion ? 'Editar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

// Exportamos el componente para usarlo en otras partes de la app
export default Cliente
