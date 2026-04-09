// js/vistas.js

import { registerUser, loginUser } from './storage.js';

export const vistas = {

  // =========================
  // LOGIN
  // =========================
  login: (navigate) => {
    const app = document.getElementById('app');

    app.innerHTML = `
      <div class="container">
        <h2>Login</h2>

        <form id="loginForm">
          <input type="text" id="user" placeholder="Usuario" required>
          <input type="password" id="pass" placeholder="Contraseña" required>
          <button type="submit">Ingresar</button>
          <button id="goRegister">Registrarse</button>
          <p id="error" class="error"></p>
        </form>

        

        
      </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();

      const user = document.getElementById('user').value.trim();
      const pass = document.getElementById('pass').value.trim();

      try {
        const usuario = loginUser(user, pass);

        // 🔥 GUARDAR SESIÓN
        localStorage.setItem('sesion', JSON.stringify(usuario));

        // 🔥 REDIRECCIÓN POR ROL
        if (usuario.rol === 'admin') {
          window.location.href = "../dashboards/dashboardAdmin.html";
        } else {
          window.location.href = "../dashboards/dashboardAdmin.html";
        }

      } catch (err) {
        document.getElementById('error').textContent = err.message;
      }
    });

    document.getElementById('goRegister').onclick = () => {
      navigate('register');
    };
  },


  // =========================
  // REGISTER
  // =========================
  register: (navigate) => {
    const app = document.getElementById('app');

    app.innerHTML = `
      <div class="container">
        <h2>Registro</h2>

        <form id="registerForm">
          <input type="text" id="newUser" placeholder="Usuario" required>
          <input type="password" id="newPass" placeholder="Contraseña" required>

          <input type="text" id="codigoAdmin" placeholder="Código admin (opcional)">

          <button type="submit">Crear cuenta</button>
        </form>

        <p id="error" class="error"></p>

        <button id="goLogin">Volver al login</button>
      </div>
    `;

    document.getElementById('registerForm').addEventListener('submit', (e) => {
      e.preventDefault();

      const user = document.getElementById('newUser').value.trim();
      const pass = document.getElementById('newPass').value.trim();
      const codigo = document.getElementById('codigoAdmin').value.trim();

      try {
        // 🔥 DEFINIR ROL
        let rol = 'empleado';
        if (codigo === '7777') {
          rol = 'admin';
        }

        // 🔥 REGISTRAR USUARIO
        const nuevoUsuario = registerUser(user, pass, rol);

        // 🔥 GUARDAR SESIÓN AUTOMÁTICA
        localStorage.setItem('sesion', JSON.stringify(nuevoUsuario));

        // 🔥 REDIRECCIÓN
        if (rol === 'admin') {
          window.locatio.href = "../dashboards/dashboardAdmin.html"
        } else {
          window.location.href = "../dashboards/dashboardEmpleado.html"
        }

      } catch (err) {
        document.getElementById('error').textContent = err.message;
      }
    });

    document.getElementById('goLogin').onclick = () => {
      navigate('login');
    };
  }

};
