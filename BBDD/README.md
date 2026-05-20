# MoGarry Corp. - Sistema de Gestión de Infraestructura y Facturación

Este proyecto implementa una base de datos relacional robusta en **PostgreSQL** para la gestión integral de una empresa de servicios IT (MoGarry Corp.). El sistema cubre desde la jerarquía física del datacenter hasta el ciclo de vida de tickets de soporte y la facturación comercial.

## 📋 Descripción del Proyecto
MoGarry Corp. requiere una solución para centralizar su información operativa. El diseño se basa en tres pilares fundamentales:
1.  **Gestión Comercial:** Clientes, servicios comerciales y facturación detallada.
2.  **Infraestructura Física:** Control de salas, racks y activos de red (equipos).
3.  **Operaciones y Soporte:** Gestión de empleados, tipificación de incidencias y sistema de tickets con historial de seguimiento.

## 📂 Estructura del Repositorio / Entrega
* `bbdd-memoria.pdf`: Documentación detallada con el análisis de la realidad y decisiones de diseño.
* `Creación de tablas.pdf`: Script DDL con la definición de tablas, tipos de datos y restricciones (PK, FK, CHECK).
* `Inserción de datos.pdf`: Script DML con datos de prueba coherentes para validar el sistema.
* `Script de consultas.pdf`: Consultas SQL avanzadas para la extracción de métricas y KPIs.

## ⚙️ Tecnologías Utilizadas
* **Motor de BD:** PostgreSQL 14+
* **Herramienta de Gestión:** pgAdmin 4
* **Modelado:** Diagrama Entidad-Relación (ER) y Esquema Relacional.

## 🛠️ Instalación y Uso
1.  Ejecutar el contenido de `Creación de tablas.pdf` en una base de datos nueva para generar la estructura.
2.  Cargar los datos iniciales mediante el script de `Inserción de datos.pdf`.
3.  Utilizar el `Script de consultas.pdf` para realizar pruebas de rendimiento y extracción de información.

## 📐 Diseño de la Base de Datos
El modelo cuenta con **14 tablas** normalizadas en 3ª Forma Normal (3FN), garantizando la integridad referencial y eliminando redundancias innecesarias. 
* **Relación Clave:** Los equipos se ubican en racks, los cuales pertenecen a salas específicas, manteniendo la trazabilidad física.
* **Integridad de Negocio:** Se han implementado disparadores lógicos y restricciones `CHECK` para validar estados de facturas y fechas de tickets.

---
**Proyecto Intermodular - 1º ASIR**
Módulo: Gestión de Bases de Datos
