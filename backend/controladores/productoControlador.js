import { obtTodo, inserta, obtienePorId, actualiza, elimina } from "../modelos/productoModelos.js";


// MUESTRA LOS PRODUCTOS
export const muestraProducto = async (req, res) => {
  try {
    const resultado = await obtTodo();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// INSERTAR PRODUCTOS
export const insertaProducto = async (req, res) => {
  try {
    const { nombre, precio, stock, id_categoria } = req.body;

    // --- VALIDACION BACKEND ---
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }
    if (!precio || precio < 0) {
      return res.status(400).json({ error: "El precio es obligatorio y debe ser positivo" });
    }
    if (stock === undefined || stock < 0) {
      return res.status(400).json({ error: "El stock es obligatorio y no puede ser negativo" });
    }
    if (!id_categoria) {
      return res.status(400).json({ error: "Debe seleccionar una categoría" });
    }
    // --- FIN VALIDACION ---

    const resultado = await inserta(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// BUSCA PRODUCTOS POR ID
export const muestraProductoPorId = async (req, res) => {
  try {
    const resultado = await obtienePorId(req.params.id_producto);
    if (resultado) {
      res.json(resultado);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ACTUALIZA PRODUCTOS (ALGUN ATRIBUTO)
export const actualizaProducto = async (req, res) => {
  try {
    const { nombre, precio, stock, id_categoria } = req.body;

    // --- VALIDACION ACTUALIZACION ---
    if (nombre !== undefined && nombre.trim() === '') {
      return res.status(400).json({ error: "El nombre no puede estar vacío" });
    }
    if (precio !== undefined && precio < 0) {
      return res.status(400).json({ error: "El precio debe ser positivo" });
    }
    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ error: "El stock no puede ser negativo" });
    }
    // --- FIN VALIDACION ---

    const resultado = await actualiza(req.params.id_producto, req.body);
    res.json(resultado);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ELIMINA PRODUCTOS
export const eliminaProducto = async (req, res) => {
  try {
    await elimina(req.params.id_producto);
    res.json({ message: 'Producto eliminado correctamente' });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
