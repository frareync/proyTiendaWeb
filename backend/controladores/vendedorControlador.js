import { obtVendedor, inserta, obtienePorId, actualiza, elimina } from '../modelos/vendedorModelos.js';

// MUESTRA LOS VENDEDORES
export const muestraVendedor = async (req, res) => {
  try {
    const resultado = await obtVendedor();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// FUNCION ASINCRONA PARA INSERTAR VENDEDOR
export const insertaVendedor = async (req, res) => {
  try {
    // Recuperamos los datos del cuerpo de la petición
    const { nombre, paterno, telefono, direccion } = req.body;

    // --- VALIDACION DEL BACKEND ---
    // Validamos que el nombre no esté vacío
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: "El nombre es obligatorio (Validación Servidor)" });
    }
    // Validamos que el apellido paterno no esté vacío
    if (!paterno || paterno.trim() === '') {
      return res.status(400).json({ error: "El apellido paterno es obligatorio (Validación Servidor)" });
    }
    // Validamos que el teléfono no esté vacío (si es requerido por negocio)
    if (!telefono || telefono.trim() === '') {
      return res.status(400).json({ error: "El teléfono es obligatorio (Validación Servidor)" });
    }
    // Validamos la dirección
    if (!direccion || direccion.trim() === '') {
      return res.status(400).json({ error: "La dirección es obligatoria (Validación Servidor)" });
    }
    // --- FIN VALIDACION ---

    const resultado = await inserta(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// BUSCA VENDEDOR POR ID
export const muestraVendedorPorId = async (req, res) => {
  try {
    const resultado = await obtienePorId(req.params.id_vendedor);
    if (resultado) {
      res.json(resultado);
    } else {
      res.status(404).json({ error: 'Vendedor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ACTUALIZA VENDEDOR (ALGUN ATRIBUTO)
export const actualizaVendedor = async (req, res) => {
  try {
    const { id_vendedor } = req.params;
    const { nombre, paterno, telefono, direccion } = req.body;

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
    // --- FIN VALIDACION ---

    const resultado = await actualiza(req.params.id_vendedor, req.body);
    res.json(resultado);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ELIMINA VENDEDOR
export const eliminaVendedor = async (req, res) => {
  try {
    await elimina(req.params.id_vendedor);
    res.json({ message: 'Vendedor eliminado correctamente' });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
