import { useEffect, useState } from "react"
import { ObtenerClientes, EnviarCliente, EliminarCliente, ActualizarCliente } from '../../services/cliente.service';
import { Pencil, Trash } from 'lucide-react';
import Swal from 'sweetalert2'


/*
CREATE TABLE CLIENTE (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    paterno VARCHAR(50),
    materno VARCHAR(50),
    nacionalidad VARCHAR(50)
)
*/
const Cliente = () => {
  const [clientes, SetClientes] = useState([]);
  const [Abrir, SetAbrir] = useState(false);
  const [formData, SetformData] = useState({
    nombre: '',
    paterno: '',
    materno: '',
    nacionalidad: '',
  })
  const [modoEdicion, SetModoEdicion] = useState(false)
  const [clienteEditado, SetClienteEditado] = useState(null);

  const CambioEntrada = (e) => {
    const { name, value } = e.target;
    SetformData({
      ...formData,
      [name]: value
    })
  }

  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const resultado = await ObtenerClientes();
        SetClientes(resultado);
      } catch (error) {
        console.log('Error al cargar clientes:', error);
      }
    }
    cargarClientes();
  }, [])

  const CrearCliente = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await ActualizarCliente(clienteEditado, {
          nombre: formData.nombre,
          paterno: formData.paterno,
          materno: formData.materno,
          nacionalidad: formData.nacionalidad
        })
        const resultado = await ObtenerClientes();
        SetClientes(resultado);
        SetAbrir(false)
        SetModoEdicion(false);
        SetClienteEditado(null);
        SetformData({
          nombre: '',
          paterno: '',
          materno: '',
          nacionalidad: ''
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
        await EnviarCliente({
          nombre: formData.nombre,
          paterno: formData.paterno,
          materno: formData.materno,
          nacionalidad: formData.nacionalidad
        })
        const resultado = await ObtenerClientes();
        SetClientes(resultado);
        SetformData({
          nombre: '',
          paterno: '',
          materno: '',
          nacionalidad: ''
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

  const AbrirModalEditar = (cliente) => {
    SetModoEdicion(true)
    SetClienteEditado(cliente.id_cliente)
    SetformData({

      nombre: cliente.nombre || '',
      paterno: cliente.paterno || '',
      materno: cliente.materno || '',
      nacionalidad: cliente.nacionalidad || ''
    })
    SetAbrir(true);
  }

  const EliminarClienteFn = async (id) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar este cliente?",
      text: "No podrás revertir los cambios",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Eliminar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await EliminarCliente(id);
          const resultado = await ObtenerClientes();
          SetClientes(resultado);
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
            text: error.response?.data?.error || "No se puede eliminar el cliente",
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
        <button onClick={() => SetAbrir(true)} className="border p-2 border-gray-300 rounded-xl hover:bg-[#2C7873] hover:text-white hover:border-[#2C7873] mb-4">Crear Cliente</button>
      </div>
      <div className="border border-gray-300 rounded-2xl p-4 shadow-2xl shadow-gray-300">
        <table className="table-auto w-full border-separate border-spacing-x-5">
          <thead>
            <tr>
              <th className="bg-gray-300 py-3 border-gray-400 rounded-xl font-mono">id</th>
              <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">nombre</th>
              <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">paterno</th>
              <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">materno</th>
              <th className="bg-gray-300 border-gray-400 rounded-xl font-mono">nacionalidad</th>
              <th className="bg-gray-300 rounded-xl font-mono">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              clientes.map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td className="font-mono text-center py-2">{cliente.id_cliente}</td>
                  <td className="font-mono text-center">{cliente.nombre}</td>
                  <td className="font-mono text-center">{cliente.paterno}</td>
                  <td className="font-mono text-center">{cliente.materno}</td>
                  <td className="font-mono text-center">{cliente.nacionalidad}</td>
                  <td className="flex justify-center gap-2 items-center py-2">
                    <Pencil onClick={() => AbrirModalEditar(cliente)} className="hover:text-green-500 cursor-pointer" size={20} />
                    <Trash onClick={() => EliminarClienteFn(cliente.id_cliente)} className="hover:text-red-700 cursor-pointer" size={20} />
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
                    <h3 className="text-center font-mono">Editar Cliente</h3>
                  </div>
                ) : (
                  <div className="w-full rounded-t-2xl bg-[#2C7873] py-4 text-white">
                    <h3 className="text-center font-mono">Crear nuevo Cliente</h3>
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

                  <label className="font-mono">Nacionalidad:</label>
                  <input
                    type="text"
                    onChange={CambioEntrada}
                    name="nacionalidad"
                    value={formData.nacionalidad}
                    className="border border-gray-400 rounded-2xl outline-none pl-2 py-1"
                  />
                </form>
                <div className="flex justify-end gap-4 mt-6">
                  {modoEdicion ? (
                    <button onClick={CrearCliente} className="border px-4 py-1 rounded-2xl hover:bg-[#2C7873] hover:border-[#2C7873] hover:text-white">Editar</button>
                  ) : (
                    <button onClick={CrearCliente} className="border px-4 py-1 rounded-2xl hover:bg-[#2C7873] hover:border-[#2C7873] hover:text-white">Crear</button>
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

export default Cliente
