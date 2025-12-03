import { obtTodo, inserta, obtienePorId, actualiza, elimina} from "../modelos/proveeModelos.js";


// MUESTRA PROVEE
export const muestraProvee=async(req, res)=>{
    try{
        const resultado=await obtTodo();
        res.json(resultado);
    }catch (error){
        res.status(500).json({error:error.message});
    }
}


// INSERTAR PROVEE
export const insertaProvee=async(req, res)=>{
    try{
        const resultado=await inserta(req.body);
        res.status(201).json(resultado);
    }catch (error){
        res.status(500).json({error:error.message});
    } 
};


// BUSCA PRODUCTOS POR ID
export const muestraProveePorId = async(req, res) => {
    try {
        const resultado = await obtienePorId(req.params.id_provee);

        if(resultado){
        res.json(resultado);
        } else {
        res.status(404).json({error: 'Provee no encontrado'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


// ACTUALIZA PROVEE (ALGUN ATRIBUTO)
export const actualizaProvee = async(req, res) => {
    try {
        const resultado = await actualiza(req.params.id_provee, req.body);
        res.json(resultado);
    }
    catch(error) {
        res.status(500).json({error: error.message});
    }
};


// ELIMINA PRODUCTOS
export const eliminaProvee= async(req, res) => {
    try {
        await elimina(req.params.id_provee);
        res.json({message: 'Provee eliminado correctamente'});
    }
    catch(error) {
        res.status(500).json({error: error.message});
    }
};