# Logos — ya integrados

Los seis PNG originales del cliente están archivados en esta carpeta como fuente. Las copias en uso (referenciadas por el HTML) viven en `/assets/img/`:

| Archivo en uso | Origen | Dónde se usa |
|---|---|---|
| `logo-a360.png` | `logo_A360_color.png` | Puerta (`/`), favicon, OG de la puerta, `legal.html` |
| `logo-asesoria.png` | `logo_A360A_color.png` | Cabecera de `/asesoria/*` y OG de Asesoría |
| `logo-marketing.png` | `logo_A360m_color.png` | Cabecera de `/marketing/*` y OG de Marketing |
| `logo-a360-blanco.png` | `logo_A360_white.png` | Footer de las 8 páginas interiores (fondo oscuro) |
| `logo-a360-azul.png` | `logo_f_azul.png` | Monocromo azul, sin uso actual — disponible para prensa/impresión |
| `logo-marketing-azul.png` | `logo_f_azul_ttl.png` | Monocromo azul con título, sin uso actual |

**Pendiente si el cliente lo confirma:** el lockup de Asesoría dice "ASESORES" (no "ASESORÍA") — es el texto real del archivo entregado, se ha respetado tal cual. Si el manual definitivo usa otra grafía, hay que pedir el PNG/SVG corregido y sustituir `logo-asesoria.png`.

**Limitación conocida:** son PNG a 973×973/652/1101 px, no vectoriales. Se ven nítidos hasta ~150 px de ancho en pantallas normales; en pantallas de alta densidad (Retina) a tamaños de cabecera (~50-70 px) siguen viéndose bien porque parten de resolución alta. Si el cliente puede facilitar los `.svg` o `.ai` originales del Manual de Identidad, se pueden sustituir por versiones vectoriales sin tocar el HTML (misma ruta, mismo nombre).

No hay versión en negativo (blanca) con título "ASESORES" ni "MARKETING" — por eso el footer usa siempre el isotipo blanco sin título (`logo-a360-blanco.png`); la identificación de cada sitio ya la da el texto "Asesoría"/"Marketing" del bloque de navegación contiguo en el propio footer.
