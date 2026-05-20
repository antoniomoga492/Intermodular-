# Redes

En esta carpeta está el trabajo del módulo de Planificación y Administración de Redes. He diseñado y configurado en Cisco Packet Tracer la red interna del datacenter de MoGarry, segmentada en cuatro VLANs por departamento, con enrutamiento Inter-VLAN, simulación de salida a internet a través de un ISP y reglas de seguridad mediante listas de control de acceso (ACLs).

## La red de MoGarry

He diseñado una red con **4 VLANs** principales que se corresponden con los departamentos de la empresa, más una VLAN de tránsito que une los switches:

- **VLAN 10 — Administradores** (192.168.10.0/24): puestos de la oficina técnica, perfiles con permisos elevados.
- **VLAN 20 — Oficina** (192.168.20.0/24): el resto del personal de oficina (administración, comercial, RRHH).
- **VLAN 30 — Invitados** (192.168.30.0/24): red WiFi separada para visitas y clientes que vienen a reuniones.
- **VLAN 40 — Servidores** (192.168.40.0/24): donde viven los servidores de producción del datacenter (incluido el servidor de dominio del módulo de Sistemas Operativos, con IP `192.168.40.10`).
- **VLAN 99 — Tránsito** (192.168.99.0/24): VLAN entre el switch multicapa y el router de salida.

La idea es que cada departamento esté en su propia subred, que el tráfico entre VLANs pase obligatoriamente por el switch multicapa (donde aplico las ACLs), y que los invitados estén completamente aislados de los servidores críticos.

## Qué hay dentro del PDF

He dividido el documento en siete bloques que cubren toda la configuración.

**Diseño de la topología.** El punto de partida es la topología física en Packet Tracer: switches de acceso por departamento, un switch multicapa en el centro que hace el enrutamiento entre VLANs, un router de salida, y un router que simula el ISP. Todos los equipos están etiquetados y conectados por interfaces específicas para que las trazas sean reproducibles.

**Configuración de las VLANs.** En cada switch de acceso he creado las VLANs con el comando `vlan` seguido del ID y luego `name` con el nombre del departamento. Las VLANs hay que crearlas en todos los switches que las van a propagar para que el tráfico encuentre el camino, aunque el switch en cuestión no tenga puertos de esa VLAN.

**Punto de acceso de la VLAN "Invitados".** Para los invitados he configurado un Access Point inalámbrico con SSID "WIFI-Invitados" y autenticación WPA-PSK con contraseña "MoGarryyyy" y cifrado AES. Como los invitados llegan con dispositivos portátiles (móviles, tablets) que cambian constantemente, en lugar de IPs estáticas les asigno IPs dinámicas por DHCP: cuando alguien se desconecta, su IP queda libre para el siguiente. Lo he probado simulando un Smartphone que recibe la IP `192.168.30.2` con gateway `192.168.30.1` y DNS apuntando al servidor de la empresa.

**Enrutamiento Inter-VLAN (Core Switch).** En el switch multicapa he activado el routing de Capa 3 con `ip routing` y he creado una interfaz virtual por cada VLAN (`interface vlan 10`, `vlan 20`, etc.), asignándole a cada una la IP que va a ser la puerta de enlace de su subred (`.1`). Así, cuando un host de Administradores quiere hablar con un host de Servidores, su tráfico llega al switch multicapa que lo enruta entre VLANs. Además he metido una ruta estática por defecto hacia el router de salida (`ip route 0.0.0.0 0.0.0.0 192.168.99.1`).

**Configuración de salida a la red.** El router de salida tiene dos interfaces: `g0/1` mirando a la red interna (192.168.99.1) y `g0/0` mirando al ISP (10.0.0.2). En este router he configurado el enrutamiento estático bidireccional: una ruta de retorno hacia el switch multicapa para el tráfico interno y una ruta por defecto hacia el ISP (10.0.0.1) para todo lo demás.

**Configuración de la interfaz Loopback y ruta hacia la LAN.** Para simular un servidor externo en internet he configurado el router del ISP con una interfaz Loopback 0 con IP `8.8.8.8` (mimetizando un DNS público real para que las pruebas sean realistas) y una ruta estática hacia el rango interno `192.168.0.0/16` apuntando al router de salida. Así los hosts internos pueden hacer ping a 8.8.8.8 y comprobar que la salida a internet funciona.

**Configuración de ACLs.** La parte más interesante en términos de ciberseguridad. He configurado tres listas de acceso extendidas (110, 120 y 130) aplicando el principio de **menor privilegio**: en lugar de "permitir todo y bloquear lo malo", he hecho lo contrario, "denegar por defecto y permitir solo lo necesario". Los aspectos clave son:
- Desde Administradores y Oficina se permite tráfico DNS y HTTP/HTTPS específico hacia los servidores, no acceso libre.
- Desde la VLAN de invitados (30) se **deniega explícitamente** cualquier intento de conexión hacia la VLAN crítica de servidores (40). Aunque el invitado descubra el rango interno por error, no puede llegar a los servidores.
- Se permite el resto del tráfico para no romper la navegación normal a internet.

## Cómo encaja con el resto del proyecto

Esta red es la base sobre la que se apoyan todos los demás módulos. La IP `192.168.40.10` del servidor de la VLAN de Servidores es exactamente la misma que aparece en el módulo de Sistemas Operativos como controlador de dominio Windows Server 2019. Los equipos físicos que tienen IP asignada en el inventario XML del módulo 0373 (los HPE ProLiant, los Cisco Nexus, los firewalls Palo Alto y Fortinet, el NAS NetApp) son los que aparecen aquí conectados, y los mismos que se justifican técnicamente en el módulo de Hardware. En la propuesta cloud del MPO, esta red se extiende mediante un túnel VPN site-to-site hasta la VPC de AWS para conectar el datacenter on-premise con los recursos cloud.

## Cómo abrir el archivo de Packet Tracer

Para revisar la topología y las configuraciones de cada equipo en vivo:

1. Abrir **Cisco Packet Tracer** (versión 8.x o superior).
2. `File > Open` y seleccionar `MoGarry.pkt`.
3. Hacer click sobre cualquier dispositivo y pestaña `CLI` para ver o modificar la configuración.
4. Para probar la conectividad, abrir un equipo terminal o smartphone y usar `ping` desde la línea de comandos.

## Capturas

En el PDF aparecen capturas del Cisco Packet Tracer de todos los pasos: topología base, segmentación coloreada por VLANs, configuración del Access Point, configuración del Smartphone con DHCP, salida CLI de cada router y switch con los comandos ejecutados, y la lista completa de las ACLs aplicadas.
