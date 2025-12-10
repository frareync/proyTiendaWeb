/*
 * Script de inicialización (semilla) para la base de datos.
 * Este script se encarga de crear un usuario administrador por defecto
 * y un usuario vendedor de prueba (si hay vendedores registrados).
 */
import { insertarUsuario, buscarPorNombre, eliminarPorIdVendedor } from './modelos/usuarioModelos.js';
import { obtVendedor } from './modelos/vendedorModelos.js';
import bcrypt from 'bcryptjs';

const run = async () => {
  try {
    // --- CREACIÓN DE USUARIO ADMINISTRADOR ---
    const adminExiste = await buscarPorNombre('admin');
    if (adminExiste) {
      console.log('El usuario admin ya existe');
    } else {
      console.log('Creando usuario admin...');
      const passAdmin = await bcrypt.hash('admin123', 10);
      await insertarUsuario({
        usuario: 'admin',
        contrasenia: passAdmin,
        rol: 'ADMIN',
        id_vendedor: null // Admin no está vinculado a ningún vendedor
      });
      console.log('Usuario admin creado exitosamente. Usuario: admin, Password: admin123');
    }

    // --- LOGICA VENDEDOR GENERAL -----
    // Buscar si existen vendedores reales
    const vendedores = await obtVendedor();

    // FILTRAR: No queremos usar el vendedor de Felix (CI 2776655) para el usuario de prueba 'vendedor1'
    // Así reservamos a Felix para su propio usuario 'adminFelix'
    const vendedoresDisponibles = vendedores.filter(v => v.ci !== '2776655');

    // --- CREACIÓN DE USUARIO VENDEDOR (PRUEBA) ---
    const vendedorUserExiste = await buscarPorNombre('vendedor1');
    if (vendedorUserExiste) {
      console.log('El usuario vendedor1 ya existe');
    } else {
      if (vendedoresDisponibles && vendedoresDisponibles.length > 0) {
        console.log('Creando usuario vendedor1...');
        const primerVendedor = vendedoresDisponibles[0]; // Usamos el primer disponible (que NO sea Felix)
        const passVendedor = await bcrypt.hash('vendedor123', 10);

        try {
          // Asegurarnos que ese vendedor no tenga usuario ya
          await eliminarPorIdVendedor(primerVendedor.id_vendedor);

          await insertarUsuario({
            usuario: 'vendedor1',
            contrasenia: passVendedor,
            rol: 'VENDEDOR',
            id_vendedor: primerVendedor.id_vendedor
          });
          console.log(`Usuario vendedor1 creado exitosamente. Vinculado al vendedor ID: ${primerVendedor.id_vendedor}.`);
        } catch (error) {
          console.log(`Nota: No se pudo crear usuario vendedor1: ${error.message}`);
        }
      } else {
        console.log('No se creó usuario vendedor1 (No hay vendedores disponibles aparte de Felix).');
      }
    }

    // --- REQUERIMIENTO: HACER QUE EL VENDEDOR CON CI 2776655 SEA ADMINISTRADOR ---
    const usuarioFelixExiste = await buscarPorNombre('adminFelix');

    if (usuarioFelixExiste) {
      console.log('El usuario "adminFelix" ya existe en el sistema.');
    } else {
      // Buscamos específicamente al que tenga el CI '2776655' en la lista completa
      const vendedorFelix = vendedores.find(vendedor => vendedor.ci === '2776655');

      if (vendedorFelix) {
        console.log('Encontrado vendedor con CI 2776655. Preparando creación...');

        // PROBLEMA DE "DUPLICATE ENTRY": Si ya existe un usuario vinculado a este vendedor
        // (por ejemplo, si 'vendedor1' lo tomó por error antes), lo eliminamos para liberar el puesto.
        console.log(`Limpiando cualquier usuario anterior vinculado al vendedor ID ${vendedorFelix.id_vendedor}...`);
        await eliminarPorIdVendedor(vendedorFelix.id_vendedor);

        // Creamos una contraseña segura (hash)
        const passwordFelix = await bcrypt.hash('felix123', 10);

        try {
          await insertarUsuario({
            usuario: 'adminFelix',
            contrasenia: passwordFelix,
            rol: 'ADMIN',
            id_vendedor: vendedorFelix.id_vendedor
          });

          console.log('¡Éxito! Usuario "adminFelix" creado con permisos de Administrador.');
        } catch (error) {
          console.log('Hubo un error al intentar crear el usuario de Felix:', error.message);
        }

      } else {
        console.log('Advertencia: No se encontró ningún vendedor con CI 2776655.');
      }
    }

  } catch (e) {
    console.error('Error general al ejecutar semilla:', e);
  }
  process.exit(0);
};

run();
