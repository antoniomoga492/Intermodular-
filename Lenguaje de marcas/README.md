# Proyecto Intermodular · MoGarry Corp.

Empresa simulada de consultoría IT especializada en Cloud, Ciberseguridad e Infraestructura crítica. Trabajo realizado para el Proyecto Intermodular de 1º de Administración de Sistemas Informáticos y Redes (ASIR) durante el curso 2025/26 en The Power FP.

## Sobre la empresa

MoGarry es una empresa que he ido construyendo a lo largo del curso para usarla como hilo conductor entre todas las asignaturas. Se dedica a dar soporte tecnológico a pequeñas y medianas empresas en tres áreas: Cloud (migraciones a AWS, Azure y Google Cloud), Ciberseguridad (con un SOC propio operativo 24/7) e Infraestructura crítica (operando un datacenter Tier III con redundancia eléctrica N+1). Tiene tres salas de servidores (Producción, Backup y SOC), una capacidad total de 480U de rack y un equipo técnico de tres perfiles especializados.

He elegido esta temática porque encaja muy bien con la rama de ASIR y porque me permite tocar todos los módulos del curso sin que parezca forzado: necesito una web corporativa para presentarla (Lenguajes de Marcas), una red para el datacenter (Redes), unos servidores que mantener (Sistemas Operativos), unos modelos físicos que justificar (Hardware), una base de datos donde guardar el inventario de equipos (BBDD) y un perfil profesional asociado (Empleabilidad).

## Estructura del repositorio

```
LENGUAJE DE MARCAS/
├── css/
│   └── styles.css           Estilos de la web (tema dark cyber)
├── html/
│   ├── index.html           Página de inicio
│   ├── equipo.html          Servicios y equipo humano
│   ├── infraestructura.html Datacenter, uptime y tecnologías
│   └── contacto.html        Formulario validado por JS
├── img/                     Imágenes (logo, equipo, datacenter)
├── js/
│   └── main.js              Cursor, glitch, typed, toast, stats, etc.
├── xml/                     Apartado XML / XSD / XSLT del módulo 0373
│   ├── capturas/            Pruebas de validación
│   ├── datos.xml            Inventario válido del datacenter
│   ├── datos-invalido.xml   Inventario con errores intencionados
│   ├── esquema.xsd          Esquema de validación
│   ├── inventario.xsl       Hoja de estilos XSLT
│   ├── evidencia-validacion.txt
│   └── README.md            Documentación específica de esta carpeta
├── datos.txt                Memoria técnica completa del proyecto
└── README.md                Este archivo
```

## Estado de los módulos del intermodular

A día de hoy llevo:

- **0373 Lenguajes de Marcas:** Hecho. Web corporativa con 4 páginas, más el apartado XML/XSD/XSLT en la carpeta `/xml`.
- **0370 Planificación y administración de Redes:** Hecho. Topología en Cisco Packet Tracer con los mismos equipos del XML.
- **0369 Implantación de Sistemas Operativos:** Casi terminado, falta documentación con capturas.
- **1709 Itinerario Personal para la Empleabilidad:** Hecho.
- **0371 Fundamentos de Hardware:** Pendiente.
- **0372 Gestión de Bases de Datos:** Pendiente.

## Apartado XML del módulo 0373

En la carpeta `/xml` se encuentra la parte del módulo 0373 que pide el intermodular específicamente: el sistema de gestión de información estructurada. He representado el inventario de equipos del datacenter de MoGarry con tres salas y diez equipos físicos (servidores, switches, routers, firewalls, NAS y SAI). Para validarlo he escrito un XSD con tipos, patrones (CIF, IP, MAC), enumeraciones, rangos y referencias entre nodos con `xs:ID` y `xs:IDREF`.

Como ampliación, también he añadido una hoja de estilos XSLT que transforma el XML en una página HTML con el mismo estilo de la web, así se ve como un panel de gestión profesional en lugar de un árbol de etiquetas. La documentación completa de esta parte está en `xml/README.md`, y los detalles técnicos los he incluido en el `datos.txt` general.

## Cómo abrir el proyecto

Para la web corporativa:

1. Abrir la carpeta del proyecto en Visual Studio Code.
2. Instalar la extensión **Live Server** (de Ritwick Dey).
3. Click derecho sobre `html/index.html` y elegir **Open with Live Server**.

Para ver el inventario XML renderizado con XSLT:

1. Con Live Server activo, ir a `http://127.0.0.1:5500/xml/datos.xml` en el navegador.
2. El navegador aplicará la transformación automáticamente y mostrará el inventario formateado.

Si se quiere abrir el `datos.xml` sin Live Server (haciendo doble click desde el explorador de Windows), hay que usar Firefox, porque Chrome y Edge bloquean la transformación XSLT cuando el archivo viene del disco local por seguridad.

## Conexión entre los módulos

Para que el intermodular tenga sentido y todo encaje, he intentado que los módulos se conecten entre ellos en vez de ser cosas sueltas:

- Los equipos que aparecen en el `datos.xml` (HPE ProLiant, Cisco Nexus, Palo Alto, NetApp, Fortinet, etc.) son los mismos que se ven en la página de infraestructura de la web y los mismos modelos que se justificarán en el módulo de Hardware.
- La topología de Cisco Packet Tracer (módulo de Redes) contiene esos mismos equipos conectados entre sí formando la red del datacenter.
- Cuando haga el módulo de Bases de Datos, las tablas `salas` y `equipos` serán exactamente las que aparecen en el XML, de manera que el XML se podrá ver como una exportación de la base de datos.
- En el módulo de Sistemas Operativos voy a documentar la instalación y configuración de los servidores que en el XML aparecen como "operativo", concretamente los HPE ProLiant DL380 con VMware vSphere.

## Autor

Proyecto realizado para la asignatura de **Lenguajes de Marcas y Sistemas de Gestión de Información (0373)** dentro del **Proyecto Intermodular de 1º de Administración de Sistemas Informáticos y Redes (ASIR)** en The Power FP, modalidad presencial.