// js/storage.js

const KEY = 'users';

export function getUsers() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users) {
  localStorage.setItem(KEY, JSON.stringify(users));
}

export function registerUser(username, password, rol = 'empleado') {
  try {
    const users = JSON.parse(localStorage.getItem('usuarios_auth')) || [];
    if (users.find(u => u.username === username)) {
      throw new Error('El usuario ya existe');
    }
    const nuevo = { username, password, rol };
    users.push(nuevo);
    localStorage.setItem('usuarios_auth', JSON.stringify(users));
    return { message: 'Usuario creado con éxito', user: nuevo };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'El usuario ya existe') {
        throw error; // Re-lanza el error si es de usuario existente
      } else {
        throw new Error('Error interno al registrar usuario');
      }
    } else if (error instanceof SyntaxError) {
      localStorage.removeItem('usuarios_auth'); // Limpia datos corruptos
      throw new Error('Error de datos almacenados, intenta de nuevo');
    } else {
      throw new Error('Error inesperado al registrar usuario');
    }
  }
}





export function loginUser(username, password) {
  const users = JSON.parse(localStorage.getItem('usuarios_auth')) || [];

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) throw new Error('Credenciales inválidas');

  return user;
}