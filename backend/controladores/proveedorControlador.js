import { obtTodo, inserta, obtienePorId, actualiza, elimina } from "../modelos/proveedorModelos.js";


// MUESTRA LOS PROVEEDORES
export const muestraProveedor = async (req, res) => {
  try {
    const resultado = await obtTodo();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// INSERTAR PROVEEDOR
export const insertaProveedor = async (req, res) => {
  try {
    // Recuperamos los datos del cuerpo de la petición
    const { nombre, paterno, telefono, direccion, correo } = req.body;

    // --- VALIDACION DEL BACKEND ---
    // Validamos nombre
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: "El nombre es obligatorio (Validación Servidor)" });
    }
    // Validamos apellido paterno
    if (!paterno || paterno.trim() === '') {
      return res.status(400).json({ error: "El apellido paterno es obligatorio (Validación Servidor)" });
    }
    // Validamos teléfono
    if (!telefono || telefono.trim() === '') {
      return res.status(400).json({ error: "El teléfono es obligatorio (Validación Servidor)" });
    }
    // Validamos dirección
    if (!direccion || direccion.trim() === '') {
      return res.status(400).json({ error: "La dirección es obligatoria (Validación Servidor)" });
    }
    // Validamos correo
    if (!correo || correo.trim() === '') {
      return res.status(400).json({ error: "El correo es obligatorio (Validación Servidor)" });
    }
    // --- FIN VALIDACION ---

    const resultado = await inserta(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// BUSCA PROVEEDOR POR ID
export const muestraProveedorPorId = async (req, res) => {
  try {
    const resultado = await obtienePorId(req.params.id_proveedor);
    if (resultado) {
      res.json(resultado);
    } else {
      res.status(404).json({ error: 'Proveedor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ACTUALIZA PROVEEDOR (ALGUN ATRIBUTO)
export const actualizaProveedor = async (req, res) => {
  try {
    const { id_proveedor } = req.params;
    const { nombre, paterno, telefono, direccion, correo } = req.body;

    // --- VALIDACION ACTUALIZACION ---
    // Si se envían estos campos, validamos que no estén vacíos
    if (nombre !== undefined && nombre.trim() === '') {
      return res.status(400).json({ error: "El nombre no puede estar vacío" });
    }
    if (paterno !== undefined && paterno.trim() === '') {
      return res.status(400).json({ error: "El apellido paterno no puede estar vacío" });
    }
    if (telefono !== undefined && telefono.trim() === '') {
      return res.status(400).json({ error: "El teléfono no puede estar vacío" });
    }
    if (direccion !== undefined && direccion.trim() === '') {
      return res.status(400).json({ error: "La dirección no puede estar vacía" });
    }
    if (correo !== undefined && correo.trim() === '') {
      return res.status(400).json({ error: "El correo no puede estar vacío" });
    }
    // --- FIN VALIDACION ---

    const resultado = await actualiza(req.params.id_proveedor, req.body);
    res.json(resultado);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ELIMINA PROVEEDOR
export const eliminaProveedor = async (req, res) => {
  try {
    await elimina(req.params.id_proveedor);
    res.json({ message: 'Proveedor eliminado correctamente' });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
