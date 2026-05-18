# Hardware

En esta carpeta está el trabajo del módulo de Fundamentos de Hardware. He documentado las necesidades de hardware de MoGarry, mi empresa simulada para el Proyecto Intermodular, y he propuesto las configuraciones físicas para cubrir cada perfil de puesto y el datacenter.

## Archivos

- `hardware-mogarry.pdf` — Documento completo con el análisis y las configuraciones.

## Qué hay dentro del PDF

He dividido el trabajo en cinco bloques.

**Análisis de necesidades.** Para empezar he clasificado los puestos de la empresa en tres grupos: 25 PCs de oficina para el personal técnico (analistas del SOC, ingenieros de soporte, desarrolladores cloud), 8 PCs de administración para gestión, contabilidad, dirección y comercial, y los 10 equipos del datacenter que ya tenía documentados en el inventario XML del módulo de Lenguajes de Marcas (servidores HPE, switches Cisco, firewalls Palo Alto y Fortinet, NAS NetApp, router Cisco y SAI APC).

**Componentes principales.** Aquí explico qué función tiene cada parte de un equipo: CPU, placa base, RAM, almacenamiento, GPU, fuente de alimentación, refrigeración y periféricos. Además distingo entre componentes de PC de oficina y de servidor, porque en un servidor hay cosas como la RAM ECC, las fuentes redundantes N+1 o la gestión remota iLO que en un PC doméstico no tienen sentido.

**Configuraciones propuestas.** He concretado tres configuraciones con modelos reales y precios aproximados. El PC de oficina lo he montado con Intel Core i5-14500, 16 GB de DDR5 y SSD NVMe de 512 GB, sobre los 900 euros. El de administración va con i7-14700, 32 GB y SSD de 1 TB, sobre 1.500 euros. Y el servidor es un HPE ProLiant DL380 Gen11 con dos Xeon Silver, 256 GB de RAM ECC, almacenamiento dual NVMe + SAS con RAID, y fuentes redundantes, unos 15.000 euros.

**Sistema de almacenamiento.** Comparativa entre HDD, SSD SATA, SSD NVMe y SSD SAS, cuándo conviene cada uno y a qué precio. Explicación de las arquitecturas DAS, NAS y SAN, los niveles de RAID (0, 1, 5, 6, 10) y la estrategia de backup siguiendo la regla 3-2-1 con la replicación SnapMirror entre los dos NAS NetApp y el backup diario offsite en AWS Glacier.

**Comparativa y evolución.** Tres escenarios de crecimiento de la empresa (crecer a 60 empleados, renovación tecnológica a 3-5 años, diversificación a IA con GPUs) y una reflexión sobre decisiones que reconsideraría si tuviese que rehacer el dimensionado desde cero.

## Cómo encaja con el resto del proyecto

Los equipos del datacenter que aquí justifico técnicamente son los mismos que aparecen en el `datos.xml` del módulo de Lenguajes de Marcas y en la topología de Cisco Packet Tracer del módulo de Redes. Los servidores HPE DL380 son los que en el módulo de Sistemas Operativos documento corriendo VMware ESXi, y en el módulo de Bases de Datos las tablas `salas` y `equipos` reflejan toda esta información. En la propuesta de arquitectura cloud del MPO mantengo este hardware on-premise para SOC y datos sensibles, mientras la elasticidad se cubre con AWS.
