# Lenguaje de Marcas · MoGarry Corp.

Trabajo del módulo de **Lenguajes de Marcas y Sistemas de Gestión de Información (0373)** de 1º de Administración de Sistemas Informáticos y Redes (ASIR), curso 2025/26 en The Power FP.

## Sobre la empresa

Para este trabajo he simulado una empresa llamada **MoGarry Corp.**, una consultora IT especializada en Cloud, Ciberseguridad e Infraestructura crítica. Da soporte tecnológico a pequeñas y medianas empresas en tres áreas: migraciones cloud, servicios de SOC operativo 24/7 y operación de un datacenter Tier III con redundancia eléctrica N+1. Tiene tres salas de servidores (Producción, Backup y SOC), una capacidad total de 480U de rack y un equipo técnico de tres perfiles especializados.

He elegido esta temática porque encaja bien con la rama de ASIR y me deja un escenario realista en el que aplicar todo lo que se pide en el módulo: una web corporativa con varias páginas, un sistema de información estructurada con XML para representar el inventario de equipos del datacenter, un XSD que valide ese XML y una hoja de estilos XSLT que lo transforme en una página HTML.

## La web corporativa

He maquetado cuatro páginas que comparten una misma estructura: menú lateral con la etiqueta `<aside>` que se repite en todas, y un contenedor principal `<main>` para el contenido. He elegido un tema oscuro con colores cian, magenta y verde porque me daba un aspecto tecnológico que encaja con una empresa de ciberseguridad.

- **`index.html`**: presentación de la empresa con un texto de bienvenida, contadores animados (clientes activos, uptime, años de experiencia) y tres tarjetas con la misión, visión y valores.
- **`equipo.html`**: cumple el requisito obligatorio de las seis tarjetas mínimo. He puesto tres tarjetas de servicios (Consultoría IT, Ciberseguridad, Cloud) y tres del equipo humano (Vladimir Ivanov, Nerea Gutiérrez, Sergio Manzano).
- **`infraestructura.html`**: información técnica del datacenter con especificaciones, barras de uptime animadas con `IntersectionObserver`, estadísticas de capacidad y un bloque con los fabricantes y tecnologías utilizadas.
- **`contacto.html`**: formulario validado por JavaScript con campos para nombre, email, empresa, motivo, mensaje y aceptación de privacidad, más cuatro tarjetas con información de contacto previas al formulario.

El JavaScript (`js/main.js`) está hecho a mano, sin frameworks externos, y añade el cursor personalizado, el efecto glitch en los títulos, el texto tipo máquina de escribir, el toast de notificaciones, las animaciones de los contadores y las barras de uptime, y un efecto de partículas en cada clic. Todo modularizado en funciones encapsuladas en IIFEs para no contaminar el ámbito global.

## Apartado XML / XSD / XSLT

En la carpeta `/xml` se encuentra la parte del módulo que pide específicamente el sistema de gestión de información estructurada. He representado el inventario de equipos del datacenter de MoGarry con tres salas y diez equipos físicos (servidores HPE, switches Cisco, firewalls Palo Alto y Fortinet, NAS NetApp, router Cisco y SAI APC).

Para validarlo he escrito un XSD con tipos de datos (`xs:date`, `xs:positiveInteger`, `xs:decimal`), patrones (CIF, IPv4, MAC, número de serie, código de rack), enumeraciones (tipo de equipo, estado, certificación Tier), rangos numéricos (VLAN entre 1 y 4094, temperatura entre 15 y 30 grados), cardinalidades y referencias entre nodos con `xs:ID` y `xs:IDREF`. Para demostrar que el XSD detecta los errores correctamente he creado además un archivo `datos-invalido.xml` con siete fallos intencionados, y he guardado las pruebas de validación como capturas en la carpeta `/xml/capturas`.

Como ampliación he añadido una hoja de estilos XSLT (`inventario.xsl`) que transforma el XML en una página HTML con el mismo estilo dark cyber de la web. La línea `<?xml-stylesheet type="text/xsl" href="inventario.xsl"?>` en la cabecera del `datos.xml` es la que activa la transformación: al abrirlo, en vez de ver un árbol de etiquetas, se ve un panel de gestión con las tres salas como tarjetas y una tabla con los diez equipos.

La documentación específica de esta carpeta está en `xml/README.md`, y los detalles técnicos los he incluido en el `datos.txt` general.

## Cómo abrir el proyecto

Para la web corporativa:

1. Abrir la carpeta del proyecto en Visual Studio Code.
2. Instalar la extensión **Live Server** (de Ritwick Dey).
3. Click derecho sobre `html/index.html` y elegir **Open with Live Server**.

Para ver el inventario XML renderizado con XSLT:

1. Con Live Server activo, ir a `http://127.0.0.1:5500/xml/datos.xml` en el navegador.
2. El navegador aplicará la transformación automáticamente y mostrará el inventario formateado.

Si se quiere abrir el `datos.xml` sin Live Server (haciendo doble click desde el explorador de Windows), hay que usar Firefox, porque Chrome y Edge bloquean la transformación XSLT cuando el archivo viene del disco local por motivos de seguridad.

## Autor

Proyecto realizado para la asignatura de **Lenguajes de Marcas y Sistemas de Gestión de Información (0373)** en 1º de Administración de Sistemas Informáticos y Redes (ASIR), The Power FP, modalidad presencial.