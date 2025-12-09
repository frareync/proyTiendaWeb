import axios from 'axios'

export const ObtenerProvee = async () => {
  const resultado = await axios.get('http://localhost:3001/provee')
  return resultado.data;
}

export const EnviarProvee = async (provee) => {
  const resultado = await axios.post('http://localhost:3001/provee', provee)
  return resultado.data;
}
export const ActualizarProvee = async (id, provee) => {
  const resultado = await axios.put(`http://localhost:3001/provee/${id}`, provee)
  return resultado.data;
}
export const EliminarProvee = async (id) => {
  const resultado = await axios.delete(`http://localhost:3001/provee/${id}`)
  return resultado.data
}

