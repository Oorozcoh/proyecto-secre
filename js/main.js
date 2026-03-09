/**
 * SIMULADOR ELECTORAL SECRE
//  * Manejo de votación por imágenes, una vez esté en la página de los candidatos haga clic sobre la imagen 
// del candidato que prefiera para hacer la votación. */

// 1. Datos iniciales
const candidatos = ["Laura Martínez", "Sofía Herrera", "Diego Ramírez"];
const conteoVotos = [0, 0, 0]; // Array para procesar los resultados
let totalVotosEmitidos = 0;

/**
 * Función: votarPorCandidato
 * Se activa al hacer clic en la imagen del candidato.
 */
function votarPorCandidato(indice) {
    // Entrada de datos
    let nombreVotante = prompt("Has seleccionado a " + candidatos[indice] + ".\nPor favor, ingresa tu nombre para continuar:");

    // Validación de entrada (evita campos vacíos o cancelar)
    if (nombreVotante === "" || nombreVotante === null) {
        alert("❌ Operación cancelada: Debe ingresar un nombre para votar.");
        return; 
    }

    // Procesamiento: Confirmación del voto
    let confirmar = confirm("¿Confirmas tu voto para " + candidatos[indice] + "?");

    if (confirmar) {
        conteoVotos[indice]++; // Incrementa el voto en el array
        totalVotosEmitidos++;
        alert("✅ ¡Gracias " + nombreVotante + "! Tu voto ha sido registrado.");
        console.log("Voto registrado para: " + candidatos[indice]);
    } else {
        alert("Voto no registrado. Puedes seleccionar otro candidato.");
    }
}

/**
 * Función: finalizarVotacion
 * Muestra el escrutinio final en la consola y un resumen en pantalla.
 */
function finalizarVotacion() {
    if (totalVotosEmitidos === 0) {
        alert("Aún no hay votos registrados.");
        return;
    }

    console.log("--- RESULTADOS FINALES DE LA JORNADA ---");
    let resumen = "Escrutinio Final:\n";

    // Ciclo para procesar y mostrar resultados de cada candidato
    for (let i = 0; i < candidatos.length; i++) {
        let linea = candidatos[i] + ": " + conteoVotos[i] + " votos.";
        console.log(linea);
        resumen += "- " + linea + "\n";
    }

    console.log("Total de votos procesados: " + totalVotosEmitidos);
    alert(resumen + "\nTotal general: " + totalVotosEmitidos);
}