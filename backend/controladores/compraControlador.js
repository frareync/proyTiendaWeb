import { obtTodo, inserta, obtienePorId, actualiza, elimina, obtienePorFecha } from "../modelos/compraModelos.js";


// MUESTRA LAS COMPRAS
export const muestraCompra = async (req, res) => {
  try {
    const resultado = await obtTodo();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


// INSERTAR COMPRA
export const insertaCompra = async (req, res) => {
  try {
    const { id_producto, id_cliente, id_vendedor, cantidad } = req.body;

    // --- VALIDACION DEL BACKEND ---
    if (!id_producto) {
      return res.status(400).json({ error: "El producto es obligatorio" });
    }
    if (!id_cliente) {
      return res.status(400).json({ error: "El cliente es obligatorio" });
    }
    if (!id_vendedor) {
      return res.status(400).json({ error: "El vendedor es obligatorio" });
    }
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
    }
    // --- FIN VALIDACION ---

    const resultado = await inserta(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// BUSCA COMPRA POR ID
export const muestraCompraPorId = async (req, res) => {
  try {
    const resultado = await obtienePorId(req.params.id_compra);
    if (resultado) {
      res.json(resultado);
    } else {
      res.status(404).json({ error: 'Compra no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// BUSCA COMPRAS POR FECHA (Para Reportes)
export const muestraCompraPorFecha = async (req, res) => {
  try {
    const { fecha } = req.params; // La fecha viene en la URL
    // Validamos que sea una fecha válida (básico)
    if (!fecha) {
      return res.status(400).json({ error: "La fecha es obligatoria" });
    }

    // Importamos la nueva función del modelo (asegúrate de importarla arriba)
    const { obtienePorFecha } = await import("../modelos/compraModelos.js");

    const resultado = await obtienePorFecha(fecha);
    res.json(resultado);

  } catch (error) {
    console.error("Error al buscar por fecha:", error);
    res.status(500).json({ error: "Error al obtener reporte por fecha" });
  }
};


// ACTUALIZA COMPRA (ALGUN ATRIBUTO)
export const actualizaCompra = async (req, res) => {
  try {
    const { cantidad } = req.body;

    // --- VALIDACION ACTUALIZACION ---
    if (cantidad !== undefined && cantidad <= 0) {
      return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
    }
    // --- FIN VALIDACION ---

    const resultado = await actualiza(req.params.id_compra, req.body);
    res.json(resultado);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ELIMINA COMPRA
export const eliminaCompra = async (req, res) => {
  try {
    await elimina(req.params.id_compra);
    res.json({ message: 'Compra eliminada correctamente' });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
