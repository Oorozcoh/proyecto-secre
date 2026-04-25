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

### Estos son algunos números de documentos para hacer las pruebas, los documentos a continuación tambien son candidatos, sin embargo, las cédulas matriculadas para votar se pueden ver en el archivo votantes.json

1022008006	Ciclo Inf
1023555376	Ciclo 1.1
1013368155	Ciclo 1.2
1020324802	Ciclo 2.1
1035008428	Ciclo 2.2
1035010314	Ciclo 2.3
1020233347	Ciclo 2.4
1035007046	Ciclo 3.1
1155714088	Ciclo 3.2
1034999053	Ciclo 4.1
1034997441	Ciclo 4.2
1036454308	Ciclo 5
1034993293	Ciclo 6

Los siguientes documentos están habilitados para votar.

DOCUMENTO   CICLO
1035017001	INF
1023560034	INF
1239489895	INF
1021810084	1.1
1035015535	1.1
1239488963	1.1
89733118	1.2
1035014394	1.2
1023549651	1.2
1038874592	2.1
1036458946	2.1
1035011947	2.1
1027814510	2.2
1038874590	2.2
1033202232	2.2
1035008930	2.3
1035010473	2.3
1040577569	2.3
1039469155	2.4
1039470673	2.4
1035007434	2.4
1038266248	3.1
1195214331	3.1
1020320102	3.1
1035004798	3.2
1027742328	3.2
1046724190	3.2
1020314611	4.1
1035000831	4.1
1031942558	4.1
1027810862	4.2
1034996418	4.2
1014877618	4.2
1027741714	5
1017934463	5
1020306383	5
1017932796	6
1025894572	6
1034995243	6