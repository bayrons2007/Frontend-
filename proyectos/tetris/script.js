console.log("Script conectado correctamente")

const canvas = document.getElementById("tablero");
const ctx = canvas.getContext("2d");
const elementoPuntuacion = document.getElementById("puntuacion");
const elementoRecord = document.getElementById("record");

//piezas
const piezas = [
  [
    [1, 1],
    [1, 1]
  ], // Cuadrada (O)
  [
    [1, 1, 1, 1]
  ], // Barra (I)
  [
    [1, 0, 0],
    [1, 1, 1]
  ], // L
  [
    [0, 0, 1],
    [1, 1, 1]
  ], // J
  [
    [0, 1, 0],
    [1, 1, 1]
  ], // T
  [
    [0, 1, 1],
    [1, 1, 0]
  ], // S
  [
    [1, 1, 0],
    [0, 1, 1]
  ] // Z
];

// Variables para la posición de la pieza
let piezaX = 0;
let piezaY = 0;
let piezaActual = piezas[Math.floor(Math.random() * piezas.length)];
// Variables para el puntaje y el récord
let puntaje = 0;
let record = 0;
let juegoTerminado = false;

// Definir el tamaño del tablero
const filas = 20;
const columnas = 10;

const tablero = [];
for (let i = 0; i < filas; i++) {
  tablero.push(new Array(columnas).fill(0));
}

function dibujarTodo() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "lightgray";

  for (let x = 0; x <= canvas.width; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.fillStyle = "gray";
  for (let fila = 0; fila < filas; fila++) {
    for (let col = 0; col < columnas; col++) {
      if (tablero[fila][col] === 1) {
        ctx.fillRect(col * 24, fila * 24, 24, 24);
      }
    }
  }

  ctx.fillStyle = "yellow";

  for (let fila = 0; fila < piezaActual.length; fila++) {
    for (let col = 0; col < piezaActual[fila].length; col++) {
      if (piezaActual[fila][col] === 1) {
        ctx.fillRect((col + piezaX) * 24, (fila + piezaY) * 24, 24, 24);
      }
    }
  }
}

function posicionValida(pieza, nuevoX, nuevoY) {
  for (let fila = 0; fila < pieza.length; fila++) {
    for (let col = 0; col < pieza[fila].length; col++) {
      if (pieza[fila][col] === 1) {
        let filaTablero = fila + nuevoY;
        let colTablero = col + nuevoX;

        if (colTablero < 0 || colTablero >= columnas) {
          return false;
        }

        if (filaTablero >= filas) {
          return false;
        }

        if (tablero[filaTablero][colTablero] === 1) {
          return false;
        }
      }
    }
  }
  return true;
}

function rotarPieza(pieza) {
  const filasPieza = pieza.length;
  const columnasPieza = pieza[0].length;

  const piezaRotada = [];
  for (let i = 0; i < columnasPieza; i++) {
    piezaRotada.push(new Array(filasPieza).fill(0));
  }

  for (let fila = 0; fila < filasPieza; fila++) {
    for (let col = 0; col < columnasPieza; col++) {
      piezaRotada[col][filasPieza - 1 - fila] = pieza[fila][col];
    }
  }

  return piezaRotada;
}

function fijarPieza() {
  for (let fila = 0; fila < piezaActual.length; fila++) {
    for (let col = 0; col < piezaActual[fila].length; col++) {
      if (piezaActual[fila][col] === 1) {
        let filaTablero = fila + piezaY;
        let colTablero = col + piezaX;
        tablero[filaTablero][colTablero] = 1;
      }
    }
  }

  const lineasEliminadas = eliminarLineasCompletas();
  actualizarPuntaje(lineasEliminadas);

  piezaX = 0;
  piezaY = 0;
  piezaActual = piezas[Math.floor(Math.random() * piezas.length)];

  if (!posicionValida(piezaActual, piezaX, piezaY)) {
    terminarJuego();
  }
}

function eliminarLineasCompletas() {
  let lineasEliminadas = 0;

  for (let fila = 0; fila < filas; fila++) {
    let filaCompleta = true;

    for (let col = 0; col < columnas; col++) {
      if (tablero[fila][col] === 0) {
        filaCompleta = false;
      }
    }

    if (filaCompleta) {
      tablero.splice(fila, 1);
      tablero.unshift(new Array(columnas).fill(0));
      lineasEliminadas++;
    }
  }

  return lineasEliminadas;
}

function actualizarPuntaje(lineasEliminadas) {
  puntaje += lineasEliminadas * 100;

  if (puntaje > record) {
    record = puntaje;
  }

  elementoPuntuacion.textContent = "Puntuación: " + puntaje;
  elementoRecord.textContent = "Récord: " + record;
}

document.addEventListener("keydown", function(evento) {
  if (juegoTerminado) {
    if (evento.key === "r") {
      reiniciarJuego();
    }
    return;
  }

  if (evento.key === "a" && posicionValida(piezaActual, piezaX - 1, piezaY)) {
    piezaX--;
  } else if (evento.key === "d" && posicionValida(piezaActual, piezaX + 1, piezaY)) {
    piezaX++;
  } else if (evento.key === "s" && posicionValida(piezaActual, piezaX, piezaY + 1)) {
    piezaY++;
  } else if (evento.key === "w") {
    const piezaRotada = rotarPieza(piezaActual);
    if (posicionValida(piezaRotada, piezaX, piezaY)) {
      piezaActual = piezaRotada;
    }
  }

  dibujarTodo();
});

dibujarTodo();

setInterval(function() {
  if (juegoTerminado) return;

  if (posicionValida(piezaActual, piezaX, piezaY + 1)) {
    piezaY++;
  } else {
    fijarPieza();
  }
  dibujarTodo();
}, 500);

function reiniciarJuego() {
  for (let fila = 0; fila < filas; fila++) {
    for (let col = 0; col < columnas; col++) {
      tablero[fila][col] = 0;
    }
  }
  puntaje = 0;
  juegoTerminado = false;
  piezaX = 0;
  piezaY = 0;
  piezaActual = piezas[Math.floor(Math.random() * piezas.length)];
  elementoPuntuacion.textContent = "Puntuación: " + puntaje;
  dibujarTodo();
}

function terminarJuego() {
  juegoTerminado = true;

  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "bold 32px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("¡Perdiste!", canvas.width / 2, canvas.height / 2 - 20);

  ctx.font = "18px sans-serif";
  ctx.fillText("Puntuación: " + puntaje, canvas.width / 2, canvas.height / 2 + 15);
  ctx.fillText("Presiona R para reiniciar", canvas.width / 2, canvas.height / 2 + 45);
}
