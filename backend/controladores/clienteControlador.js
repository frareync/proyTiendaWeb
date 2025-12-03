import { obtCliente, inserta, obtienePorId, actualiza, elimina} from "../modelos/clienteModelos.js";

// MUESTRA LOS CLIENTES
export const muestraCliente=async(req, res)=>{
    try{
        const resultado=await obtCliente();
        res.json(resultado);
    }catch (error){
        res.status(500).json({error:error.message});
    }
}


// INSERTA CLIENTE
export const insertaCliente=async(req, res)=>{
    try{
        const resultado=await inserta(req.body);
        res.status(201).json(resultado);
    }catch (error){
        res.status(500).json({error:error.message});
    } 
};


// BUSCA CLIENTE POR ID
export const muestraClientePorId = async(req, res) => {
  try {
    const resultado = await obtienePorId(req.params.id_cliente);
    if(resultado){
      res.json(resultado);
    } else {
      res.status(404).json({error: 'Producto no encontrado'});
    }
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};


// ACTUALIZA CLIENTE (ALGUN ATRIBUTO)
export const actualizaCliente = async(req, res) => {
  try {
    const resultado = await actualiza(req.params.id_cliente, req.body);
    res.json(resultado);
  }
  catch(error) {
    res.status(500).json({error: error.message});
  }
};


// ELIMINA CLIENTE
export const eliminaCliente= async(req, res) => {
  try {
    await elimina(req.params.id_cliente);
    res.json({message: 'Cliente eliminado correctamente'});
  }
  catch(error) {
    res.status(500).json({error: error.message});
  }
};
