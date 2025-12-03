import { useEffect, useState } from "react"
import {ObtenerProductos,EnviarProducto,EliminarProducto,ActualizarProducto} from '../../services/producto.service'
import {ObtenerCategorias} from '../../services/categoria.service'
import { Pencil,Trash  } from 'lucide-react';
import Swal from 'sweetalert2'

const store=()=>{
    const [productos,SetProductos]=useState([]);
    const [categorias,SetCategorias]=useState([]);
    const [Abrir,SetAbrir]=useState(false);
    const [formData,SetformData]=useState({
        nombre:'',
        precio:'',
        categoria_id:'',
        stock:0
    })
    const [modoEdicion,SetModoEdicion]=useState(false)
    const [productoEditado,SetProductoEditado]=useState(null);

    const CambioEntrada=(e)=>{
        const {name,value}=e.target;
        SetformData({
            ...formData,
            [name]:value
        })
    }

    useEffect(()=>{
        const cargarDatos= async()=>{
            const resultadoProductos = await ObtenerProductos();
            SetProductos(resultadoProductos);
            
            const resultadoCategorias = await ObtenerCategorias();
            SetCategorias(resultadoCategorias);
        }
        cargarDatos();
    },[])

    const CrearProducto=async(e)=>{
        e.preventDefault();
        try{
            if(modoEdicion){
                await ActualizarProducto(productoEditado,{
                    nombre:formData.nombre,
                    precio:formData.precio,
                    categoria_id:formData.categoria_id,
                    stock:formData.stock
                })
                const resultado = await ObtenerProductos();
                SetProductos(resultado);
                SetAbrir(false)
                SetModoEdicion(false);
                SetProductoEditado(null);
                SetformData({
                    nombre:'',
                    precio:'',
                    categoria_id:'',
                    stock:0
                })
                Swal.fire({
                    title: "¡Actualizado Correctamente!",
                    icon: "success",
                    draggable: true,
                    timer:4000,
                    showCancelButton:false
                });
            }else{
                if(formData.nombre==='' || formData.precio===''){
                    return Swal.fire({
                        title: "¡No se aceptan campos vacíos!",
                        icon: "error",
                        draggable: true,
                        timer:4000,
                        showCancelButton:false
                    });
                }
                await EnviarProducto({
                    nombre:formData.nombre,
                    precio:formData.precio,
                    categoria_id:formData.categoria_id || null,
                    stock:formData.stock || 0
                })
                const resultado = await ObtenerProductos();
                SetProductos(resultado);
                SetformData({
                    nombre:'',
                    precio:'',
                    categoria_id:'',
                    stock:0
                })
                SetAbrir(false);
                Swal.fire({
                    title: "¡Se creó exitosamente!",
                    icon: "success",
                    draggable: true,
                    timer:4000
                });
            }
        }catch(error){
            console.log(error)
        }
    }

    const AbrirModalEditar =(producto)=>{
        SetModoEdicion(true)
        SetProductoEditado(producto.id)
        SetformData({
            nombre:producto.nombre,
            precio:producto.precio,
            categoria_id:producto.categoria_id || '',
            stock:producto.stock || 0
        })
        SetAbrir(true);
    }

    const EliminarProductos=async(id)=>{
        Swal.fire({
            title: "¿Estás seguro de eliminar este producto?",
            text: "No podrás revertir los cambios",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, Eliminar"
        }).then(async(result) => {
            if (result.isConfirmed) {
               try{
                 await EliminarProducto(id);
                 const resultado = await ObtenerProductos();
                 SetProductos(resultado);
                 Swal.fire({
                    title: "¡Se eliminó exitosamente!",
                    icon: "success",
                    draggable: true,
                    timer:4000,
                    showCancelButton:false
                });
               }catch(error){
                 console.log(error);
               }
            }
        });
    }
    
    return(
        <div className="">
            <div className="flex justify-end">
                <button onClick={()=>SetAbrir(true)} className="border p-2 border-gray-300 rounded-xl hover:bg-[#2C7873] hover:text-white hover:border-[#2C7873] mb-4">Crear Producto</button>
            </div>
            <div className="border border-gray-300 rounded-2xl p-4 shadow-2xl shadow-gray-300">
                <table className="table-auto w-full border-separate border-spacing-x-5">
                    <thead>
                        <tr>
                            <th className="bg-gray-300 py-3 border-gray-400 rounded-xl font-mono">id</th>
                            <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">nombre</th>
                            <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">precio</th>
                            <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">categoría</th>
                            <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">stock</th>
                            <th className="bg-gray-300 rounded-xl font-mono">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                         productos.map((producto)=>(
                            <tr key={producto.id}>
                                <td className="font-mono text-center py-2">{producto.id}</td>
                                <td className="font-mono text-center">{producto.nombre}</td>
                                <td className="font-mono text-center">{producto.precio} Bs</td>
                                <td className="font-mono text-center">{producto.categoria_nombre || 'Sin categoría'}</td>
                                <td className="font-mono text-center">{producto.stock}</td>
                                <td className="flex justify-center gap-2 items-center py-2">
                                    <Pencil onClick={()=>AbrirModalEditar(producto)} className="hover:text-green-500 cursor-pointer" size={20} />
                                    <Trash onClick={()=>EliminarProductos(producto.id)} className="hover:text-red-700 cursor-pointer" size={20}/>
                                </td>
                            </tr>
                         ))   
                        }
                    </tbody>
                </table>
            </div>
            {
                Abrir &&(
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-amber-50 w-96 rounded-2xl">
                            {
                                modoEdicion?(
                                    <div className="w-full rounded-t-2xl bg-[#2C7873] py-4 text-white">
                                        <h3 className="text-center font-mono">Editar Producto</h3>
                                    </div>
                                ):(
                                    <div className="w-full rounded-t-2xl bg-[#2C7873] py-4 text-white">
                                        <h3 className="text-center font-mono">Crear nuevo Producto</h3>
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
                                    
                                    <label className="font-mono">Precio:</label>
                                    <input 
                                        type="number" 
                                        onChange={CambioEntrada} 
                                        name="precio" 
                                        value={formData.precio} 
                                        className="border border-gray-400 rounded-2xl outline-none pl-2 py-1"
                                    />
                                    
                                    <label className="font-mono">Categoría:</label>
                                    <select 
                                        onChange={CambioEntrada} 
                                        name="categoria_id" 
                                        value={formData.categoria_id}
                                        className="border border-gray-400 rounded-2xl outline-none pl-2 py-1"
                                    >
                                        <option value="">Seleccione una categoría</option>
                                        {categorias.map((cat)=>(
                                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                        ))}
                                    </select>
                                    
                                    <label className="font-mono">Stock:</label>
                                    <input 
                                        type="number" 
                                        onChange={CambioEntrada} 
                                        name="stock" 
                                        value={formData.stock} 
                                        className="border border-gray-400 rounded-2xl outline-none pl-2 py-1"
                                    />
                                </form>
                                <div className="flex justify-end gap-4 mt-6">
                                    {modoEdicion?(
                                        <button onClick={CrearProducto} className="border px-4 py-1 rounded-2xl hover:bg-[#2C7873] hover:border-[#2C7873] hover:text-white">Editar</button>
                                    ):(
                                        <button onClick={CrearProducto} className="border px-4 py-1 rounded-2xl hover:bg-[#2C7873] hover:border-[#2C7873] hover:text-white">Crear</button>
                                    )}
                                    <button onClick={()=>SetAbrir(false)} className="border px-4 py-1 rounded-2xl hover:bg-red-600 hover:border-red-600 hover:text-white">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default store