import { useEffect, useState } from "react"
import { ObtenerProveedores, EnviarProveedor, EliminarProveedor, ActualizarProveedor } from '../../services/proveedor.service';
import { Pencil, Trash } from 'lucide-react';
import Swal from 'sweetalert2'


/*
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
  const [proveedores, SetProveedores] = useState([]);
  const [Abrir, SetAbrir] = useState(false);
  const [formData, SetformData] = useState({
    nombre: '',
    paterno: '',
    materno: '',
    telefono: '',
    direccion: '',
    correo: ''
  })
  const [modoEdicion, SetModoEdicion] = useState(false)
  const [proveedorEditado, SetProveedorEditado] = useState(null);

  const CambioEntrada = (e) => {
    const { name, value } = e.target;
    SetformData({
      ...formData,
      [name]: value
    })
  }

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

  const CrearProveedor = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
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
        SetAbrir(false)
        SetModoEdicion(false);
        SetProveedorEditado(null);
        SetformData({
          nombre: '',
          paterno: '',
          materno: '',
          telefono: '',
          direccion: '',
          correo: ''
        })
        Swal.fire({
          title: "¡Actualizado Correctamente!",
          icon: "success",
          draggable: true,
          timer: 4000,
          showCancelButton: false
        });
      } else {
        if (formData.nombre.trim() === '') {
          return Swal.fire({
            title: "¡El nombre es obligatorio!",
            icon: "error",
            draggable: true,
            timer: 4000,
            showCancelButton: false
          });
        }
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
        SetformData({
          nombre: '',
          paterno: '',
          materno: '',
          telefono: '',
          direccion: '',
          correo: ''
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
    SetAbrir(true);
  }

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
            draggable: true,
            timer: 4000,
            showCancelButton: false
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: "Error al eliminar",
            text: error.response?.data?.error || "No se puede eliminar el proveedor",
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
        <button onClick={() => SetAbrir(true)} className="border p-2 border-gray-300 rounded-xl hover:bg-[#2C7873] hover:text-white hover:border-[#2C7873] mb-4">Crear Proveedor</button>
      </div>
      <div className="border border-gray-300 rounded-2xl p-4 shadow-2xl shadow-gray-300">
        <table className="table-auto w-full border-separate border-spacing-x-5">
          <thead>
            <tr>
              <th className="bg-gray-300 py-3 border-gray-400 rounded-xl font-mono">id</th>
              <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">nombre</th>
              <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">paterno</th>
              <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">materno</th>
              <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">telefono</th>
              <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">direccion</th>
              <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">correo</th>
              <th className="bg-gray-300 rounded-xl font-mono">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              proveedores.map((proveedor) => (
                <tr key={proveedor.id_proveedor}>
                  <td className="font-mono text-center py-2">{proveedor.id_proveedor}</td>
                  <td className="font-mono text-center">{proveedor.nombre}</td>
                  <td className="font-mono text-center">{proveedor.paterno}</td>
                  <td className="font-mono text-center">{proveedor.materno}</td>
                  <td className="font-mono text-center">{proveedor.telefono}</td>
                  <td className="font-mono text-center">{proveedor.direccion}</td>
                  <td className="font-mono text-center">{proveedor.correo}</td>
                  <td className="flex justify-center gap-2 items-center py-2">
                    <Pencil onClick={() => AbrirModalEditar(proveedor)} className="hover:text-green-500 cursor-pointer" size={20} />
                    <Trash onClick={() => EliminarProveedorFn(proveedor.id_proveedor)} className="hover:text-red-700 cursor-pointer" size={20} />
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
                    <h3 className="text-center font-mono">Editar Proveedor</h3>
                  </div>
                ) : (
                  <div className="w-full rounded-t-2xl bg-[#2C7873] py-4 text-white">
                    <h3 className="text-center font-mono">Crear nuevo Proveedor</h3>
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

                  <label className="font-mono">Paterno:</label>
                  <input
                    type="text"
                    onChange={CambioEntrada}
                    name="paterno"
                    value={formData.paterno}
                    className="border border-gray-400 rounded-2xl outline-none pl-2 py-1"
                  />

                  <label className="font-mono">Materno:</label>
                  <input
                    type="text"
                    onChange={CambioEntrada}
                    name="materno"
                    value={formData.materno}
                    className="border border-gray-400 rounded-2xl outline-none pl-2 py-1"
                  />

                  <label className="font-mono">Telefono:</label>
                  <input
                    type="text"
                    onChange={CambioEntrada}
                    name="telefono"
                    value={formData.telefono}
                    className="border border-gray-400 rounded-2xl outline-none pl-2 py-1"
                  />

                  <label className="font-mono">Direccion:</label>
                  <input
                    type="text"
                    onChange={CambioEntrada}
                    name="direccion"
                    value={formData.direccion}
                    className="border border-gray-400 rounded-2xl outline-none pl-2 py-1"
                  />

                  <label className="font-mono">Correo:</label>
                  <input
                    type="text"
                    onChange={CambioEntrada}
                    name="correo"
                    value={formData.correo}
                    className="border border-gray-400 rounded-2xl outline-none pl-2 py-1"
                  />
                </form>
                <div className="flex justify-end gap-4 mt-6">
                  {modoEdicion ? (
                    <button onClick={CrearProveedor} className="border px-4 py-1 rounded-2xl hover:bg-[#2C7873] hover:border-[#2C7873] hover:text-white">Editar</button>
                  ) : (
                    <button onClick={CrearProveedor} className="border px-4 py-1 rounded-2xl hover:bg-[#2C7873] hover:border-[#2C7873] hover:text-white">Crear</button>
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

export default Proveedor
