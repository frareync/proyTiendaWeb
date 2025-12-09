import { obtTodo, inserta, obtienePorId, actualiza, elimina } from "../modelos/proveeModelos.js";


// MUESTRA PROVEE
export const muestraProvee = async (req, res) => {
    try {
        const resultado = await obtTodo();
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// INSERTAR PROVEE (ABASTECIMIENTO)
export const insertaProvee = async (req, res) => {
    try {
        const { id_producto, id_proveedor, fechaIngreso, cantidad } = req.body;

        // --- VALIDACION BACKEND ---
        if (!id_producto) {
            return res.status(400).json({ error: "El producto es obligatorio" });
        }
        if (!id_proveedor) {
            return res.status(400).json({ error: "El proveedor es obligatorio" });
        }
        if (!fechaIngreso) {
            return res.status(400).json({ error: "La fecha de ingreso es obligatoria" });
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


// BUSCA PROVEE POR ID
export const muestraProveePorId = async (req, res) => {
    try {
        const resultado = await obtienePorId(req.params.id_provee);

        if (resultado) {
            res.json(resultado);
        } else {
            res.status(404).json({ error: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ACTUALIZA PROVEE (ALGUN ATRIBUTO)
export const actualizaProvee = async (req, res) => {
    try {
        const { cantidad } = req.body;

        // --- VALIDACION ACTUALIZACION ---
        if (cantidad !== undefined && cantidad <= 0) {
            return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
        }
        // --- FIN VALIDACION ---

        const resultado = await actualiza(req.params.id_provee, req.body);
        res.json(resultado);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ELIMINA REGISTRO PROVEE
export const eliminaProvee = async (req, res) => {
    try {
        await elimina(req.params.id_provee);
        res.json({ message: 'Registro eliminado correctamente' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
