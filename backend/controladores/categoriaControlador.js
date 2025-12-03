import { obtTodo, inserta, obtienePorId, actualiza, elimina} from "../modelos/categoriaModelos.js";


// MUESTRA LOS PRODUCTOS
export const muestraCategoria=async(req, res)=>{
    try{
        const resultado=await obtTodo();
        res.json(resultado);
    }catch (error){
        res.status(500).json({error:error.message});
    }
}


// INSERTAR CATEGORIA
export const insertaCategoria=async(req, res)=>{
    try{
        const resultado=await inserta(req.body);
        res.status(201).json(resultado);
    }catch (error){
        res.status(500).json({error:error.message});
    } 
};


// BUSCA CATEGORIA POR ID
export const muestraCategoriaPorId = async(req, res) => {
  try {
    const resultado = await obtienePorId(req.params.id_categoria);
    if(resultado){
      res.json(resultado);
    } else {
      res.status(404).json({error: 'Categoria no encontrado'});
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};



// ACTUALIZA CATEGORIA (ALGUN ATRIBUTO)
export const actualizaCategoria = async(req, res) => {
  try {
    const resultado = await actualiza(req.params.id_categoria, req.body);
    res.json(resultado);
  }
  catch(error) {
    res.status(500).json({error: error.message});
  }
};



// ELIMINA CATEGORIA
export const eliminaCategoria= async(req, res) => {
  try {
    await elimina(req.params.id_categoria);
    res.json({message: 'Categoria eliminado correctamente'});
  }
  catch(error) {
    res.status(500).json({error: error.message});
  }
};