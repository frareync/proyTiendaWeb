import axios from 'axios'

export const ObtenerCategorias = async () => {
    const resultado = await axios.get('http://localhost:3001/categoria')
    return resultado.data;
}

export const EnviarCategoria = async (categoria) => {
    const resultado = await axios.post('http://localhost:3001/categoria', categoria)
    return resultado.data;
}
export const ActualizarCategoria = async (id, categoria) => {
    const resultado = await axios.put(`http://localhost:3001/categoria/${id}`, categoria)
    return resultado.data;
}
export const EliminarCategoria = async (id) => {
    const resultado = await axios.delete(`http://localhost:3001/categoria/${id}`)
    return resultado.data
}

