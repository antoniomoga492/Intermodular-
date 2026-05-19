# Sistemas Operativos

En esta carpeta está el trabajo del módulo de Implantación de Sistemas Operativos. He montado el servidor de dominio de MoGarry sobre Windows Server 2019 virtualizado en VirtualBox, levantando los servicios que necesitaría la empresa para funcionar internamente: Active Directory para gestionar usuarios y permisos, DNS, una carpeta compartida con permisos por grupo, dos máquinas cliente unidas al dominio (una de oficina y otra de administración) y un sistema de copias de seguridad programado mediante Windows Server Backup.

## Archivos

- `capturas/` — Capturas de pantalla del proceso completo, ordenadas por fase.
- `README.md` — Este documento.

## Entorno de virtualización

Todo el laboratorio está montado en **VirtualBox**, virtualizando varios equipos sobre el mismo host físico. He elegido virtualización en lugar de instalación física por la flexibilidad que da: puedo hacer snapshots antes de cada paso importante, levantar y apagar máquinas según las necesite, y simular varios equipos en red sin tener varios PCs reales. Además es exactamente lo que pasa en producción: en el datacenter de MoGarry los servidores HPE ProLiant DL380 corren VMware vSphere con varias VMs encima, así que el concepto es idéntico aunque el hipervisor sea distinto.

He creado tres máquinas virtuales conectadas a una red interna llamada **Red_MoGarry**: el servidor de dominio (`WS_DNS`), una máquina de oficina con Windows 11 y una máquina de administración también con Windows 11.

## Instalación de Windows Server 2019

He empezado descargando la ISO oficial de Windows Server 2019 y creando la primera máquina virtual con nombre `WS_DNS`. Le he asignado memoria base, CPU y disco duro virtual con espacio suficiente para soportar todos los roles del servidor.

Tras la instalación lo primero que he hecho ha sido configurar la **identidad del servidor**: he entrado en el Administrador del Servidor y desde ahí he cambiado el nombre del equipo a `MOGARRY` para que sea descriptivo. También he configurado la **red estática** con los siguientes parámetros, en coherencia con la topología que diseñé en el módulo de Redes con Cisco Packet Tracer:

- Dirección IP: `192.168.40.10`
- Máscara: `255.255.255.0`
- Gateway: `192.168.40.1`

Que el servidor tenga IP estática es obligatorio: un controlador de dominio con IP dinámica no funcionaría bien porque los clientes lo buscan siempre por la misma dirección.

## Promoción a controlador de dominio y Active Directory

Con el sistema operativo limpio he ido al Administrador del Servidor, en `Administrar > Añadir roles y características`, y he marcado los dos roles que necesitaba: **Servicios de Dominio de Active Directory** y **Servidor DNS**. Al instalar el primero, Windows me ha pedido instalar también las características complementarias para que funcione completo.

Tras la instalación, en la bandera con la señal amarilla del panel superior he pulsado en **Promover este servidor a controlador de dominio**, lo que abre el asistente de configuración. Como no había un dominio previo, he elegido crear un bosque nuevo con nombre **MoGarry.local**. He establecido una contraseña de restauración para emergencias (`MoGarry_123`) y al terminar el asistente el servidor se ha reiniciado para completar la promoción. Al volver a iniciar sesión, el usuario ya aparece como `MOGARRY\Administrador`, lo que confirma que el dominio está activo.

Para verificar que el dominio se ha registrado correctamente he abierto la terminal y he usado el comando `nslookup` con `set type=any` para listar todos los registros DNS, y todo aparecía correctamente.

## Estructura de Active Directory

Con el dominio levantado he organizado el directorio en **Unidades Organizativas** que reflejan la estructura real de una empresa: he creado dos OUs principales, **Administradores** y **Oficina**, y dentro de Administradores he añadido un subgrupo llamado **Administradores Senior** para los cargos directivos.

Después he dado de alta los usuarios reales que necesita MoGarry, asignando a cada uno su contraseña:

**Administradores:**
- Elon Innovador (contraseña: `Administrador_Jefe`)
- Sergio Manzano (contraseña: `Administrador_201`)
- Nerea Gonzalez (contraseña: `Administrador_202`)

**Oficina:**
- Roberto Fernández Fernández (contraseña: `Oficina_111`)
- Vladimir Ivanov (contraseña: `Oficina_112`)
- Nerea Gutiérrez (contraseña: `Oficina_113`)

Para asignar un usuario a un grupo, click derecho sobre el usuario, propiedades, y desde ahí busqué el grupo correspondiente. Así es como Elon Innovador acabó en el grupo de Administradores en lugar de Oficina, donde lo había creado por error al principio.

## Carpeta compartida con permisos por grupo

Para demostrar el funcionamiento de los permisos a nivel de directorio, he creado en el disco local del servidor una carpeta llamada **Proyectos_secretos**. Desde sus propiedades, en la pestaña Compartir, he activado el uso compartido avanzado y le he puesto un límite de usuarios simultáneos. En la sección de permisos he otorgado **control total al grupo de Administradores** (no a usuarios individuales, que es como se hace en producción) y nada a Oficina, así solo los administradores pueden ver el contenido aunque toda la red pueda ver la carpeta listada.

Para probar que la restricción funciona, desde la máquina de Elon Innovador (que es administrador) he accedido a `\\DNS-SRV\Proyectos_secretos` con `Windows + R` y se ha abierto sin problema, mientras que un usuario de oficina recibe el correspondiente error de permisos.

## Máquinas cliente unidas al dominio

He creado dos máquinas Windows 11 para simular puestos reales. Durante la instalación me he saltado la introducción de configuración inicial usando el truco de `Shift + F10` y el comando `start ms-cxh:localonly`, que permite crear una cuenta local sin obligar a iniciar con Microsoft Account.

Una vez instalado el SO, he desactivado el firewall del servidor para permitir conexiones desde clientes (requiere permisos de administrador) y he unido la máquina al dominio: con `Windows + R` abro `sysdm.cpl`, voy a **Propiedades del sistema > Cambios en el dominio**, pongo el nombre del equipo (`Elon-Innovador` para la primera) y cambio la opción de "miembro de grupo de trabajo" por "miembro del dominio" introduciendo `MoGarry.local`. Acepta y me pide credenciales del dominio: `administrador@MoGarry.local` con la contraseña `MoGarry_123`.

La segunda máquina, dedicada a la cuenta de oficina (Vladimir Ivanov), la he configurado en **Red Interna** con nombre `Red_MoGarry` para que esté aislada del NAT y solo se hable con el servidor. Le he asignado IP estática `192.168.40.12` con máscara `255.255.255.0` y DNS apuntando al servidor (`192.168.40.10`). Para verificar la conectividad he hecho `ping 192.168.40.10` desde el CMD y respondía correctamente. Después he unido también esta máquina al dominio igual que la anterior.

## Implementación del backup

El último paso ha sido montar el sistema de copias de seguridad. Desde el Administrador del Servidor he añadido la característica **Copia de seguridad de Windows Server**, que tras la instalación pide reiniciar.

Una vez instalada, he ido a `Herramientas > Copias de seguridad de Windows Server` y en el panel de acciones he seleccionado **Programar copia de seguridad**. He configurado:

- **Tipo de copia**: servidor completo, para que también se copie el Active Directory y no solo los archivos.
- **Frecuencia**: una vez al día, a las **23:30**, para que se ejecute cuando los trabajadores ya no estén usando los equipos y no afecte al rendimiento.
- **Destino**: un disco duro dedicado únicamente a copias de seguridad. He tenido que añadir un segundo disco a la VM porque las copias no se pueden guardar en el mismo disco donde está instalado el SO.

Después he creado en el servidor una carpeta compartida llamada **DatosUsuarios** (`\\DNS-SRV\DatosUsuarios`) accesible para todos los usuarios del dominio, para que los archivos personales de cada empleado se centralicen en el servidor y entren también en la copia de seguridad.

Para que los documentos de las máquinas cliente se redirijan automáticamente a esa carpeta, he creado una **GPO** llamada **Redirección de carpetas** desde `Herramientas > Administración de directivas de grupo > [dominio] > Crear un GPO en este dominio y vincularlo aquí`. Dentro de la GPO he configurado la redirección de la carpeta Documentos con la ruta `\\DNS-SRV\DatosUsuarios`. Para que la política se aplique inmediatamente sin esperar al ciclo automático, en cada máquina cliente he ejecutado `gpupdate /force` desde el CMD y he reiniciado.

Para comprobar que la redirección funciona he abierto el Administrador de tareas en una máquina cliente y he confirmado que el disco con actividad de escritura era el del servidor, no el local, lo que demuestra que las carpetas del usuario están viviendo realmente en red.

## Cómo encaja con el resto del proyecto

Este módulo es la base sobre la que se apoya casi todo lo demás. El servidor `MOGARRY` con su Active Directory es el sistema central que autenticaría a los empleados que aparecen en las tablas de la base de datos del módulo 0372 (los mismos nombres: Vladimir Ivanov, Nerea Gutiérrez, Sergio Manzano). La IP `192.168.40.10` del servidor coincide con la dirección que diseñé en la topología de Cisco Packet Tracer del módulo de Redes, así que esto es exactamente lo que correría sobre los servidores HPE ProLiant DL380 documentados en los módulos de Hardware y Lenguajes de Marcas.

## Capturas incluidas

En `capturas/` están las imágenes del proceso completo: creación de la VM en VirtualBox, instalación del SO, configuración de identidad y red, instalación de los roles AD DS y DNS, promoción a controlador de dominio, creación de unidades organizativas y usuarios, carpeta compartida con permisos, unión de las máquinas cliente al dominio, configuración del servidor DHCP, programación del backup y configuración de la GPO de redirección de carpetas.
