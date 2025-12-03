import axios from 'axios'

export const ObtenerVendedores = async () => {
  const resultado = await axios.get('http://localhost:3001/vendedor')
  return resultado.data;
}

export const EnviarVendedor = async (vendedor) => {
  const resultado = await axios.post('http://localhost:3001/vendedor', vendedor)
  return resultado.data;
}
export const ActualizarVendedor = async (id, vendedor) => {
  const resultado = await axios.put(`http://localhost:3001/vendedor/${id}`, vendedor)
  return resultado.data;
}
export const EliminarVendedor = async (id) => {
  const resultado = await axios.delete(`http://localhost:3001/vendedor/${id}`)
  return resultado.data
}

