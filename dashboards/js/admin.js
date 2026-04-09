let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
let clienteSeleccionado = null;

/* MENU */
document.getElementById("menuBtn").onclick = () => {
  document.getElementById("sidebar").classList.toggle("active");
};

function showSection(sec) {
  document.getElementById("clientes").style.display = "none";
  document.getElementById("pedidos").style.display = "none";
  document.getElementById("reportes").style.display = "none";

  document.getElementById(sec).style.display = "block";

  if (sec === "reportes") mostrarReportes();

  // 🔥 MOSTRAR CLIENTES AUTOMÁTICAMENTE
  if (sec === "pedidos") mostrarClientesParaPedido();
}

/* =========================
   CLIENTES
========================= */

function generarCodigo() {
  return Math.floor(1000 + Math.random() * 9000);
}

function guardarCliente() {
  let cliente = {
    nombre: nombre.value,
    apellido: apellido.value,
    telefono: telefono.value,
    codigo: generarCodigo()
  };

  clientes.push(cliente);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  mostrarClientes();
}

function mostrarClientes() {
  let cont = document.getElementById("listaClientes");
  cont.innerHTML = "";

  clientes.forEach((c, i) => {
    cont.innerHTML += `
      <div class="card">
        ${c.nombre} ${c.apellido} - ${c.codigo}
        <br>
        ${c.telefono}
        <br>
        <button onclick="editarCliente(${i})">Editar</button>
        <button onclick="eliminarCliente(${i})">Eliminar</button>
        <button onclick="whatsapp('${c.telefono}')">WhatsApp</button>
      </div>
    `;
  });
}

function eliminarCliente(i) {
  let pass = prompt("Contraseña:");
  if (pass !== "7777") return;

  clientes.splice(i, 1);
  localStorage.setItem("clientes", JSON.stringify(clientes));
  mostrarClientes();
}

function editarCliente(i) {
  let pass = prompt("Contraseña admin:");
  if (pass !== "7777") return;

  let nuevoNombre = prompt("Nombre:", clientes[i].nombre);
  let nuevoApellido = prompt("Apellido:", clientes[i].apellido);
  let nuevoTelefono = prompt("Teléfono:", clientes[i].telefono);

  clientes[i].nombre = nuevoNombre;
  clientes[i].apellido = nuevoApellido;
  clientes[i].telefono = nuevoTelefono;

  localStorage.setItem("clientes", JSON.stringify(clientes));
  mostrarClientes();
}

function whatsapp(num) {
  window.open(`https://wa.me/549${num}`);
}

/* =========================
   PEDIDOS
========================= */

// 🔥 NUEVA FUNCIÓN
function mostrarClientesParaPedido(lista = clientes) {
  let cont = document.getElementById("clientesFiltrados");
  cont.innerHTML = "";

  lista.forEach(c => {
    cont.innerHTML += `
      <div class="card" onclick="seleccionarCliente(${c.codigo})">
        ${c.nombre} ${c.apellido} - ${c.codigo}
      </div>
    `;
  });
}

document.getElementById("filtroCliente").addEventListener("input", filtrarClientes);

function filtrarClientes() {
  let texto = filtroCliente.value.toLowerCase();

  let filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(texto) ||
    c.apellido.toLowerCase().includes(texto) ||
    c.telefono.includes(texto) ||
    c.codigo.toString().includes(texto)
  );

  mostrarClientesParaPedido(filtrados);
}

function seleccionarCliente(cod) {
  clienteSeleccionado = cod;
  alert("Cliente seleccionado: " + cod);
}

function crearPedido() {
  if (!clienteSeleccionado) {
    alert("Seleccionar cliente");
    return;
  }

  let pedido = {
    cliente: clienteSeleccionado,
    bolsas: bolsas.value,
    precio: precioPedido.value,
    estado: "sucio",
    historial: [
      {
        estado: "sucio",
        fecha: new Date().toLocaleString()
      }
    ]
  };

  pedidos.push(pedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  mostrarPedidos();
}

function mostrarPedidos() {
  let cont = document.getElementById("listaPedidos");
  cont.innerHTML = "";

  pedidos.forEach((p, i) => {
    cont.innerHTML += `
      <div class="card">
        Cliente: ${p.cliente}
        <br>
        Estado: ${p.estado}
        <br>
        Precio: $${p.precio}
        <br>
        Bolsas: ${p.bolsas}
        <br>
        <button onclick="cambiarEstado(${i})">Cambiar Estado</button>
        <button onclick="editarPedido(${i})">Editar Pedido</button>
      </div>
    `;
  });
}

function editarPedido(i) {
  let pass = prompt("Contraseña admin:");
  if (pass !== "7777") return;

  let nuevasBolsas = prompt("Cantidad de bolsas:", pedidos[i].bolsas);
  let nuevoPrecio = prompt("Precio:", pedidos[i].precio);

  pedidos[i].bolsas = nuevasBolsas;
  pedidos[i].precio = nuevoPrecio;

  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  mostrarPedidos();
}

function cambiarEstado(i) {
  let estados = ["sucio", "lavando", "secando", "planchando", "embolsado", "cobrado"];

  let actual = pedidos[i].estado;
  let index = estados.indexOf(actual);

  if (index < estados.length - 1) {
    let nuevo = estados[index + 1];

    let registro = {
      estado: nuevo,
      fecha: new Date().toLocaleString()
    };

    if (nuevo === "embolsado") {
      let bolsasFinal = prompt("Cuantas bolsas finales?");
      pedidos[i].bolsasFinal = bolsasFinal;
      registro.bolsas = bolsasFinal;
    }

    pedidos[i].estado = nuevo;
    pedidos[i].historial.push(registro);

    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    mostrarPedidos();
  }
}

/* =========================
   REPORTES
========================= */

function mostrarReportes() {
  let cont = document.getElementById("listaReportes");
  cont.innerHTML = "";

  cont.innerHTML += `
    <button onclick="borrarHistorial()">🗑️ Borrar Historial</button>
  `;

  pedidos.forEach(p => {
    let cliente = clientes.find(c => c.codigo == p.cliente);

    p.historial.forEach(h => {
      cont.innerHTML += `
        <div class="card">
          ${cliente ? cliente.nombre : "Cliente eliminado"}
          <br>
          Estado: ${h.estado}
          ${h.bolsas ? `<br>Bolsas: ${h.bolsas}` : ""}
          <br>
          Fecha: ${h.fecha}
          <br>
          Precio: $${p.precio}
        </div>
      `;
    });
  });
}

function borrarHistorial() {
  let pass = prompt("Contraseña admin:");
  if (pass !== "7777") return;

  pedidos.forEach(p => {
    p.historial = [];
  });

  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  mostrarReportes();
}

/* INIT */
mostrarClientes();
mostrarPedidos();