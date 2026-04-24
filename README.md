# SECRE - Sistema Electoral Colegio Reggio Emilia

**SECRE** es una solución tecnológica moderna diseñada para digitalizar y agilizar el proceso de votación estudiantil del Colegio Reggio Emilia. El sistema prioriza la transparencia, la facilidad de uso y la integridad de los datos.

## Características Principales

* **Votación Digital Dinámica**: Generación de candidatos en tiempo real mediante manipulación del DOM.
* **Gestión de Votos**: Sistema de conteo automático con persistencia de datos.
* **Seguridad del Jurado**: Panel de control protegido por clave maestra para el cierre de urnas y visualización de resultados.
* **Validación de Votantes**: Control de duplicados para asegurar que cada estudiante participe una sola vez.
* **Diseño Responsive**: Interfaz adaptada para tablets, laptops y computadoras de escritorio mediante Bootstrap 5.

## Tecnologías Utilizadas

* **HTML5 Semántico**: Para una estructura accesible y clara.
* **CSS3 (Custom Properties & Flexbox/Grid)**: Estilizado moderno con el esquema de colores institucional (#070708, #fa7b04).
* **JavaScript (ES6+)**: Lógica basada en clases, programación funcional y manejo de eventos.
* **Bootstrap 5**: Framework para la agilidad en el diseño responsivo.
* **SweetAlert**: Para una comunicación elegante con el usuario mediante alertas interactivas.
* **LocalStorage**: Persistencia de datos del lado del cliente sin necesidad de bases de datos externas en esta fase.

## Cómo Opera el Sistema

### 1. Identificación
El estudiante ingresa su numero de cédula en la sección de registro, si el documento no existe, mostrará un mensaje informando que el documento no registrado en el censo. El sistema valida que el campo no esté vacío y que el documento no figure en la lista de `votantesRegistrados` almacenada en el `localStorage`.

### 2. Selección y Voto
El sistema despliega dinámicamente las tarjetas de los candidatos. Al pasar el puntero por encima del botón "Votar" este se resalta visualmente para confirmar la elección antes de procesar el voto.

### 3. Cierre de Urna (Rol Jurado)
Al finalizar la jornada, el jurado accede al botón "Cerrar Urna". Para visualizar los resultados, se debe ingresar una clave maestra (1234). Una vez validada, el sistema:
* Bloquea los botones de votación.
* Calcula el escrutinio final en tiempo real.
* Muestra el total de votos emitidos y el desglose por candidato.
* También se ha incluido un porcentaje de abstención con fines informativos

### 4. Reinicio del Sistema
El jurado tiene la opción de reiniciar el simulador, lo cual limpia el `localStorage` y prepara la interfaz para un nuevo ciclo electoral,  sin embargo, es posible continuar con el proceso de votación, si elige que no.

## Estructura del Proyecto

```text
├── css/
│   └── main.css            # Estilos personalizados y diseño responsive
├── assets/
│   ├── icons/              # Iconos e imágenes de la aplicación con identidad institucional
│   ├── img/                # Fotografías de los candidatos
├── js/
│   └── main.js             # Lógica central, clases y manejo del DOM
├── data/json
│       ├── votantes.json   # Listado de votantes
│       └── candidatos.json # Listado de los candidatos
├── documentos/             # Cartilla-Elecciones-Gobierno-Escolar.pdf (Reglamento para candidatos y votantes) 
├── pages/
│   ├── candidatos.html # Interfaz principal de votación
│   └── reglamento.html # Marco legal del proceso
└── index.html          # Portal de inicio y noticias
