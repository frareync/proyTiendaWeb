import {obtVendedor, inserta, obtienePorId, actualiza, elimina} from '../modelos/vendedorModelos.js';

// MUESTRA LOS CLIENTES
export const muestraVendedor=async(req, res)=>{
    try{
        const resultado=await obtVendedor();
        res.json(resultado);
    }catch (error){
        res.status(500).json({error:error.message});
    }
}


// INSERTAR VENDEDOR
export const insertaVendedor=async(req, res)=>{
    try{
        const resultado=await inserta(req.body);
        res.status(201).json(resultado);
    }catch (error){
        res.status(500).json({error:error.message});
    } 
};


// BUSCA PRODUCTOS POR ID
export const muestraVendedorPorId = async(req, res) => {
  try {
    const resultado = await obtienePorId(req.params.id_vendedor);
    if(resultado){
      res.json(resultado);
    } else {
      res.status(404).json({error: 'Vendedor no encontrado'});
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};


// ACTUALIZA VENDEDOR (ALGUN ATRIBUTO)
export const actualizaVendedor = async(req, res) => {
  try {
    const resultado = await actualiza(req.params.id_vendedor, req.body);
    res.json(resultado);
  }
  catch(error) {
    res.status(500).json({error: error.message});
  }
};


// ELIMINA VENDEDOR
export const eliminaVendedor= async(req, res) => {
  try {
    await elimina(req.params.id_vendedor);
    res.json({message: 'Vendedor eliminado correctamente'});
    if (isNaN(id_vendedor)) {
      return res.status(400).json({ error: 'ID de vendedor inválido' });
    }
  }
  catch(error) {
    res.status(500).json({error: error.message});
  }
};



