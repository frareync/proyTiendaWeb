import { insertarUsuario, buscarPorNombre } from './modelos/usuarioModelos.js';
import bcrypt from 'bcryptjs';

const run = async () => {
  try {
    const existe = await buscarPorNombre('admin');
    if (existe) {
      console.log('El usuario admin ya existe');
      process.exit(0);
    }
    const pass = await bcrypt.hash('admin123', 10);
    await insertarUsuario({
      usuario: 'admin',
      contrasenia: pass,
      rol: 'ADMIN'
    });
    console.log('Usuario admin creado exitosamente. Usuario: admin, Password: admin123');
  } catch (e) {
    console.error('Error al crear usuario:', e);
  }
  process.exit(0);
};
run();
