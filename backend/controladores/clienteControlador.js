import { obtCliente, inserta, obtienePorId, actualiza, elimina } from "../modelos/clienteModelos.js";

// MUESTRA LOS CLIENTES
export const muestraCliente = async (req, res) => {
  try {
    const resultado = await obtCliente();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// INSERTA CLIENTE
// FUNCION ASINCRONA PARA INSERTAR UN CLIENTE
export const insertaCliente = async (req, res) => {
  try {
    // Recuperamos los datos que nos envía el frontend desde el cuerpo de la petición (req.body)
    const { nombre } = req.body;

    // --- VALIDACIÓN DE DATOS EN EL BACKEND ---

    // Verificamos si el campo 'nombre' no existe o está vacío
    if (!nombre || nombre.trim() === '') {
      // Si la validación falla, respondemos con un error HTTP 400 (Bad Request)
      // Esto evita que se intente guardar un cliente sin nombre en la base de datos
      return res.status(400).json({
        error: "El nombre es obligatorio (Validación Servidor)"
      });
    }

    // Obtenemos los otros campos para validar
    const { paterno, materno, nacionalidad } = req.body;

    // Validamos Apellido Paterno
    if (!paterno || paterno.trim() === '') {
      return res.status(400).json({ error: "El apellido paterno es obligatorio (Validación Servidor)" });
    }

    if (!materno || materno.trim() === '') {
      return res.status(400).json({ error: "El apellido materno es obligatorio (Validación Servidor)" });
    }

    // Validamos Nacionalidad
    if (!nacionalidad || nacionalidad.trim() === '') {
      return res.status(400).json({ error: "La nacionalidad es obligatoria (Validación Servidor)" });
    }

    // --- FIN VALIDACIÓN ---

    // Si pasa la validación, llamamos al modelo 'inserta' enviando los datos
    const resultado = await inserta(req.body);

    // Respondemos al cliente con un código HTTP 201 (Created/Creado) y el resultado
    res.status(201).json(resultado);
  } catch (error) {
    // Si ocurre un error (ej. base de datos caída), respondemos con código 500
    res.status(500).json({ error: error.message });
  }
};


// BUSCA CLIENTE POR ID
export const muestraClientePorId = async (req, res) => {
  try {
    const resultado = await obtienePorId(req.params.id_cliente);
    if (resultado) {
      res.json(resultado);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ACTUALIZA CLIENTE (ALGUN ATRIBUTO)
export const actualizaCliente = async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const { nombre, paterno, nacionalidad } = req.body;

    // --- VALIDACIÓN DE DATOS (Actualización) ---

    // Si se envía el campo 'nombre', validamos que no esté vacío
    if (nombre !== undefined && nombre.trim() === '') {
      return res.status(400).json({ error: "El nombre no puede estar vacío" });
    }

    // Si se envía 'paterno', validamos que no esté vacío
    if (paterno !== undefined && paterno.trim() === '') {
      return res.status(400).json({ error: "El apellido paterno no puede estar vacío" });
    }

    // Si se envía 'nacionalidad', validamos que no esté vacío
    if (nacionalidad !== undefined && nacionalidad.trim() === '') {
      return res.status(400).json({ error: "La nacionalidad no puede estar vacía" });
    }

    // --- FIN VALIDACIÓN ---

    const resultado = await actualiza(req.params.id_cliente, req.body);
    res.json(resultado);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ELIMINA CLIENTE
export const eliminaCliente = async (req, res) => {
  try {
    await elimina(req.params.id_cliente);
    res.json({ message: 'Cliente eliminado correctamente' });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
