import { obtTodo, inserta, obtienePorId, actualiza, elimina} from "../modelos/proveedorModelos.js";


// MUESTRA LOS PRODUCTOS
export const muestraProveedor=async(req, res)=>{
    try{
        const resultado=await obtTodo();
        res.json(resultado);
    }catch (error){
        res.status(500).json({error:error.message});
    }
}


// INSERTAR PROVEEDORES
export const insertaProveedor=async(req, res)=>{
    try{
        const resultado=await inserta(req.body);
        res.status(201).json(resultado);
    }catch (error){
        res.status(500).json({error:error.message});
    } 
};


// BUSCA PROVEEDOR POR ID
export const muestraProveedorPorId = async(req, res) => {
  try {
    const resultado = await obtienePorId(req.params.id_proveedor);
    if(resultado){
      res.json(resultado);
    } else {
      res.status(404).json({error: 'Proveedor no encontrado'});
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};




// ACTUALIZA PROVEEDOR (ALGUN ATRIBUTO)
export const actualizaProveedor = async(req, res) => {
  try {
    const resultado = await actualiza(req.params.id_proveedor, req.body);
    res.json(resultado);
  }
  catch(error) {
    res.status(500).json({error: error.message});
  }
};


// ELIMINA PROVEEDORES
export const eliminaProveedor= async(req, res) => {
  try {
    await elimina(req.params.id_proveedor);
    res.json({message: 'Proveedor eliminado correctamente'});
  }
  catch(error) {
    res.status(500).json({error: error.message});
  }
};


