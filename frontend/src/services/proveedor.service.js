import axios from 'axios'

export const ObtenerProveedores = async () => {
  const resultado = await axios.get('http://localhost:3001/proveedor')
  return resultado.data;
}

export const EnviarProveedor = async (proveedor) => {
  const resultado = await axios.post('http://localhost:3001/proveedor', proveedor)
  return resultado.data;
}
export const ActualizarProveedor = async (id, proveedor) => {
  const resultado = await axios.put(`http://localhost:3001/proveedor/${id}`, proveedor)
  return resultado.data;
}
export const EliminarProveedor = async (id) => {
  const resultado = await axios.delete(`http://localhost:3001/proveedor/${id}`)
  return resultado.data
}

