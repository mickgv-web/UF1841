let personajes = [];
let preguntasSeleccionadas = [];
let preguntaActual = 0;
let aciertos = 0;

// Cargar datos desde JSON externo
fetch("data/personajes.json")
  .then((response) => response.json())
  .then((data) => {
    personajes = data;
    seleccionarPreguntas();
    cargarPregunta();
    actualizarProgreso();
  })
  .catch((error) => console.error("Error cargando personajes:", error));

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

  // Barajar opciones
  const opciones = [...pregunta.opciones];
  const respuestaCorrecta = opciones[pregunta.respuestaIndex];

  // Algoritmo Fisher-Yates para mezclar
  for (let i = opciones.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
  }

  // Guardar nuevo índice correcto
  pregunta.opciones = opciones;
  pregunta.respuestaIndex = opciones.indexOf(respuestaCorrecta);

  // Mostrar en pantalla
  document.querySelector(".character-image").src = pregunta.imagen;
  document.getElementById("opcion1").textContent = opciones[0];
  document.getElementById("opcion2").textContent = opciones[1];
  document.getElementById("opcion3").textContent = opciones[2];
  document.getElementById("result").textContent = "";

  // Resetear estilos de botones
  document.querySelectorAll(".opcion").forEach(boton => {
    boton.classList.remove("correct", "incorrect");
    boton.disabled = false;
  });
}


// Verificar respuesta usando índice
function verificarRespuesta(opcionIndex) {
  const pregunta = preguntasSeleccionadas[preguntaActual];
  const result = document.getElementById("result");
  const botones = document.querySelectorAll(".opcion");

  // Resetear clases previas
  botones.forEach((b) => b.classList.remove("correct", "incorrect"));

  if (opcionIndex === pregunta.respuestaIndex) {
    result.textContent = `✅ Correcto! Era ${
      pregunta.opciones[pregunta.respuestaIndex]
    } de ${pregunta.juego}`;
    aciertos++;
    botones[opcionIndex].classList.add("correct");
  } else {
    result.textContent = `❌ Incorrecto. La respuesta correcta era: ${
      pregunta.opciones[pregunta.respuestaIndex]
    } de ${pregunta.juego}`;
    botones[opcionIndex].classList.add("incorrect");
    botones[pregunta.respuestaIndex].classList.add("correct"); // marcar la correcta
  }

  preguntaActual++;
  actualizarProgreso();

  if (preguntaActual < preguntasSeleccionadas.length) {
    setTimeout(cargarPregunta, 1500);
  } else {
    setTimeout(mostrarResultados, 1500);
  }
}

// Mostrar resultados finales
function mostrarResultados() {
  const result = document.getElementById("result");
  result.textContent = `🎉 Juego terminado. Has acertado ${aciertos} de 5 preguntas.`;

  // Mostrar botón de reinicio
  document.getElementById("reiniciar").style.display = "inline-block";

  // Desactivar botones de opciones
  document.querySelectorAll(".opcion").forEach(boton => {
    boton.disabled = true;
  });

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

  // Resetear estilos especiales
  document.getElementById("result").classList.remove("perfect-win");

  // 🔥 Volver a activar botones
  document.querySelectorAll(".opcion").forEach(boton => {
    boton.disabled = false;
  });

  seleccionarPreguntas();
  cargarPregunta();
  actualizarProgreso();
});