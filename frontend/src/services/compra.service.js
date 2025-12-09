import axios from 'axios'

export const ObtenerCompras = async () => {
  const resultado = await axios.get('http://localhost:3001/compra')
  return resultado.data;
}

export const EnviarCompra = async (compra) => {
  const resultado = await axios.post('http://localhost:3001/compra', compra)
  return resultado.data;
}
export const ActualizarCompra = async (id, compra) => {
  const resultado = await axios.put(`http://localhost:3001/compra/${id}`, compra)
  return resultado.data;
}
export const EliminarCompra = async (id) => {
  const resultado = await axios.delete(`http://localhost:3001/compra/${id}`)
  return resultado.data
}
