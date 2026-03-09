/**
 * SIMULADOR ELECTORAL SECRE - COLEGIO REGGIO EMILIA
 * Desarrollo: Validación de Votante Único y Seguridad de Jurado
 */

// 1. Constantes y Arrays (Estructura de datos)
const CANDIDATOS = ["Laura Martínez", "Sofía Herrera", "Diego Ramírez"];
const VOTOS = [0, 0, 0]; 
const VOTANTES_REGISTRADOS = []; // Array para control de duplicados
const CLAVE_JURADO = "1234"; 
let totalVotos = 0;

// --- FUNCIONES DEL SIMULADOR ---

/**
 * FUNCIÓN 1: Validar si el usuario ya votó (Procesamiento)
 * Retorna true si ya existe en el array, false si es nuevo.
 */
function verificarIdentidad(documento) {
    // Buscamos el documento en el array de registrados
    if (VOTANTES_REGISTRADOS.includes(documento)) {
        return true; // Ya votó
    }
    return false; // No ha votado
}

/**
 * FUNCIÓN 2: Registrar el voto (Entrada y Procesamiento)
 * Se invoca al hacer clic en las imágenes de candidatos.html
 */
function votarPorCandidato(indice) {
    let documento = prompt("Ingresa tu documento para validar tu identidad:").trim().toUpperCase();

    // Validación de entrada básica
    if (!documento) {
        alert("❌ Error: Debe ingresar un documento para votar.");
        return;
    }

    // LLAMADA A FUNCIÓN DE VALIDACIÓN (Función 1)
    let yaVoto = verificarIdentidad(documento);

    if (yaVoto) {
        alert("🚫 ACCESO DENEGADO: " + documento + ", ya has registrado un voto.");
        console.warn("Intento de duplicidad: " + documento);
    } else {
        let confirmar = confirm("¿Confirmas tu voto por " + CANDIDATOS[indice] + "?");
        
        if (confirmar) {
            // Procesamiento de datos
            VOTOS[indice]++; 
            VOTANTES_REGISTRADOS.push(documento); 
            totalVotos++;
            alert("✅ ¡Voto registrado exitosamente!");
        }
    }
}

/**
 * FUNCIÓN 3: Escrutinio Final (Salida de resultados)
 * Protegida por contraseña para el jurado electoral.
 */
function finalizarVotacion() {
    let password = prompt("🔐 Ingrese la clave del jurado para ver los resultados:");

    if (password === CLAVE_JURADO) {
        if (totalVotos === 0) {
            alert("Aún no hay votos en la urna.");
            return;
        }

        let resumen = "--- RESULTADOS FINALES ---\n";
        for (let i = 0; i < CANDIDATOS.length; i++) {
            resumen += `${CANDIDATOS[i]}: ${VOTOS[i]} votos.\n`;
        }
        
        alert(resumen + "\nTotal votantes: " + totalVotos);
        console.log("Lista oficial de votantes:", VOTANTES_REGISTRADOS);
    } else {
        alert("❌ Clave incorrecta.");
    }
}