let personajes = [];
let preguntasSeleccionadas = [];
let preguntaActual = 0;
let aciertos = 0;

// Cargar datos desde JSON externo
fetch("data/personajes.json")
  .then(response => response.json())
  .then(data => {
    personajes = data;
    seleccionarPreguntas();
    cargarPregunta();
    actualizarProgreso();
  })
  .catch(error => console.error("Error cargando personajes:", error));

// Seleccionar 5 preguntas aleatorias
function seleccionarPreguntas() {
  const copia = [...personajes];
  preguntasSeleccionadas = [];
  for (let i = 0; i < 5; i++) {
    const indice = Math.floor(Math.random() * copia.length);
    preguntasSeleccionadas.push(copia[indice]);
    copia.splice(indice, 1); // eliminar para no repetir
  }
}

// Cargar una pregunta en pantalla
function cargarPregunta() {
  const pregunta = preguntasSeleccionadas[preguntaActual];
  document.querySelector(".character-image").src = pregunta.imagen;
  document.getElementById("opcion1").textContent = pregunta.opciones[0];
  document.getElementById("opcion2").textContent = pregunta.opciones[1];
  document.getElementById("opcion3").textContent = pregunta.opciones[2];
  document.getElementById("result").textContent = "";
}

// Verificar respuesta usando índice
function verificarRespuesta(opcionIndex) {
  const pregunta = preguntasSeleccionadas[preguntaActual];
  const result = document.getElementById("result");

  if (opcionIndex === pregunta.respuestaIndex) {
    result.textContent = `✅ Correcto! Era ${pregunta.opciones[pregunta.respuestaIndex]} de ${pregunta.juego}`;
    aciertos++;
  } else {
    result.textContent = `❌ Incorrecto. La respuesta correcta era: ${pregunta.opciones[pregunta.respuestaIndex]} de ${pregunta.juego}`;
  }

  preguntaActual++;
  actualizarProgreso();

  if (preguntaActual < preguntasSeleccionadas.length) {
    setTimeout(cargarPregunta, 1500);
  } else {
    mostrarResultados();
  }
}

// Mostrar resultados finales
function mostrarResultados() {
  const result = document.getElementById("result");
  result.textContent = `🎉 Juego terminado. Has acertado ${aciertos} de 5 preguntas.`;

  // Mostrar botón de reinicio
  document.getElementById("reiniciar").style.display = "inline-block";

  // Si acertó todas, añadir visual
  if (aciertos === preguntasSeleccionadas.length) {
    result.classList.add("perfect-win");
    result.textContent += " 🌟 ¡Perfecto!";
  }
}


// Actualizar barra de progreso
function actualizarProgreso() {
  const progreso = (preguntaActual / preguntasSeleccionadas.length) * 100;
  document.getElementById("progress-bar").style.width = `${progreso}%`;
}

// Inicializar eventos de botones con índice
document.querySelectorAll(".opcion").forEach((boton, index) => {
  boton.addEventListener("click", () => verificarRespuesta(index));
});

// Reiniciar juego
document.getElementById("reiniciar").addEventListener("click", () => {
  preguntaActual = 0;
  aciertos = 0;
  document.getElementById("reiniciar").style.display = "none";
  seleccionarPreguntas();
  cargarPregunta();
  actualizarProgreso();
});
