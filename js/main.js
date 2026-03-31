/**
 * SIMULADOR ELECTORAL SECRE - ENTREGA 2
 * Integración DOM, Eventos y Storage
 */

// 1. Definición de Objetos y Estado Inicial
class Candidato {
    constructor(id, nombre, propuesta) {
        this.id = id;
        this.nombre = nombre;
        this.propuesta = propuesta;
        this.votos = 0;
    }
}

// Intentar cargar datos previos de LocalStorage o usar iniciales para los tres candidatos puntuales
// Si no hay datos en LocalStorage, se crean los candidatos con 0 votos. Si ya hay datos, se cargan
// para mantener el estado persistente.
// El operador lógico OR (||) se utiliza para proporcionar un valor predeterminado en caso de que 
// el resultado de JSON.parse sea null (lo que ocurre si no hay datos en LocalStorage).
// Lo ideal es que se ingrese un código o número de identificación único para cada candidato, pero 
// en este caso, como es un simulador, se asignan ID secuenciales (0, 1, 2) para facilitar la gestión
// de votos y la referencia a cada candidato en el código.

let candidatos = JSON.parse(localStorage.getItem('candidatos')) || [
    new Candidato(0, "Isabela Gómez", "Más participación"),
    new Candidato(1, "Salomé Zapata", "Innovación"),
    new Candidato(2, "Matías Noreña", "Sostenibilidad")
];

// Similarmente, se intenta cargar la lista de votantes registrados desde LocalStorage. Si no hay 
// datos, se inicializa como un array vacío. Esto permite llevar un control de quiénes han votado y 
// evitar votos duplicados.

// Igualmente lo ideal sería un sistema de autenticación más robusto para validar la identidad de 
// los votantes, pero, para este simulador, se utiliza el nombre ingresado como identificador único,
// ya que, aun no hemos implementado un sistema de usuarios, contraseñas o autenticación. Por eso, 
// se recomienda a los usuarios ingresar su nombre completo para minimizar la posibilidad de 
// duplicados.

let votantesRegistrados = JSON.parse(localStorage.getItem('votantes')) || [];

// 2. Referencias al DOM

const inputNombre = document.getElementById('nombreVotante');
const divMensaje = document.getElementById('mensaje-validacion');
const botonesVotar = document.querySelectorAll('.btn-votar');
const btnFinalizar = document.getElementById('btn-finalizar');
const contenedorResultados = document.getElementById('contenedor-resultados');
const btnMaestro = document.getElementById('btn-maestro');
const cardResultados = document.getElementById('card-resultados-acceso'); // La card que mencionaste antes
const zonaClave = document.getElementById('zona-clave');
const inputClave = document.getElementById('input-clave-jurado');
const btnConfirmar = document.getElementById('btn-confirmar-clave');
const errorMsg = document.getElementById('error-login');

// 3. Funciones de Lógica

const guardarEnStorage = () => {
    localStorage.setItem('candidatos', JSON.stringify(candidatos));
    localStorage.setItem('votantes', JSON.stringify(votantesRegistrados));
};

/**
 * Función para incluir resaltado visual
 * (e) me permite acceder al evento y al elemento específico que disparó el click, para luego resaltar la tarjeta del candidato seleccionado.
 * el evento puede ser el click en el botón o en la imagen, por eso uso e.target.closest para asegurarme de obtener la tarjeta completa del candidato, sin importar dónde se hizo clic dentro de esa tarjeta.
 */
const procesarVoto = (e) => {
    const nombre = inputNombre.value.trim().toUpperCase();
    
    // Obtenemos la tarjeta (card) donde se hizo clic
    const tarjetaVisual = e.target.closest('.card-candidato');
    const idCandidato = parseInt(e.target.getAttribute('data-id'));

    // a. Validaciones de entrada
    if (!nombre) {
        divMensaje.innerHTML = `<span class="text-danger">⚠ Ingresa tu nombre antes de elegir un candidato.</span>`;
        return;
    }

    if (votantesRegistrados.includes(nombre)) {
        divMensaje.innerHTML = `<span class="text-danger">🚫 ${nombre}, ya has participado en esta votación.</span>`;
        return;
    }

    // b. Resaltar la tarjeta seleccionada
    // Primero quitamos el resaltado de todas las tarjetas
    document.querySelectorAll('.card-candidato').forEach(card => {
        card.classList.remove('card-seleccionada');
    });

    // Aplicamos el resaltado a la tarjeta actual
    if (tarjetaVisual) {
        tarjetaVisual.classList.add('card-seleccionada');
    }

    // c. Procesamiento y Storage
    candidatos[idCandidato].votos++;
    votantesRegistrados.push(nombre);
    guardarEnStorage();

    // d. Feedback al usuario
    divMensaje.innerHTML = `<div class="alert alert-success mt-2">
        ✅ Voto registrado con éxito para <strong>${candidatos[idCandidato].nombre}</strong>.
    </div>`;
    
    inputNombre.value = ""; // Limpiamos para el siguiente votante
};

    const renderizarResultados = () => {
    const lista = document.getElementById('lista-resultados');
    const totalParrafo = document.getElementById('total-votos-dom');
    let acumulado = 0;

    lista.innerHTML = "";
    
    candidatos.forEach(can => {
        const p = document.createElement('p');
        p.innerText = `${can.nombre}: ${can.votos} votos`;
        lista.appendChild(p);
        acumulado += can.votos;
    });

    totalParrafo.innerText = `Total de votos emitidos: ${acumulado}`;
    contenedorResultados.classList.remove('d-none');
};

// 4. Eventos
botonesVotar.forEach(boton => {
    boton.addEventListener('click', procesarVoto);
});

// 5. Botón Maestro para cerrar urna y reiniciar votación

// Función que gestiona los dos estados del botón
// --- SECCIÓN DE LÓGICA DE CIERRE ---

// 1. Escuchamos el clic en el botón y en la card
btnMaestro.addEventListener('click', iniciarValidacion);
if (cardResultados) {
    cardResultados.addEventListener('click', iniciarValidacion);
}

if (btnMaestro) {
    btnMaestro.addEventListener('click', iniciarValidacion);
}

if (btnConfirmar) {
    btnConfirmar.addEventListener('click', () => {
        // Tu lógica de validación aquí...
        const CLAVE_MAESTRA = "1234";
        if (inputClave.value === CLAVE_MAESTRA) {
            finalizarVotacion();
            zonaClave.classList.add('d-none');
        } else {
            errorMsg.innerText = "❌ Clave incorrecta";
            inputClave.value = "";
        }
    });
}

// 2. Función que abre el panel de clave
function iniciarValidacion() {
    if (btnMaestro.innerText === "Nueva Votación") {
        reiniciarSimulador(); // Llama a la función de limpieza
    } else {
        zonaClave.classList.remove('d-none'); // Muestra el div de la clave
        inputClave.focus(); // Pone el cursor listo para escribir
    }
}

// 3. Validación de la clave al presionar "Validar"
btnConfirmar.addEventListener('click', () => {
    const CLAVE_MAESTRA = "1234";

    if (inputClave.value === CLAVE_MAESTRA) {
        // Si es correcta, cerramos todo y mostramos resultados
        finalizarVotacion(); 
        zonaClave.classList.add('d-none'); // Escondemos el panel de clave
    } else {
        // Si es incorrecta, mensaje en el DOM y limpiamos el input
        errorMsg.innerText = "❌ Clave incorrecta";
        inputClave.value = "";
    }
});

// --- SECCIÓN DE LÓGICA DE CIERRE ---

// 1. Escuchamos el clic en el botón y en la card
btnMaestro.addEventListener('click', iniciarValidacion);
cardResultados.addEventListener('click', iniciarValidacion);

// 2. Función que abre el panel de clave
function iniciarValidacion() {
    if (btnMaestro.innerText === "Nueva Votación") {
        reiniciarSimulador(); // Llama a la función de limpieza
    } else {
        zonaClave.classList.remove('d-none'); // Muestra el div de la clave
        inputClave.focus(); // Pone el cursor listo para escribir
    }
}

// 3. Validación de la clave al presionar "Validar"
btnConfirmar.addEventListener('click', () => {
    const inputClave = document.getElementById('input-clave-jurado');
    const errorMsg = document.getElementById('error-login');
    const CLAVE_MAESTRA = "1234";

    console.log("Intentando validar clave..."); // Esto te dirá en la consola si el clic funciona

    if (inputClave.value === CLAVE_MAESTRA) {
        console.log("Clave correcta");
        finalizarVotacion(); // <--- ESTA FUNCIÓN DEBE EXISTIR
        document.getElementById('zona-clave').classList.add('d-none'); 
    } else {
        console.log("Clave incorrecta");
        errorMsg.innerText = "❌ Clave incorrecta";
        inputClave.value = "";
    }
});
/**
 * Función para limpiar datos y resetear la interfaz
 */
function reiniciarSimulador() {
    // Feedback visual y recarga
    btnMaestro.innerText = "Reiniciando...";
    
    // Recargamos la página para que vuelva a traer los datos del JSON original
    setTimeout(() => {
        location.reload();
    }, 1000);

    // Se utiliza setTimeout para dar un pequeño retraso antes de recargar, permitiendo que el 
    // usuario vea el mensaje de "Reiniciando..." antes de que la página se refresque.
    // En clase no vimos esta función, pero consulté las diapositivas y la documentación 
    // de la clase y allí lo encontré.

}
function finalizarVotacion() {
    // 1. Transformar el botón principal
    btnMaestro.innerText = "Nueva Votación";
    btnMaestro.classList.replace('btn-danger', 'btn-success');

    // 2. Mostrar la sección de resultados
    const contenedorResultados = document.getElementById('contenedor-resultados');
    contenedorResultados.classList.remove('d-none');

    // 3. Ejecutar el cálculo y dibujo de votos (la función que ya tienes)
    renderizarResultados();

    // 4. Bloquear botones de candidatos (Opcional pero recomendado)
    const botonesVotar = document.querySelectorAll('.btn-votar');
    botonesVotar.forEach(btn => btn.disabled = true);
    
    console.log("Sistema en modo: Resultados");
}