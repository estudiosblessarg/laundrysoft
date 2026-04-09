// js/app.js

// 👇 rutas relativas desde app.js
import { vistas } from './vistas.js';

function navigate(vista) {
  if (!vistas[vista]) {
    console.error('Vista no existe');
    return;
  }

  vistas[vista](navigate);
}

// iniciar
navigate('login');