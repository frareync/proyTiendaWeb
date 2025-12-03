import axios from "axios";

const URL = 'http://localhost:3001/categorias';

export const ObtenerCategorias = async () => {
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const EnviarCategoria = async (categoria) => {
  try {
    const response = await axios.post(URL, categoria);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const ActualizarCategoria = async (id, categoria) => {
  try {
    const response = await axios.put(`${URL}/${id}`, categoria);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const EliminarCategoria = async (id) => {
  try {
    const response = await axios.delete(`${URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
