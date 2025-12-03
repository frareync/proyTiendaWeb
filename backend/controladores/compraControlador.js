import { obtTodo, inserta, obtienePorId, actualiza, elimina} from "../modelos/compraModelos.js";


// MUESTRA LAS COMPRAS
export const muestraCompra=async(req, res)=>{
    try{
        const resultado=await obtTodo();
        res.json(resultado);
    }catch (error){
        res.status(500).json({error:error.message});
    }
}



// INSERTAR COMPRAS
export const insertaCompra=async(req, res)=>{
    try{
        const resultado=await inserta(req.body);
        res.status(201).json(resultado);
    }catch (error){
        res.status(500).json({error:error.message});
    } 
};


// BUSCA COMPRAS POR ID
export const muestraCompraPorId = async(req, res) => {
  try {
    const resultado = await obtienePorId(req.params.id_compra);
    if(resultado){
      res.json(resultado);
    } else {
      res.status(404).json({error: 'Compra no encontrado'});
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};


// ACTUALIZA COMPRAS (ALGUN ATRIBUTO)
export const actualizaCompra = async(req, res) => {
  try {
    const resultado = await actualiza(req.params.id_compra, req.body);
    res.json(resultado);
  }
  catch(error) {
    res.status(500).json({error: error.message});
  }
};



// ELIMINA COMPRAS
export const eliminaCompra= async(req, res) => {
  try {
    await elimina(req.params.id_compra);
    res.json({message: 'Compra eliminada correctamente'});
  }
  catch(error) {
    res.status(500).json({error: error.message});
  }
};
