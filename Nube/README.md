# Cloud

En esta carpeta está el trabajo del MPO de Fundamentos de Computación en la Nube. He documentado cómo MoGarry, mi empresa simulada, podría desplegar parte de su infraestructura en Amazon Web Services siguiendo un modelo híbrido (parte en el datacenter propio, parte en cloud).

## Archivos

- `cloud-mogarry.pdf` — Documento completo con la investigación, la arquitectura y la estimación de costes.

## Qué hay dentro del PDF

He dividido el trabajo en cinco bloques.

**Investigación del proveedor.** Comparativa rápida entre AWS, Azure y Google Cloud con sus puntos fuertes y débiles. Me he decidido por AWS por tres razones principales: tiene el catálogo de servicios más amplio (más de 200), las certificaciones de AWS son las más pedidas en ofertas de empleo en España (lo que hace que la formación tenga retorno directo), y su modelo de pago por uso al segundo permite a una consultora como MoGarry escalar sin compromisos de permanencia.

**Arquitectura propuesta.** He optado por un modelo híbrido porque tirar 20 años de inversión en hardware propio para migrar todo a cloud no tendría sentido económico. La regla que he seguido es: en el datacenter propio se queda lo que tiene baja latencia crítica o requiere control físico (SOC 24/7, firewalls perimetrales, electrónica core, almacenamiento principal); en AWS se mueve lo que necesita elasticidad o exposición a internet (web pública, VMs de cliente, base de datos del CRM, backups offsite). En el PDF se ve un diagrama visual con todos los servicios y las conexiones entre la VPC de AWS y la red del datacenter mediante un túnel VPN site-to-site.

**Servicios cloud utilizados.** He explicado uno a uno qué servicios he elegido y para qué los uso: EC2 para las máquinas virtuales (una t3.medium para la web pública y dos t3.large para VMs de clientes), RDS PostgreSQL gestionado para la base de datos del CRM, S3 Standard para contenido web y S3 Glacier Deep Archive para los backups offsite, VPC para la red privada virtual, Route 53 como DNS con failover, Application Load Balancer para repartir el tráfico HTTPS, CloudFront como CDN, Site-to-Site VPN para conectar con el datacenter, y CloudWatch e IAM para monitorización y gestión de identidades.

**Estimación de costes.** Tabla detallada con doce servicios desglosados, calculada con la AWS Pricing Calculator oficial sobre la región eu-west-1 (Irlanda). El total mensual estimado son unos 398 dólares, que en euros se queda en torno a 365 al mes (unos 4.380 al año). En el PDF también explico el efecto del Free Tier (que rebaja el coste real durante el primer año) y de las Reserved Instances (que pueden aportar un 30-40 por ciento de descuento adicional si se firma compromiso de un año).

**Conclusiones.** Reflexión sobre por qué el modelo híbrido tiene más sentido para MoGarry que una migración total, por qué AWS es la apuesta más segura profesionalmente y dónde tengo más dudas (sobre todo en el volumen real de tráfico de la VPN, donde a futuro habría que valorar pasar a AWS Direct Connect si crece mucho la sincronización de datos).

## Cómo encaja con el resto del proyecto

La arquitectura mantiene el datacenter Tier III on-premise que tengo documentado en el módulo de Hardware, así que el inventario del XML del módulo de Lenguajes de Marcas sigue siendo válido para la parte on-premise. La base de datos del CRM con tablas de clientes, contratos e incidencias del módulo de Bases de Datos es la que se desplaza a Amazon RDS PostgreSQL. La topología de Cisco Packet Tracer del módulo de Redes se extiende mediante el túnel VPN site-to-site hasta la VPC de AWS para mantener la conectividad entre ambos entornos.
