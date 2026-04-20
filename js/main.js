/**
 * SECRE - Sistema Electoral Colegio Reggio Emilia
 * Entrega Final - Proyecto Integrador Coderhouse JavaScript
 * Desarrollado por: Oscar Orozco
 */

let candidatos = [];
let votantes = [];

// 1. Cargar y Sincronizar Datos con limpieza de seguridad
async function inicializarSistema() {
    // FORZAR LIMPIEZA si los datos no tienen el formato correcto (evita el error de "solo nombres")
    const storageVotantes = localStorage.getItem('votantes');
    if (storageVotantes) {
        const prueba = JSON.parse(storageVotantes);
        // Si lo que hay en storage es una lista de strings y no objetos, borramos todo
        if (prueba.length > 0 && typeof prueba[0] === 'string') {
            console.warn("Detectados datos antiguos (strings). Limpiando LocalStorage...");
            localStorage.clear();
        }
    }

    try {
        const resVot = await fetch('../data/json/votantes.json');
        const resCand = await fetch('../data/json/candidatos.json');
        
        // Priorizamos los archivos JSON frescos para asegurar que el ID exista
        votantes = await resVot.json();
        candidatos = await resCand.json();

        // Si ya hay votos en storage, los recuperamos para no perder el conteo
        const savedVotos = JSON.parse(localStorage.getItem('candidatos'));
        if (savedVotos) {
            candidatos = savedVotos;
        }

        console.log("Sistema sincronizado con", votantes.length, "votantes.");
    } catch (error) {
        console.error("Error cargando archivos JSON. Revisa las rutas.", error);
    }
}

// 2. Escuchar Identificación del Votante
const inputId = document.getElementById('nombreVotante');
const feedback = document.getElementById('mensaje-validacion');
const contenedorCards = document.querySelector('.row.justify-content-center.g-4');

inputId.addEventListener('input', (e) => {
    const idIngresado = e.target.value.trim();
    
    // Solo buscamos si el array ya tiene datos
    if (votantes.length === 0) return;

    if (idIngresado.length < 4) { 
        contenedorCards.innerHTML = "";
        feedback.innerText = "";
        return;
    }

    // Buscamos con máxima compatibilidad de tipos
    const usuario = votantes.find(v => String(v.id).trim() === idIngresado);

    if (!usuario) {
        feedback.innerHTML = `<span class="text-warning">Documento no registrado en el censo.</span>`;
        contenedorCards.innerHTML = "";
    } else if (usuario.voto === "true" || usuario.voto === true) {
        feedback.innerHTML = `<span class="text-danger">⚠️ ${usuario.nombre}, ya has votado.</span>`;
        contenedorCards.innerHTML = "";
    } else {
        feedback.innerHTML = `<span class="text-success">✅ Bienvenido, ${usuario.nombre}</span>`;
        mostrarCandidatosPorCiclo(usuario);
    }
});

// Llamada inicial
inicializarSistema();

/**
 * Renderiza las tarjetas de candidatos filtradas por el ciclo del votante.
 * @param {Object} votanteActivo - El objeto del votante que ingresó su ID.
 */
function mostrarCandidatosPorCiclo(votanteActivo) {
    // 1. Limpiar el contenedor antes de renderizar
    contenedorCards.innerHTML = "";

    // 2. Filtrar candidatos que pertenezcan al mismo ciclo que el votante
    // Nota: Buscamos el ciclo del candidato en el array de 'votantes' usando su ID
    const candidatosPermitidos = candidatos.filter(cand => {
        const infoComoVotante = votantes.find(v => String(v.id).trim() === String(cand.id).trim());
        return infoComoVotante && String(infoComoVotante.ciclo) === String(votanteActivo.ciclo);
    });

    // 3. Validar si existen candidatos para ese ciclo
    if (candidatosPermitidos.length === 0) {
        contenedorCards.innerHTML = `
            <div class="col-12 text-center mt-4">
                <p class="alert alert-warning">No hay candidatos registrados para el Ciclo ${votanteActivo.ciclo}.</p>
            </div>`;
        return;
    }

    // 4. Crear y mostrar las Cards
    candidatosPermitidos.forEach(cand => {
        // Obtenemos el nombre del candidato desde la lista de votantes
        const infoPersonal = votantes.find(v => String(v.id).trim() === String(cand.id).trim());
        const nombreMostrar = infoPersonal ? infoPersonal.nombre : "Candidato sin nombre";

        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
            <div class="card h-100 card-candidato text-center p-3 shadow-sm border-primary">
                <img src="../assets/img/${cand.id}.jpeg" class="card-img-top img-ajustada" 
                     onerror="this.src='../assets/img/default-user.png'" alt="${nombreMostrar}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${nombreMostrar}</h5>
                    <p class="badge bg-info text-dark">Ciclo ${votanteActivo.ciclo}</p>
                    <button class="btn btn-primary w-100 mt-auto" onclick="procesarVoto('${cand.id}', '${votanteActivo.id}')">
                        Votar
                    </button>
                </div>
            </div>
        `;
        contenedorCards.appendChild(col);
    });
}

/**
 * Registra el voto, actualiza los contadores y marca al votante como "ya votó".
 */
procesarVoto = function(idCandidato, idVotante) {
    // 1. Confirmación de seguridad
    if (!confirm("¿Estás seguro de tu elección? No podrás cambiarla.")) return;

    // 2. Incrementar el voto en el array de candidatos
    const candIndex = candidatos.findIndex(c => String(c.id).trim() === String(idCandidato).trim());
    if (candIndex !== -1) {
        candidatos[candIndex].votos = (parseInt(candidatos[candIndex].votos) || 0) + 1;
    }

    // 3. Marcar al votante para que no pueda votar de nuevo
    const votIndex = votantes.findIndex(v => String(v.id).trim() === String(idVotante).trim());
    if (votIndex !== -1) {
        votantes[votIndex].voto = true; // Cambiamos el estado de "" a true
    }

    // 4. Guardar los cambios en LocalStorage para persistencia
    localStorage.setItem('candidatos', JSON.stringify(candidatos));
    localStorage.setItem('votantes', JSON.stringify(votantes));

    // 5. Feedback y limpieza de la interfaz
    alert("¡Voto registrado exitosamente!");
    
    // Resetear la vista para el siguiente estudiante
    document.getElementById('nombreVotante').value = "";
    document.getElementById('mensaje-validacion').innerText = "";
    document.querySelector('.row.justify-content-center.g-4').innerHTML = "";
    
    // Opcional: Si tienes una función para actualizar resultados en tiempo real, llámala aquí
    if (typeof renderizarResultados === "function") {
        renderizarResultados();
    }
};

/**
 * Realiza el escrutinio final, calcula abstención y muestra resultados por ciclo.
 */
function renderizarResultados() {
    const listaResultados = document.getElementById('lista-resultados');
    const totalVotosDOM = document.getElementById('total-votos-dom');
    
    listaResultados.innerHTML = ""; // Limpiar vista previa

    // 1. Cálculos de Participación General
    const totalVotantesCenso = votantes.length;
    const votantesQueVotaron = votantes.filter(v => v.voto === true || v.voto === "true").length;
    const totalAbstencion = totalVotantesCenso - votantesQueVotaron;
    const porcentajeAbstencion = ((totalAbstencion / totalVotantesCenso) * 100).toFixed(2);

    // 2. Procesar Resultados por Candidato
    candidatos.forEach(cand => {
        // Obtenemos info extra del candidato desde la lista de votantes
        const infoPersonal = votantes.find(v => String(v.id) === String(cand.id));
        const ciclo = infoPersonal ? infoPersonal.ciclo : "N/A";
        const nombre = infoPersonal ? infoPersonal.nombre : "Candidato Desconocido";

        // Crear elemento visual para el resultado
        const div = document.createElement('div');
        div.className = "result-item d-flex justify-content-between align-items-center border-bottom py-2";
        div.innerHTML = `
            <div>
                <span class="fw-bold">${nombre}</span> 
                <small class="text-muted">(Ciclo ${ciclo})</small>
            </div>
            <span class="badge bg-primary rounded-pill">${cand.votos} votos</span>
        `;
        listaResultados.appendChild(div);
    });

    // 3. Mostrar Resumen de Abstención
    totalVotosDOM.innerHTML = `
        <div class="mt-3 p-3 bg-light text-dark rounded border">
            <p class="mb-1"><strong>Total Censo:</strong> ${totalVotantesCenso} estudiantes</p>
            <p class="mb-1"><strong>Votos Registrados:</strong> ${votantesQueVotaron}</p>
            <p class="mb-0 text-danger"><strong>Abstención:</strong> ${totalAbstencion} personas (${porcentajeAbstencion}%)</p>
        </div>
    `;
}

/**
 * LÓGICA DEL JURADO Y CIERRE DE URNA
 * Se asegura de que los botones existan antes de asignar eventos.
 */
    // 1. Captura de elementos con nombres exactos
    const btnMaestro = document.getElementById('btn-maestro');
    const zonaClave = document.getElementById('zona-clave');
    const btnConfirmarClave = document.getElementById('btn-confirmar-clave');
    const inputClave = document.getElementById('input-clave-jurado');

    // 2. Evento para abrir el panel de clave
    if (btnMaestro) {
        btnMaestro.addEventListener('click', () => {
            if (btnMaestro.innerText === "Nueva Votación") {
                if(confirm("¿Deseas reiniciar todo el sistema? Se borrarán los votos actuales.")) {
                    localStorage.clear();
                    location.reload();
                }
                return;
            }
            // Muestra u oculta la zona donde se pide la contraseña
            if (zonaClave) zonaClave.classList.toggle('d-none');
        });
    }

    // 3. Evento para validar la clave
    if (btnConfirmarClave) {
        btnConfirmarClave.addEventListener('click', () => {
            const CLAVE_CORRECTA = "1234"; // Cambia esta clave si deseas
            
            if (inputClave && inputClave.value === CLAVE_CORRECTA) {
                alert("✅ Clave aceptada. Iniciando conteo...");
                ejecutarCierreDeUrna();
            } else {
                alert("❌ Clave incorrecta. Inténtalo de nuevo.");
                if (inputClave) inputClave.value = "";
            }
        });
    }

/**
 * Función que procesa el escrutinio final
 */
function ejecutarCierreDeUrna() {
    const btnMaestro = document.getElementById('btn-maestro');
    const zonaClave = document.getElementById('zona-clave');
    const seccionVotacion = document.getElementById('seccion-registro');
    const contenedorResultados = document.getElementById('contenedor-resultados');

    // Cambiar estado visual del botón
    if (btnMaestro) {
        btnMaestro.innerText = "Nueva Votación";
        btnMaestro.classList.replace('btn-danger', 'btn-success');
    }

    // Ocultar votación y panel de clave
    if (zonaClave) zonaClave.classList.add('d-none');
    if (seccionVotacion) seccionVotacion.classList.add('d-none');

    // Mostrar resultados y ejecutar renderizado
    if (contenedorResultados) {
        contenedorResultados.classList.remove('d-none');
        renderizarEscrutinio(); // Esta es la función que cuenta votos por ciclo
    }
}

Toastify({
    text: "This is a toast",
    duration: 3000
}).showToast();