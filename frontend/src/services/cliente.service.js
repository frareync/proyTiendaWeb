import axios from 'axios'

export const ObtenerClientes = async () => {
  const resultado = await axios.get('http://localhost:3001/cliente')
  return resultado.data;
}

export const EnviarCliente = async (cliente) => {
  const resultado = await axios.post('http://localhost:3001/cliente', cliente)
  return resultado.data;
}
export const ActualizarCliente = async (id, cliente) => {
  const resultado = await axios.put(`http://localhost:3001/cliente/${id}`, cliente)
  return resultado.data;
}
export const EliminarCliente = async (id) => {
  const resultado = await axios.delete(`http://localhost:3001/cliente/${id}`)
  return resultado.data
}

