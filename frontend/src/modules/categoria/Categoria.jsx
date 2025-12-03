import { useEffect, useState } from "react"
import { ObtenerCategorias, EnviarCategoria, EliminarCategoria, ActualizarCategoria } from '../../services/categoria.service'
import { Pencil, Trash } from 'lucide-react';
import Swal from 'sweetalert2'

/*

CREATE TABLE CATEGORIA (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200)
);


*/

const Categoria = () => {
    const [categorias, SetCategorias] = useState([]);
    const [Abrir, SetAbrir] = useState(false);
    const [formData, SetformData] = useState({
        nombre: '',
        descripcion: ''
    })
    const [modoEdicion, SetModoEdicion] = useState(false)
    const [categoriaEditada, SetCategoriaEditada] = useState(null);

    const CambioEntrada = (e) => {
        const { name, value } = e.target;
        SetformData({
            ...formData,
            [name]: value
        })
    }

    useEffect(() => {
        const cargarCategorias = async () => {
            const resultado = await ObtenerCategorias();
            SetCategorias(resultado);
        }
        cargarCategorias();
    }, [])

    const CrearCategoria = async (e) => {
        e.preventDefault();
        try {
            if (modoEdicion) {
                await ActualizarCategoria(categoriaEditada, {
                    nombre: formData.nombre,
                    descripcion: formData.descripcion
                })
                const resultado = await ObtenerCategorias();
                SetCategorias(resultado);
                SetAbrir(false)
                SetModoEdicion(false);
                SetCategoriaEditada(null);
                SetformData({
                    nombre: '',
                    descripcion: ''
                })
                Swal.fire({
                    title: "¡Actualizado Correctamente!",
                    icon: "success",
                    draggable: true,
                    timer: 4000,
                    showCancelButton: false
                });
            } else {
                if (formData.nombre === '') {
                    return Swal.fire({
                        title: "¡El nombre es obligatorio!",
                        icon: "error",
                        draggable: true,
                        timer: 4000,
                        showCancelButton: false
                    });
                }
                await EnviarCategoria({
                    nombre: formData.nombre,
                    descripcion: formData.descripcion
                })
                const resultado = await ObtenerCategorias();
                SetCategorias(resultado);
                SetformData({
                    nombre: '',
                    descripcion: ''
                })
                SetAbrir(false);
                Swal.fire({
                    title: "¡Se creó exitosamente!",
                    icon: "success",
                    draggable: true,
                    timer: 4000
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const AbrirModalEditar = (categoria) => {
        SetModoEdicion(true)
        SetCategoriaEditada(categoria.id_categoria)
        SetformData({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion || ''
        })
        SetAbrir(true);
    }

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
                        draggable: true,
                        timer: 4000,
                        showCancelButton: false
                    });
                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        title: "Error al eliminar",
                        text: error.response?.data?.error || "No se puede eliminar la categoría",
                        icon: "error",
                        draggable: true,
                        timer: 4000,
                        showCancelButton: false
                    });
                }
            }
        });
    }

    return (
        <div className="">
            <div className="flex justify-end">
                <button onClick={() => SetAbrir(true)} className="border p-2 border-gray-300 rounded-xl hover:bg-[#2C7873] hover:text-white hover:border-[#2C7873] mb-4">Crear Categoría</button>
            </div>
            <div className="border border-gray-300 rounded-2xl p-4 shadow-2xl shadow-gray-300">
                <table className="table-auto w-full border-separate border-spacing-x-5">
                    <thead>
                        <tr>
                            <th className="bg-gray-300 py-3 border-gray-400 rounded-xl font-mono">id</th>
                            <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">nombre</th>
                            <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">descripción</th>
                            <th className="bg-gray-300 rounded-xl font-mono">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            categorias.map((categoria) => (
                                <tr key={categoria.id_categoria}>
                                    <td className="font-mono text-center py-2">{categoria.id_categoria}</td>
                                    <td className="font-mono text-center">{categoria.nombre}</td>
                                    <td className="font-mono text-center">{categoria.descripcion || 'Sin descripción'}</td>
                                    <td className="flex justify-center gap-2 items-center py-2">
                                        <Pencil onClick={() => AbrirModalEditar(categoria)} className="hover:text-green-500 cursor-pointer" size={20} />
                                        <Trash onClick={() => EliminarCategoriaFn(categoria.id_categoria)} className="hover:text-red-700 cursor-pointer" size={20} />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            {
                Abrir && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-amber-50 w-96 rounded-2xl">
                            {
                                modoEdicion ? (
                                    <div className="w-full rounded-t-2xl bg-[#2C7873] py-4 text-white">
                                        <h3 className="text-center font-mono">Editar Categoría</h3>
                                    </div>
                                ) : (
                                    <div className="w-full rounded-t-2xl bg-[#2C7873] py-4 text-white">
                                        <h3 className="text-center font-mono">Crear nueva Categoría</h3>
                                    </div>
                                )
                            }
                            <div className="px-10 mt-6 pb-6">
                                <form className="flex flex-col gap-3">
                                    <label className="font-mono">Nombre:</label>
                                    <input
                                        type="text"
                                        onChange={CambioEntrada}
                                        name="nombre"
                                        value={formData.nombre}
                                        className="border border-gray-400 rounded-2xl outline-none pl-2 py-1"
                                    />

                                    <label className="font-mono">Descripción:</label>
                                    <textarea
                                        onChange={CambioEntrada}
                                        name="descripcion"
                                        value={formData.descripcion}
                                        rows="3"
                                        className="border border-gray-400 rounded-2xl outline-none pl-2 py-1 resize-none"
                                    />
                                </form>
                                <div className="flex justify-end gap-4 mt-6">
                                    {modoEdicion ? (
                                        <button onClick={CrearCategoria} className="border px-4 py-1 rounded-2xl hover:bg-[#2C7873] hover:border-[#2C7873] hover:text-white">Editar</button>
                                    ) : (
                                        <button onClick={CrearCategoria} className="border px-4 py-1 rounded-2xl hover:bg-[#2C7873] hover:border-[#2C7873] hover:text-white">Crear</button>
                                    )}
                                    <button onClick={() => SetAbrir(false)} className="border px-4 py-1 rounded-2xl hover:bg-red-600 hover:border-red-600 hover:text-white">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Categoria
