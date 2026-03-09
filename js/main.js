/**
 * SIMULADOR ELECTORAL SECRE - COLEGIO REGGIO EMILIA
  */

// 1. Aquí defino las Constantes y Variables de Control
const CANDIDATOS = ["Laura Martínez", "Sofía Herrera", "Diego Ramírez"];
const VOTOS = [0, 0, 0]; 
const VOTANTES_REGISTRADOS = []; // Array para control de duplicados
const CLAVE_JURADO = "1234"; // Contraseña para ver resultados
let totalVotos = 0;

/**
 * Función: votarPorCandidato
 * Cuando ingresa a la página candidatos.html se activa al hacer clic en las fotos en candidatos.html
 */
function votarPorCandidato(indice) {
    // Entrada: Captura de documento y normalización (mayúsculas) para evitar errores
    let documento = prompt("Has elegido a " + CANDIDATOS[indice] + ".\nIngresa tu documento para validar:").trim().toUpperCase();

    // Validación: Campo vacío
    if (!documento) {
        alert("❌ Error: Debe ingresar un documento válido.");
        return;
    }

    // Validación: Votante duplicado
    if (VOTANTES_REGISTRADOS.includes(documento)) {
        alert("🚫 ACCESO DENEGADO: El sistema registra que el documento " + documento + " ya ha votado.");
        return;
    }

    // Procesamiento: Confirmación del voto
    let confirmar = confirm("¿" + documento + ", confirmas tu voto por " + CANDIDATOS[indice] + "?");

    if (confirmar) {
        VOTOS[indice]++; // Suma el voto al array
        VOTANTES_REGISTRADOS.push(documento); // Registra al votante
        totalVotos++;
        alert("✅ ¡Voto registrado exitosamente!");
        console.log("Votación: " + documento + " votó por " + CANDIDATOS[indice]);
    }
}

/**
 * Función: finalizarVotacion (Se requiere la clave del jurado para acceder a los resultados)
 * si la clave no coincide, se muestra un mensaje de error y no se permite ver los resultados. 
 * Si la clave es correcta, se muestra un resumen final de los votos por cada candidato y el 
 * total de votantes registrados.
 */
function finalizarVotacion() {
    let password = prompt("🔐 Acceso restringido. Ingrese la clave del jurado para ver el escrutinio:");

    if (password === CLAVE_JURADO) {
        if (totalVotos === 0) {
            alert("No hay votos registrados en la urna virtual.");
            return;
        }

        // Salida de datos: Resumen final
        let resumen = "--- RESULTADOS FINALES ---\n";
        for (let i = 0; i < CANDIDATOS.length; i++) {
            resumen += CANDIDATOS[i] + ": " + VOTOS[i] + " votos.\n";
        }
        
        alert(resumen + "\nTotal de votantes: " + totalVotos);
        console.log("Escrutinio completo:", VOTOS);
        console.log("Lista oficial de votantes:", VOTANTES_REGISTRADOS);
    } else {
        alert("❌ Clave incorrecta. Solo el jurado puede cerrar la votación.");
    }
}