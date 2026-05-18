<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:template match="/inventario">
        <html lang="es">
            <head>
                <meta charset="UTF-8"/>
                <title>MoGarry · Inventario del Datacenter</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
                    body { background: #0d0d12; color: #e0e0e0; padding: 30px; }

                    h1 { color: #00f5ff; font-size: 2rem; margin-bottom: 8px; letter-spacing: 2px; }
                    h1::after { content: '.'; color: #ff00c8; }
                    h2 { color: #00f5ff; margin: 30px 0 12px; font-size: 1.3rem; border-left: 3px solid #ff00c8; padding-left: 10px; }

                    .meta { color: #888; font-size: 0.9rem; margin-bottom: 6px; }
                    .meta strong { color: #00ff88; }

                    .grid-salas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
                    .sala-card { background: #1a1a24; border: 1px solid #2a2a3a; border-left: 3px solid #00f5ff; padding: 16px; border-radius: 4px; }
                    .sala-card h3 { color: #fff; font-size: 1rem; margin-bottom: 8px; }
                    .sala-card p { font-size: 0.85rem; color: #aaa; margin: 4px 0; }
                    .sala-card .id { color: #ff00c8; font-family: 'Courier New', monospace; font-size: 0.75rem; }

                    table { width: 100%; border-collapse: collapse; background: #1a1a24; border-radius: 4px; overflow: hidden; }
                    th { background: #00f5ff; color: #0d0d12; padding: 12px 10px; text-align: left; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }
                    td { padding: 10px; border-bottom: 1px solid #2a2a3a; font-size: 0.9rem; }
                    tr:hover td { background: #22222e; }

                    .badge { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; }
                    .badge-operativo { background: #00ff88; color: #000; }
                    .badge-mantenimiento { background: #ffb800; color: #000; }
                    .badge-almacen { background: #888; color: #000; }
                    .badge-baja { background: #ff3344; color: #fff; }
                    .badge-tipo { background: transparent; border: 1px solid #ff00c8; color: #ff00c8; }

                    .id-equipo { font-family: 'Courier New', monospace; color: #00f5ff; }
                    .ip { font-family: 'Courier New', monospace; color: #00ff88; font-size: 0.85rem; }

                    footer { margin-top: 30px; color: #555; font-size: 0.8rem; text-align: center; border-top: 1px solid #2a2a3a; padding-top: 16px; }
                </style>
            </head>
            <body>
                <h1>MoGarry — Inventario del Datacenter</h1>

                <p class="meta">Empresa: <strong><xsl:value-of select="empresa/nombre"/></strong> · CIF: <xsl:value-of select="empresa/cif"/></p>
                <p class="meta">Fecha del inventario: <xsl:value-of select="empresa/fecha-inventario"/> · Responsable: <xsl:value-of select="empresa/responsable"/></p>
                <p class="meta">Versión del inventario: <xsl:value-of select="@version"/></p>

                <h2>Salas del Datacenter</h2>
                <div class="grid-salas">
                    <xsl:for-each select="salas/sala">
                        <div class="sala-card">
                            <p class="id"><xsl:value-of select="@id"/></p>
                            <h3><xsl:value-of select="nombre"/></h3>
                            <p>Capacidad: <xsl:value-of select="capacidad-u"/>U</p>
                            <p>Temperatura: <xsl:value-of select="temperatura-objetivo"/>ºC</p>
                            <p>Certificación: <xsl:value-of select="certificacion"/></p>
                        </div>
                    </xsl:for-each>
                </div>

                <h2>Equipos (<xsl:value-of select="count(equipos/equipo)"/> registrados)</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tipo</th>
                            <th>Fabricante / Modelo</th>
                            <th>Nº Serie</th>
                            <th>Ubicación</th>
                            <th>IP</th>
                            <th>Estado</th>
                            <th>Garantía hasta</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:for-each select="equipos/equipo">
                            <tr>
                                <td class="id-equipo"><xsl:value-of select="@id"/></td>
                                <td><span class="badge badge-tipo"><xsl:value-of select="@tipo"/></span></td>
                                <td>
                                    <strong><xsl:value-of select="fabricante"/></strong><br/>
                                    <small style="color:#888"><xsl:value-of select="modelo"/></small>
                                </td>
                                <td style="font-family:monospace;font-size:0.8rem;color:#aaa"><xsl:value-of select="numero-serie"/></td>
                                <td>
                                    <xsl:value-of select="ubicacion/@sala"/> ·
                                    <xsl:value-of select="ubicacion/@rack"/> ·
                                    <xsl:value-of select="ubicacion/@unidad"/>
                                </td>
                                <td class="ip">
                                    <xsl:choose>
                                        <xsl:when test="red/ip"><xsl:value-of select="red/ip"/></xsl:when>
                                        <xsl:otherwise>—</xsl:otherwise>
                                    </xsl:choose>
                                </td>
                                <td>
                                    <span>
                                        <xsl:attribute name="class">badge badge-<xsl:value-of select="@estado"/></xsl:attribute>
                                        <xsl:value-of select="@estado"/>
                                    </span>
                                </td>
                                <td><xsl:value-of select="fin-garantia"/></td>
                            </tr>
                        </xsl:for-each>
                    </tbody>
                </table>

                <footer>
                    Generado mediante transformación XSLT del archivo <code>datos.xml</code> ·
                    MoGarry Corp. · Proyecto Intermodular 1º ASIR
                </footer>
            </body>
        </html>
    </xsl:template>

</xsl:stylesheet>