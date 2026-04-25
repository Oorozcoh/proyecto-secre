/**
 * SECRE - Sistema Electoral Colegio Reggio Emilia
 * Entrega Final - Proyecto Integrador Coderhouse JavaScript
 * Desarrollado por: Oscar Orozco
 */

let candidatos = [];
let votantes = [];

async function inicializarSistema() {
    try {
        const resCand = await fetch('../data/json/candidatos.json');
        const resVot = await fetch('../data/json/votantes.json');
        
        const candidatosBase = await resCand.json();
        const votantesBase = await resVot.json();

        candidatos = JSON.parse(localStorage.getItem('candidatos')) || candidatosBase;
        votantes = JSON.parse(localStorage.getItem('votantes')) || votantesBase;

        localStorage.setItem('candidatos', JSON.stringify(candidatos));
        localStorage.setItem('votantes', JSON.stringify(votantes));

        console.log("Sistema sincronizado con LocalStorage");
    } catch (error) {
        console.error("Error cargando datos:", error);
    }
}

// Identificación del Votante
const inputId = document.getElementById('IdVotante');
const feedback = document.getElementById('mensaje-validacion');
const contenedorCards = document.querySelector('.row.justify-content-center.g-4');

inputId.addEventListener('input', (e) => {
    const idIngresado = e.target.value.trim();
    
    if (votantes.length === 0) return;

    if (idIngresado.length < 4) { 
        contenedorCards.innerHTML = "";
        feedback.innerText = "";
        return;
    }

    const usuario = votantes.find(v => String(v.id).trim() === idIngresado);

    if (!usuario) {
        feedback.innerHTML = `<span class="text-warning">Documento no registrado en el censo.</span>`;
        contenedorCards.innerHTML = "";
    } else if (usuario.voto === "true" || usuario.voto === true) {
        Swal.fire({
            title: `¡Hola, ${usuario.nombre}!`,
            text: 'Parece que ya has votado. Gracias por tu participación.',
            icon: 'alert',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#fa1404'
        });
        contenedorCards.innerHTML = "";
    } else {
        Swal.fire({
            title: `¡Hola, ${usuario.nombre}!`,
            text: 'Por favor, selecciona al candidato de tu preferencia.',
            icon: 'info',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#fa7b04'
        });
    mostrarCandidatosPorCiclo(usuario);
    }
});

inicializarSistema();

/**
 * Renderiza las tarjetas de candidatos filtradas por el Ciclo alcual pertenece el votante.
 * /*@param {Object} votanteActivo
 */
function mostrarCandidatosPorCiclo(votanteActivo) {
    contenedorCards.innerHTML = "";

    // Ciclo para buscar elcandidato en el array de 'votantes' usando el ID
    const candidatosPermitidos = candidatos.filter(cand => {
        const infoComoVotante = votantes.find(v => String(v.id).trim() === String(cand.id).trim());
        return infoComoVotante && String(infoComoVotante.ciclo) === String(votanteActivo.ciclo);
    });

    if (candidatosPermitidos.length === 0) {
        contenedorCards.innerHTML = `
            <div class="col-12 text-center mt-4">
                <p class="alert alert-warning">No hay candidatos registrados para el Ciclo ${votanteActivo.ciclo}.</p>
            </div>`;
        return;
    }

    candidatosPermitidos.forEach(cand => {
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
 * Registra el voto, actualiza los contadores y marca al votante con True para indicar que ya votó. Luego guarda todo en LocalStorage y muestra una alerta de confirmación.
 */
function procesarVoto(idCandidato, idVotante) {

    const candidato = candidatos.find(c => String(c.id) === String(idCandidato));
    if (candidato) {
        candidato.votos = (candidato.votos || 0) + 1;
    }

    const votanteIndex = votantes.findIndex(v => String(v.id) === String(idVotante));
    if (votanteIndex !== -1) {
        votantes[votanteIndex].voto = true;
    }

    localStorage.setItem('candidatos', JSON.stringify(candidatos));
    localStorage.setItem('votantes', JSON.stringify(votantes));

    Swal.fire({
        title: "¡Voto Registrado!",
        text: "Gracias por participar en SECRE",
        icon: "success"
    }).then(() => {
        location.reload();
        scrollTo({ top: 0, behavior: 'smooth' });
    });
}
/**
 * Realiza el escrutinio final, calcula abstención y muestra resultados por ciclo.
 */
function renderizarResultados() {
    const listaResultados = document.getElementById('lista-resultados');
    const totalVotosDOM = document.getElementById('total-votos-dom');
    
    listaResultados.innerHTML = "";

    const totalVotantesCenso = votantes.length;
    const votantesQueVotaron = votantes.filter(v => v.voto === true || v.voto === "true").length;
    const totalAbstencion = totalVotantesCenso - votantesQueVotaron;
    const porcentajeAbstencion = ((totalAbstencion / totalVotantesCenso) * 100).toFixed(2);

    candidatos.forEach(cand => {
        const infoPersonal = votantes.find(v => String(v.id) === String(cand.id));
        const ciclo = infoPersonal ? infoPersonal.ciclo : "N/A";
        const nombre = infoPersonal ? infoPersonal.nombre : "Candidato Desconocido";

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

    // Resumen del censo.
    totalVotosDOM.innerHTML = `
        <div class="mt-3 p-3 bg-light text-dark rounded border">
            <p class="mb-1"><strong>Total Censo:</strong> ${totalVotantesCenso} estudiantes</p>
            <p class="mb-1"><strong>Votos Registrados:</strong> ${votantesQueVotaron}</p>
            <p class="mb-0 text-danger"><strong>Abstención:</strong> ${totalAbstencion} personas (${porcentajeAbstencion}%)</p>
        </div>
    `;
}

    const btnMaestro = document.getElementById('btn-maestro');
    const zonaClave = document.getElementById('zona-clave');
    const btnConfirmarClave = document.getElementById('btn-confirmar-clave');
    const inputClave = document.getElementById('input-clave-jurado');

    if (btnMaestro) {
        btnMaestro.addEventListener('click', () => {
            if (btnMaestro.innerText === "Nueva Votación") {
                Swal.fire({
                    title: "¿Deseas reiniciar el sistema?",
                    text: "Esto borrará los votos actuales y reiniciará la votación.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Sí, reiniciar",
                    cancelButtonText: "No, mantener resultados y continuar la votación"
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.clear();
                        location.reload();
                    }else {location.reload();
                    }   
                });
                }
            if (zonaClave) zonaClave.classList.toggle('d-none');
        });
    }

    if (btnConfirmarClave) {
        btnConfirmarClave.addEventListener('click', () => {
            const CLAVE_CORRECTA = "1234";
            
            if (inputClave && inputClave.value === CLAVE_CORRECTA) {
                Swal.fire("Clave aceptada", "Iniciando conteo.", "success");
                ejecutarCierreDeUrna();
            } else {
                Swal.fire("Clave incorrecta", "Inténtalo de nuevo.", "error");
                if (inputClave) inputClave.value = "";
            }
        });
    }

function ejecutarCierreDeUrna() {
    const btnMaestro = document.getElementById('btn-maestro');
    const zonaClave = document.getElementById('zona-clave');
    const seccionVotacion = document.getElementById('seccion-registro');
    const contenedorResultados = document.getElementById('contenedor-resultados');

    if (btnMaestro) {
        btnMaestro.innerText = "Nueva Votación";
        btnMaestro.classList.replace('btn-danger', 'btn-success');
    }

    if (zonaClave) zonaClave.classList.add('d-none');
    if (seccionVotacion) seccionVotacion.classList.add('d-none');

    // Mostrar resultados y ejecutar renderizado
    if (contenedorResultados) {
        contenedorResultados.classList.remove('d-none');
        renderizarResultados();
    }
}

function identificarVotante() {
    const idDigitado = document.getElementById('inputId').value;
    const votanteEncontrado = votantes.find(v => String(v.id) === String(idDigitado));

    if (!votanteEncontrado) {
        Swal.fire("Error", "ID no encontrado", "error");
        return;
    }

    if (votanteEncontrado.voto === true) {
        Swal.fire("Acceso Denegado", "Este documento ya registró un voto.", "warning");
    } else {
        mostrarCandidatosPorCiclo(votanteEncontrado);
    }
}