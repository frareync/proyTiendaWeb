// Importamos hooks de React
import { useEffect, useState } from "react"
// Importamos funciones del servicio
import { ObtenerCategorias, EnviarCategoria, EliminarCategoria, ActualizarCategoria } from '../../services/categoria.service'
// Importamos íconos de Material UI
import { Edit as EditIcon, Delete as DeleteIcon, LibraryAdd as LibraryAddIcon } from '@mui/icons-material';
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
CREATE TABLE CATEGORIA (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200)
);
*/

const Categoria = () => {
    // Estado de la lista de categorías
    const [categorias, SetCategorias] = useState([]);
    // Estado para abrir/cerrar modal
    const [Abrir, SetAbrir] = useState(false);

    // Estado de datos del formulario
    const [formData, SetformData] = useState({
        nombre: '',
        descripcion: ''
    })

    // Estado 'errors' para validaciones visuales
    const [errors, setErrors] = useState({});

    // Estados para edición
    const [modoEdicion, SetModoEdicion] = useState(false)
    const [categoriaEditada, SetCategoriaEditada] = useState(null);

    // Función al escribir en inputs
    const CambioEntrada = (e) => {
        const { name, value } = e.target;
        SetformData({
            ...formData,
            [name]: value
        })

        // Limpiamos el error visual al escribir
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            })
        }
    }

    // Carga inicial
    useEffect(() => {
        const cargarCategorias = async () => {
            const resultado = await ObtenerCategorias();
            SetCategorias(resultado);
        }
        cargarCategorias();
    }, [])

    // Función de Validación Visual
    const validarFormulario = () => {
        let nuevosErrores = {};
        let esValido = true;

        // Regex Alfanumérico (Letras, números y espacios) para permitir nombres como "Bebidas 2L"
        const regexAlfanumerico = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9][a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s]*$/;

        // Validar Nombre: Obligatorio, >3 carac, Alfanumérico
        if (!formData.nombre || formData.nombre.trim() === '') {
            nuevosErrores.nombre = 'Nombre obligatorio';
            esValido = false;
        } else if (formData.nombre.trim().length < 3) {
            nuevosErrores.nombre = 'Mínimo 3 caracteres';
            esValido = false;
        } else if (!regexAlfanumerico.test(formData.nombre)) {
            nuevosErrores.nombre = 'Sin caracteres especiales';
            esValido = false;
        }

        // Descripción es opcional en la BD, así que no es obligatoria.

        setErrors(nuevosErrores);
        return esValido;
    }

    // Guardar (Crear/Editar)
    const CrearCategoria = async (e) => {
        e.preventDefault();

        // Validamos antes de enviar
        if (!validarFormulario()) {
            return;
        }

        try {
            if (modoEdicion) {
                // --- EDITAR ---
                await ActualizarCategoria(categoriaEditada, {
                    nombre: formData.nombre,
                    descripcion: formData.descripcion
                })
                const resultado = await ObtenerCategorias();
                SetCategorias(resultado);
                handleClose();
                Swal.fire({
                    title: "¡Actualizado Correctamente!",
                    icon: "success",
                    timer: 4000,
                    showCancelButton: false
                });
            } else {
                // --- CREAR ---
                await EnviarCategoria({
                    nombre: formData.nombre,
                    descripcion: formData.descripcion
                })
                const resultado = await ObtenerCategorias();
                SetCategorias(resultado);
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
                text: 'Hubo un error al guardar la categoría'
            });
        }
    }

    // Cerrar Modal
    const handleClose = () => {
        SetAbrir(false);
        SetModoEdicion(false);
        SetCategoriaEditada(null);
        SetformData({
            nombre: '',
            descripcion: ''
        });
        setErrors({});
    };

    // Abrir Modal Editar
    const AbrirModalEditar = (categoria) => {
        SetModoEdicion(true)
        SetCategoriaEditada(categoria.id_categoria)
        SetformData({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion || ''
        })
        setErrors({});
        SetAbrir(true);
    }

    // Eliminar
    const EliminarCategoriaFn = async (id) => {
        Swal.fire({
            title: "¿Estás seguro de eliminar esta categoría?",
            text: "No podrás revertir los cambios",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, Eliminar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await EliminarCategoria(id);
                    const resultado = await ObtenerCategorias();
                    SetCategorias(resultado);
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
                        text: error.response?.data?.error || "No se puede eliminar la categoría",
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
                    startIcon={<LibraryAddIcon />}
                    onClick={() => SetAbrir(true)}
                    sx={{ bgcolor: '#2C7873', '&:hover': { bgcolor: '#205e5a' } }}
                >
                    Crear Categoría
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="tabla de categorias">
                    <TableHead sx={{ bgcolor: 'grey.300' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categorias.map((categoria) => (
                            <TableRow
                                key={categoria.id_categoria}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {categoria.id_categoria}
                                </TableCell>
                                <TableCell>{categoria.nombre}</TableCell>
                                <TableCell>{categoria.descripcion || 'Sin descripción'}</TableCell>
                                <TableCell align="center">
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <IconButton
                                            onClick={() => AbrirModalEditar(categoria)}
                                            color="primary"
                                            aria-label="editar"
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => EliminarCategoriaFn(categoria.id_categoria)}
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
                    {modoEdicion ? 'Editar Categoría' : 'Crear nueva Categoría'}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
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
                        <TextField
                            label="Descripción"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={CambioEntrada}
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} color="error" variant="outlined">
                        Cerrar
                    </Button>
                    <Button
                        onClick={CrearCategoria}
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

export default Categoria
