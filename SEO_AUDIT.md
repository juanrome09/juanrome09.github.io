# Auditoría SEO / GEO / AEO — A360 (asesores360.com)

**Fecha del informe original:** 2026-09-26 · **Última actualización:** 2026-09-26 (Fase 3, quick wins + bloque técnico aplicados) · **Rama:** `seo/optimizacion` · **Estado del sitio:** no publicado (dominio aún sin conectar en el DNS real; `CNAME` ya está en el repo)
**Autor:** Auditoría técnica asistida (Claude Code), sobre el repo real. Nada de lo que sigue es especulativo salvo que se indique explícitamente como "a confirmar".

> **Estado de la Fase 3 (ver sección 6 para el detalle):** aplicados todos los quick wins y el bloque técnico que no requerían tu elección explícita. Quedan 3 decisiones pendientes de tu respuesta antes de tocarlas: colores de contraste (2.4.3), contenido del home-selector (2.1.3) y la forma final del `telephone` en JSON-LD (2.5.7). El resto de esta sección 1 y la sección 2 se dejan tal cual se escribieron en la auditoría original — el estado real y actualizado está en la sección 6.

---

## 0. Corrección de contexto (importante antes de leer el resto)

El encargo original describía un stack **React + Java** con un home-selector que "sirve" cada pieza. Tras inspeccionar el repo, esto **no es así**:

- El sitio entero es **HTML + CSS + JS estático**, sin build, sin bundler, sin framework. No hay `package.json`, `pom.xml` ni ningún artefacto de Java o React en el repo.
- Está alojado en **GitHub Pages** (`github.com/juanrome09/juanrome09.github.io`), no en un servidor Java.
- Las tres piezas son **subcarpetas del mismo repo/dominio**: `/` (puerta), `/asesoria/`, `/marketing/`. No hay subdominios.
- **Renderizado:** 100% HTML servido tal cual — cero riesgo de indexación por JS/CSR. Esto simplifica mucho la Fase 3: no hace falta SSR, prerender ni build de generación estática, porque ya es estático.
- **Dominio:** confirmaste que el canónico será `https://www.asesores360.com` (con `www`). Todo el metadata actual (canonicals, `sitemap.xml`, JSON-LD, `robots.txt`) usa `https://asesores360.com` **sin `www`** — hay que migrarlo antes de publicar (Fase 3, bloque técnico).
- **Idioma:** confirmaste español únicamente por ahora. No se necesita `hreflang`.
- **Datos del negocio:** siguiendo tu indicación, los he inferido leyendo el contenido real (servicios, textos de Nosotros, legal.html). Cualquier dato que no exista en el código lo dejo como `TODO` explícito — no he inventado nada (regla 4).

Ajusto el resto del plan de Fases 3-5 a esta realidad: no hay "cabeceras de Java" que auditar (son las de GitHub Pages), y el "sitemap generado en build" pasa a ser un sitemap generado por un pequeño script que corres antes de cada publicación (no hay build automático).

---

## 1. Resumen ejecutivo

### Puntuación por bloque (0–10)

| Bloque | Puntuación | Resumen en una línea |
|---|---|---|
| 2.1 Arquitectura y dominio | 6 | Estructura de subcarpetas correcta; el mismatch www/no-www hay que resolverlo antes de lanzar |
| 2.2 SEO técnico | 7 | robots/sitemap/canonicals ya existen y son casi correctos; falta el ajuste de dominio y un checklist de lanzamiento |
| 2.3 On-page | 7 | Metadata completa en las 10 páginas; algunos `<title>` de páginas internas son demasiado cortos/genéricos |
| 2.4 Rendimiento / CWV | 6 | Muy buenos resultados salvo **una página con un problema serio y concreto** (ver hallazgo 2.4.1) |
| 2.5 Datos estructurados | 7 | Ya hay `Organization`, `AccountingService`, `MarketingAgency` y `FAQPage` bien formados; falta enlazarlos con `@id` |
| 2.6 SEO local | 7 | NAP consistente, horarios ya declarados; falta checklist de Google Business Profile (fuera del código) |
| 2.7 E-E-A-T | 5 | El sitio ya reserva el espacio para autoría real (`<!-- PENDIENTE A360 -->`) pero hoy no hay ni un nombre ni una colegiación — crítico en YMYL |
| 2.8 GEO | 4 | Buena claridad de entidad vía JSON-LD, pero no hay `llms.txt` ni política explícita sobre bots de IA |
| 2.9 AEO | 7 | Ya existe `FAQPage` real y bien formada en ambas home; se puede ampliar y replicar en más páginas |
| 2.10 Keywords / contenido | 6 | Buena separación de intención entre Asesoría y Marketing (sin canibalización real); falta arquitectura de URLs por servicio |

**Media global: 6.2 / 10** — el sitio parte de una base técnica mucho más sólida de lo habitual para "aún no publicado", con huecos concretos y acotados más que problemas estructurales.

### Las 5 mayores oportunidades

1. **[Crítico, Quick win] Cuatro imágenes de `servicios.html` pesan ~7.1 MB y se muestran a 371×282px** → Lighthouse mide **25.7s de LCP** en esa página (vs. 2.6–2.9s en el resto del sitio). Es el hallazgo más grave de toda la auditoría y el más barato de arreglar. Ver 2.4.1.
2. **[Bloqueante de lanzamiento] Migrar todo el sitio de `asesores360.com` a `www.asesores360.com`** (canonicals, sitemap, JSON-LD, `robots.txt`, y la config de GitHub Pages/DNS). Ver 2.2.1.
3. **[E-E-A-T, alto impacto a medio plazo] Sustituir las tarjetas de equipo genéricas ("Área fiscal", "Área contable"...) por personas reales con colegiación/cualificación**, en cuanto tengas esos datos. En un sector YMYL esto pesa mucho en cómo Google (y los motores generativos) valoran la confianza del sitio. Ver 2.7.1.
4. **[Quick win, contraste] Tres componentes (badge naranja del sticky-scroll, botón primario de Contacto, chips de servicios de Marketing) no cumplen contraste AA** — arreglo de una línea de CSS cada uno. Ver 2.4.3.
5. **[GEO, esfuerzo bajo] Publicar `/llms.txt`** con un resumen estructurado de qué es A360, qué hace cada línea de negocio y dónde opera — hoy no existe y es la pieza más citada por motores generativos para entender una marca rápido. Ver 2.8.1.

---

## 2. Hallazgos por bloque

### 2.1 Arquitectura y estrategia de dominio

**2.1.1 — Subcarpetas, no subdominios: correcto, no tocar.**
Evidencia: `/`, `/asesoria/*.html`, `/marketing/*.html` en el mismo repo/dominio.
Impacto: alto (si estuviera mal). Esfuerzo: n/a. Solución: ninguna — ya sigue la práctica recomendada (concentra toda la autoridad de dominio en un solo host, en vez de dispersarla entre subdominios).

**2.1.2 — Mismatch de dominio canónico (www vs. no-www).**
Evidencia: `asesoria/index.html:9` `<link rel="canonical" href="https://asesores360.com/asesoria/">`; mismo patrón en las 10 páginas; `sitemap.xml` usa `https://asesores360.com/...`; `robots.txt` apunta a `https://asesores360.com/sitemap.xml`.
Impacto: alto — si se publica así con `www.asesores360.com` como dominio real, todas las `canonical` apuntarán a una URL distinta a la que Google visita, lo que puede generar contenido duplicado percibido o diluir señales.
Esfuerzo: bajo (find & replace sistemático + decidir la redirección 301 del apex).
Solución (Fase 3): cambiar las 10 canonicals + `og:url` + `sitemap.xml` + `robots.txt` a `www.asesores360.com`, y confirmar contigo cómo se resuelve `asesores360.com` (sin www) — normalmente una redirección 301 a la versión con `www`, gestionada en el proveedor de DNS o delante de GitHub Pages (GitHub Pages con dominio propio vía `CNAME` solo sirve **un** host; el otro necesita un registro de redirección en el DNS, p. ej. un registro ALIAS/ANAME o un forwarding del registrador).

**2.1.3 — La puerta (home-selector) ya tiene metadata completa, pero su contenido visible es mínimo.**
Evidencia: `index.html` tiene `<h1 class="sr-solo">` (solo lectores de pantalla) y ya trae JSON-LD `Organization` con `subOrganization` enlazando a Asesoría/Marketing. Visualmente es solo el selector de dos mitades.
Impacto: medio. Es la URL con más autoridad potencial del dominio y hoy no aporta texto rastreable más allá del H1 oculto y las metaetiquetas.
Esfuerzo: bajo-medio.
Solución (Fase 3, con tu aprobación de diseño): añadir un bloque de texto breve y real (quién es A360, qué son las dos líneas, ubicación) sin romper la función de selector — puede vivir oculto visualmente igual que el H1, o como un pie de página breve bajo el split. Lo dejo para brainstorming de diseño, no lo toco sin acordar el enfoque visual contigo.

**2.1.4 — Sin canibalización de keywords entre Asesoría y Marketing.**
Evidencia: servicios de Asesoría = fiscal, contable, societaria, laboral (`asesoria/servicios.html`); servicios de Marketing = branding, redes sociales, publicidad (Meta/Google Ads), estrategia digital, diseño y desarrollo web (`marketing/servicios.html`). Cero solapamiento semántico.
Impacto: positivo, ya está bien. Solo vigilar que el contenido nuevo (Fase 4) respete esta separación.

**2.1.5 — Enlazado interno entre las tres piezas.**
Evidencia: cada footer trae un enlace cruzado ("Ir a Marketing" / "Ir a Asesoría") y el nav superior permite saltar entre ambas marcas (visto en el trabajo previo de este proyecto). Correcto.

---

### 2.2 SEO técnico

**2.2.1 — `robots.txt` y `sitemap.xml` ya existen y son casi correctos.**
Evidencia:
```
robots.txt:
User-agent: *
Allow: /
Sitemap: https://asesores360.com/sitemap.xml
```
`sitemap.xml` cubre las 10 páginas con `lastmod`/`changefreq`/`priority`.
Impacto: bajo (ya funciona), pero arrastra el mismatch de dominio de 2.1.2.
Solución: mismo fix que 2.1.2, más añadir un pequeño script (`scripts/generar-sitemap.py` o similar) que regenere `sitemap.xml` a partir de la lista real de páginas antes de cada publicación, para que no se desincronice manualmente en el futuro. Lo propongo en Fase 3, no es urgente para el lanzamiento.

**2.2.2 — No hay `noindex` accidentales ni contenido bloqueado.**
Evidencia: `grep -r "noindex"` sobre las 10 páginas → sin resultados. `robots.txt` permite todo.
Impacto: positivo, confirmado.

**2.2.3 — Checklist de "no subir bloqueos de staging" (para la Fase 5, dejo la constancia aquí).**
Hoy no hay ningún `<meta name="robots" content="noindex">` de por medio ni contraseña de staging, así que no hay nada que "desbloquear" al lanzar — el riesgo real es únicamente el mismatch de dominio (2.1.2) y que falta el archivo `CNAME` para conectar el dominio propio a GitHub Pages.

**2.2.4 — Sin contenido duplicado detectado.** Cada página tiene su propio `<title>`/description/canonical; no hay URLs con y sin barra final sirviendo el mismo contenido de forma distinta (GitHub Pages normaliza esto por defecto para archivos `.html`).

**2.2.5 — No hay 404 personalizada.**
Evidencia: no existe `404.html` en la raíz (GitHub Pages lo reconoce automáticamente por nombre si existe).
Impacto: bajo-medio (experiencia de usuario y retención cuando alguien llega a una URL rota, p. ej. desde un enlace viejo o un typo).
Esfuerzo: bajo.
Solución (Fase 3): página `404.html` con navegación de vuelta a inicio/Asesoría/Marketing.

---

### 2.3 On-page

**2.3.1 — Metadata base (title/description/canonical/OG/Twitter/H1 único) ya está en las 10 páginas.** Confirmado por lectura directa del `<head>` de `index.html`, `asesoria/index.html` y `marketing/index.html`, y por grep de `<h1` (exactamente 1 por página en las 10).

**2.3.2 — Algunos `<title>` de páginas internas son demasiado cortos y genéricos.**
Evidencia (longitud aproximada en caracteres):

| Página | `<title>` actual | Long. |
|---|---|---|
| `asesoria/nosotros.html` | "Nosotros · A360 Asesoría" | 24 |
| `asesoria/servicios.html` | "Servicios · A360 Asesoría" | 25 |
| `asesoria/contacto.html` | "Contacto · A360 Asesoría" | 24 |
| `marketing/nosotros.html` | "Nosotros · A360 Marketing" | 25 |
| `marketing/servicios.html` | "Servicios · A360 Marketing" | 26 |
| `marketing/contacto.html` | "Contacto · A360 Marketing" | 25 |
| `asesoria/index.html` | "A360 Asesoría · Fiscal, contable, laboral y societaria en Ibiza" | 63 (ligeramente por encima de 60) |

Impacto: medio — estos títulos no usan las ~35-40 caracteres libres que les quedan hasta el límite de 60, y no incluyen keyword/ubicación, perdiendo una oportunidad de CTR y de reforzar intención de búsqueda.
Esfuerzo: bajo.
Solución (Fase 4, brief detallado por página): p. ej. `"Servicios · Asesoría fiscal, contable, laboral | A360 Ibiza"` en vez de `"Servicios · A360 Asesoría"`. Recorto `asesoria/index.html` a ≤60.

**2.3.3 — Imágenes: la mayoría son PNG, no WebP/AVIF.**
Evidencia: `find assets/img -type f` → 28 PNG, solo 5 WebP, 5 JPG, 1 GIF.
Impacto: medio-alto (peso de página, ver también 2.4.1 que es el caso extremo).
Esfuerzo: bajo-medio (conversión por lotes con `cwebp`/`sharp`, sin tocar el diseño).

**2.3.4 — `loading="lazy"` ya se usa de forma consistente (26 apariciones) en imágenes fuera del viewport inicial.** Correcto, no tocar.

**2.3.5 — `width`/`height` explícitos en `<img>`: presentes** (ej. `width="973" height="973"` en los logos), lo que ya previene CLS — confirmado por el CLS casi nulo en todos los Lighthouse (0–0.015).

---

### 2.4 Rendimiento y Core Web Vitals

Metodología: `npx lighthouse` contra el sitio servido en local (`python3 -m http.server`), Chrome headless, sin caché de por medio (misma filosofía que ya usa vuestro propio `servidor-local.py`). Categorías: Performance, Accessibility, Best Practices, SEO.

#### Línea base (móvil, throttling simulado de Lighthouse)

| Página | Perf | A11y | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` (puerta) | 96 | 100 | 100 | 100 | 2.6 s | 0.001 | 0 ms |
| `/asesoria/` | 94 | 96 | 100 | 100 | 2.9 s | 0.005 | 10 ms |
| `/asesoria/servicios.html` | **73** | 100 | 100 | 100 | **25.7 s** | 0.015 | 0 ms |
| `/asesoria/contacto.html` | 95 | 96 | 100 | 100 | 2.6 s | 0 | 0 ms |
| `/marketing/` | 89 | 100 | 100 | 100 | 3.5 s | 0.008 | 0 ms |
| `/marketing/servicios.html` | 96 | 96 | 100 | 100 | 2.6 s | 0.012 | 0 ms |
| `/marketing/contacto.html` | 97 | 100 | 100 | 100 | 2.4 s | 0 | 0 ms |

#### Línea base (escritorio, spot-check)

| Página | Perf | A11y | BP | SEO | LCP |
|---|---|---|---|---|---|
| `/` (puerta) | 100 | 100 | 100 | 100 | 0.5 s |
| `/asesoria/` | 100 | 96 | 100 | 100 | 0.6 s |

Reportes JSON completos guardados en `/private/tmp/.../scratchpad/lighthouse/*.json` de esta sesión (no forman parte del repo; puedo volver a generarlos en cualquier momento con el mismo comando).

**2.4.1 — [CRÍTICO] `asesoria/servicios.html`: LCP de 25.7 s por 4 imágenes de placeholder de ~1.7 MB cada una, mostradas a 371×282 px.**
Evidencia exacta:
```
assets/img/placeholders/asesoria-fiscal.png       1672×941px  1.87 MB
assets/img/placeholders/asesoria-contable.png     1672×941px  1.58 MB
assets/img/placeholders/asesoria-laboral.png      1448×1086px 1.82 MB
assets/img/placeholders/asesoria-societaria.png   1448×1086px 1.89 MB
```
Usadas en `<img class="servicio-bloque__foto">`, renderizadas a solo 371×282 CSS px. Lighthouse: `total-byte-weight` = 7.29 MB para toda la página; el elemento LCP es exactamente una de estas fotos; "Render Delay" = 96% del LCP (la imagen tarda tanto en decodificarse/pintarse por su tamaño que domina toda la métrica).
Impacto: **muy alto** — esta es literalmente la página de conversión de servicios; un LCP de 25s es un abandono garantizado en móvil real (Lighthouse ya simula una conexión lenta, pero incluso en 4G bueno esto son varios segundos reales perdidos) y penaliza directamente el ranking (Core Web Vitals es señal de posicionamiento).
Esfuerzo: **bajo** — son 4 archivos. Redimensionar a un ancho real de ~750-800px (2x de 371px para pantallas retina) y recomprimir a WebP con calidad ~75-80 reduciría cada archivo de ~1.8 MB a, típicamente, 40-90 KB.
Solución propuesta (Fase 3, pendiente tu OK porque toca archivos de imagen reales):
```zsh
# Ejemplo con sips (incluido en macOS) + cwebp (Homebrew: brew install webp)
sips -Z 800 assets/img/placeholders/asesoria-fiscal.png --out /tmp/fiscal-800.png
cwebp -q 80 /tmp/fiscal-800.png -o assets/img/placeholders/asesoria-fiscal.webp
```
y actualizar el `<img>` a `<picture>` con fuente WebP + fallback PNG, o simplemente sustituir el `src` si WebP cubre vuestro soporte de navegador objetivo. **Nota:** son placeholders (carpeta `/placeholders/`) — si vais a sustituirlos pronto por fotografía real, el mismo criterio de tamaño/formato aplica igual a las fotos definitivas.

**2.4.2 — `marketing/` (home) es la segunda más pesada (perf 89, LCP 3.5s en móvil).**
Impacto: medio. Esfuerzo: bajo.
Solución: mismo tratamiento de imágenes (2.3.3) aplicado a las imágenes por encima del pliegue de esa página; revisar en Fase 3 con el reporte JSON detallado.

**2.4.3 — Tres fallos de contraste de color (AA), con evidencia exacta:**

| Selector | Colores | Ratio medido | Ratio requerido |
|---|---|---|---|
| `.proceso__marcador--activo .proceso__marcador__numero` (badge activo del scroll en "A quién ayudamos" / "De la primera duda...") | texto `#ffffff` sobre fondo `#e95117` (naranja), 13px bold | 3.71:1 | 4.5:1 |
| `button.boton.boton-primario` (botón "Enviar" del formulario de Contacto, Asesoría) | texto `#ffffff` sobre fondo `#e95117`, 17px bold | 3.71:1 | 4.5:1 |
| `.mk-servicios-chip span` (chips de navegación de servicios, Marketing) | texto `#f3eee7` sobre fondo `#51bcbd` (turquesa) | 1.96:1 | 4.5:1 |

Impacto: medio (accesibilidad real para personas con baja visión, y Google usa señales de accesibilidad como proxy de calidad; además, el patrón "texto blanco sobre naranja de marca" se repite en varios sitios, así que vale la pena resolverlo una vez y de forma consistente).
Esfuerzo: bajo.
Solución (Fase 3, a decidir contigo): oscurecer ligeramente el naranja **solo como fondo de badges/botones de texto pequeño** (p. ej. un `--naranja-boton: #C43F0F` que sigue leyéndose como "naranja de marca" pero cumple 4.5:1), o subir el peso/tamaño de esas fuentes hasta el umbral de "texto grande" (≥18.66px bold), o cambiar el chip de Marketing a un turquesa más oscuro. Te lo muestro con opciones antes de tocar el color de marca.

**2.4.4 — Fuentes: ya se usa `woff2` autoalojado con `<link rel="preload">` en `marketing/index.html`.** Buena práctica ya aplicada; replicar el `preload` de la fuente crítica en el resto de páginas si no está ya (a revisar en Fase 3).

**2.4.5 — Cabeceras de caché: no auditables desde GitHub Pages en local.** GitHub Pages fija sus propias cabeceras de caché (no configurables desde el repo salvo con un `_headers`-like que GH Pages no soporta). Lighthouse ya lo señala como oportunidad menor (`uses-long-cache-ttl`) en `asesoria/servicios.html`, pero es una limitación de la plataforma de hosting, no del código — lo dejo anotado, no es accionable sin cambiar de hosting.

---

### 2.5 Datos estructurados (JSON-LD)

**2.5.1 — Ya existen 4 tipos de entidad bien formados**, confirmado leyendo el JSON-LD real:
- `Organization` (puerta) con `subOrganization` → Asesoría/Marketing.
- `AccountingService` (asesoria/index.html) con dirección, teléfono, email.
- `MarketingAgency` (marketing/index.html) con `foundingDate`.
- `FAQPage` con preguntas y respuestas reales y coherentes con el contenido visible (ver 2.9.1).
- `OpeningHoursSpecification` ya presente en `asesoria/contacto.html` (Lun-Vie 08:00-14:00).

Esto es notablemente más avanzado que la media de un sitio "sin publicar".

**2.5.2 — Ninguna entidad usa `@id`, así que no forman un grafo conectado.**
Impacto: medio — Google puede interpretar cada bloque de forma aislada en vez de entender que `AccountingService` y `MarketingAgency` son ambos parte de la misma `Organization`.
Esfuerzo: bajo-medio.
Solución (Fase 3): dar `@id` estable a cada entidad (p. ej. `https://www.asesores360.com/#organizacion`, `.../asesoria/#negocio`, `.../marketing/#negocio`) y referenciarlas entre sí con `"parentOrganization": {"@id": "..."}` / `"subOrganization"`.

**2.5.3 — Falta `BreadcrumbList`.** No implementado en ninguna página. Esfuerzo bajo, impacto medio (mejora cómo se ve la URL en resultados de búsqueda).

**2.5.4 — Falta `Service` individual por cada uno de los 4 servicios de Asesoría y los 5 de Marketing.** Hoy el detalle vive dentro del `AccountingService`/`MarketingAgency` general, sin un nodo `Service` propio por especialidad. Esfuerzo medio, impacto medio — más relevante si en Fase 3-4 cada servicio pasa a tener su propia URL (ver 2.10.2).

**2.5.5 — No hay `Person` para asesores** — correctamente, porque no hay nombres reales todavía (ver 2.7.1). **No añadir `Person` inventados.**

**2.5.6 — El CIF real ya existe en `legal.html` (`B16615999`, "A360 Ibiza Asesores, S.L.") pero no se refleja en el JSON-LD de `Organization`.**
Impacto: bajo-medio (señal de confianza adicional, y dato que motores generativos citan).
Esfuerzo: trivial.
Solución (Fase 3): añadir `"legalName": "A360 Ibiza Asesores, S.L."` y `"taxID": "B16615999"` al JSON-LD de `Organization`, ya que es un dato real y verificable presente en el propio sitio (no es un dato inventado, ya está publicado en `legal.html`).

**2.5.7 — Ligera inconsistencia semántica en el campo `telephone`.**
Evidencia: la `Organization` de la puerta usa `telephone: "+34649032854"` (el móvil de WhatsApp), mientras que `AccountingService`/`MarketingAgency` usan `telephone: "+34971339488"` (fijo). No es un error de NAP (la dirección es idéntica en las 5 apariciones), pero mezclar el número de WhatsApp como "teléfono principal" de la organización raíz es poco convencional.
Esfuerzo: trivial.
Solución (Fase 3): usar el fijo como `telephone` en las 3 entidades y declarar el WhatsApp como `contactPoint` adicional con `"contactType": "customer service"` y `"contactOption": "TollFree"`... en realidad `contactOption` no aplica a WhatsApp; mejor usar simplemente un segundo `contactPoint` con `"contactType": "WhatsApp"` en texto libre dentro de `description`, ya que schema.org no tiene un tipo dedicado a WhatsApp. Te muestro la propuesta exacta antes de aplicarla.

**2.5.8 — Ningún `Review`/`AggregateRating` en ningún lado.** Correcto, tal como pide la regla 5 — no se toca a menos que aportes reseñas reales verificables.

---

### 2.6 SEO local

**2.6.1 — NAP consistente en las 10 páginas.**
Evidencia: `streetAddress: "Calle del Sol, 12 bajos, local F"` aparece idéntico en los 5 bloques JSON-LD que lo declaran; el teléfono fijo `971339488` aparece 10 veces como `tel:` + 4 veces en JSON-LD, siempre igual; el móvil de WhatsApp `649032854` aparece 18 veces siempre igual.
Impacto: positivo, confirmado — no hay inconsistencias de NAP que perjudiquen el SEO local.

**2.6.2 — Horarios ya declarados en schema (`OpeningHoursSpecification`, Lun-Vie 08:00-14:00) pero solo en `asesoria/contacto.html`.**
Esfuerzo: trivial. Solución: replicar el mismo bloque en `marketing/contacto.html` si comparten horario (a confirmar contigo — `TODO`).

**2.6.3 — No hay páginas/secciones diferenciadas por zona (Sant Antoni, Santa Eulària, Ibiza ciudad...).**
Dado que el negocio tiene una única sede física en Santa Eulalia del Río y presta servicio (según el propio contenido de "A quién ayudamos") a sectores más que a zonas geográficas distintas, **no recomiendo crear páginas por zona salvo que confirmes que atendéis activamente varias localidades con matices reales** (regla: nada de contenido duplicado/fino solo para keywords geográficas). Lo dejo como pregunta abierta para la Fase 4, no como tarea de Fase 3.

**2.6.4 — Checklist de Google Business Profile (fuera del código, recomendación).**
- Verificar/reclamar la ficha con el NAP exacto de arriba.
- Categoría principal: "Asesoría fiscal" o "Asesor fiscal" (revisar cuál da Google en España); categorías secundarias: gestoría, asesoría laboral, asesoría de empresas.
- Enlazar la web (`https://www.asesores360.com/asesoria/` una vez publicada).
- Añadir horario idéntico al declarado en schema.
- Fotos reales del local y del equipo (no placeholders).
- Para Marketing: decidir si tiene ficha propia o si vive dentro de la misma ficha de A360 como "también conocido como" — normalmente, si comparten dirección y teléfono, es mejor **una sola ficha de GBP** para evitar confundir a Google sobre cuál es el negocio real en esa dirección.

---

### 2.7 E-E-A-T (crítico por ser YMYL)

**2.7.1 — El equipo se presenta por rol genérico, no por persona real.**
Evidencia: `asesoria/nosotros.html` L204-233, cuatro tarjetas: "Dirección y estrategia", "Área fiscal", "Área contable", "Área laboral", cada una con un comentario `<!-- PENDIENTE A360 -->` literal en el código, ya marcando que falta contenido real.
Impacto: **alto** para un sitio YMYL — Google (y cada vez más los motores generativos) valoran fuertemente que haya personas identificables, con nombre y cualificación verificable, detrás de un consejo financiero.
Esfuerzo: nulo por mi parte — **requiere datos tuyos**: nombre, rol, y si aplica, nº de colegiado/cualificación de cada persona que quieras mostrar.
Acción: `TODO` — te pregunto explícitamente antes de escribir nada aquí, tal como pide la regla 4. Cuando tengas los datos, los añado con marcado `Person` en JSON-LD enlazado a la `Organization` vía `@id`.

**2.7.2 — Aviso legal, CIF y domicilio ya están completos y son reales.**
Evidencia: `legal.html:73,93` — CIF `B16615999`, razón social "A360 Ibiza Asesores, S.L.", domicilio completo. Correcto, no tocar salvo que necesite actualizarse.

**2.7.3 — No hay contenido informativo (blog/artículos) con autoría y fecha, todavía.**
No es un defecto — hoy no existe esa sección — pero es la pieza que falta para reforzar E-E-A-T a medio plazo (ver Fase 4: contenido informativo con autor + fecha + revisión profesional).

**2.7.4 — No se detectan promesas financieras no sustentadas.**
Revisé el copy de servicios (fiscal/contable/societaria/laboral) — el tono es informativo y de proceso ("te decimos qué necesitas", "revisamos tu situación"), sin cifras de rentabilidad ni garantías de resultado. Correcto para YMYL.

**2.7.5 — Sin testimonios/casos de cliente en ningún lado.**
Esperado y correcto dado que no hay reseñas reales todavía (regla 5) — **no añadir sin datos reales verificables**. Si en el futuro tenéis testimonios reales con consentimiento, es una pieza de confianza importante a incorporar (Fase 4, con tu validación caso por caso).

---

### 2.8 GEO — motores generativos

**2.8.1 — No existe `/llms.txt`.**
Impacto: medio — es la referencia más citada hoy por herramientas de IA para entender rápidamente una marca (resumen estructurado en texto plano/Markdown).
Esfuerzo: bajo.
Solución (Fase 3): crear `llms.txt` con quién es A360, qué hace cada línea de negocio, ubicación, y enlaces a las páginas clave — usando solo datos ya confirmados en el sitio (nada inventado).

**2.8.2 — `robots.txt` no bloquea explícitamente ningún bot de IA, pero tampoco los menciona.**
Evidencia: `User-agent: *` / `Allow: /` cubre a todos por defecto, incluidos `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, ya que no hay ninguna regla específica que los excluya.
**Pregunta para ti antes de tocar nada (regla explícita del brief):** ¿queréis mantener la política actual de "abierto a todos" (recomendado si el objetivo es maximizar que os citen ChatGPT/Claude/Perplexity/AI Overviews), o preferís bloquear explícitamente alguno de estos user-agents? No cambio `robots.txt` en este sentido sin tu confirmación.

**2.8.3 — Claridad de entidad: ya es buena gracias al JSON-LD existente (2.5.1), pero se puede reforzar con contenido citable.**
Los párrafos actuales de "Nosotros"/"Servicios" ya son razonablemente autocontenidos (definiciones claras, sin depender de contexto previo), buena base para que un LLM los cite con precisión. Oportunidad de mejora en Fase 4: párrafos de definición aún más explícitos al principio de cada sección de servicio ("¿Qué es la gestión laboral? ...").

---

### 2.9 AEO — motores de respuesta

**2.9.1 — Ya existe una `FAQPage` real y bien formada en Asesoría y Marketing.**
Evidencia (`asesoria/index.html`): preguntas reales como "¿Trabajáis con autónomos además de con empresas?" con respuestas directas de una frase. Estructura `Question`/`acceptedAnswer` correcta.
Impacto: positivo, ya aprovechable para featured snippets / "People Also Ask".

**2.9.2 — Oportunidad de ampliar la cobertura de preguntas long-tail reales de Baleares.**
Ejemplos de preguntas que el público objetivo (autónomos, pymes, alquiler turístico en Ibiza) busca realmente y que hoy no están cubiertas: "¿Cuándo hay que presentar el modelo 130?", "¿Qué gestión fiscal necesita un piso turístico en Ibiza?", "¿Cómo tributa un residente extranjero autónomo en España?". Esfuerzo medio, impacto alto — lo detallo con keywords y estructura de respuesta en la Fase 4 (`SEO_CONTENT_PLAN.md`), no lo escribo aquí para no inventar contenido fiscal sin que un profesional cualificado lo revise (regla 8 / E-E-A-T).

**2.9.3 — El contenido de servicios ya usa listas, pero no tablas ni pasos numerados.**
Los bloques de servicio (`servicio-bloque`) usan listas de viñetas — buen formato para snippets de lista, pero un proceso paso a paso (p. ej. "cómo constituir una sociedad con nosotros: 1 - 2 - 3") en formato `<ol>` numerado tendría más opciones de aparecer en resultados de "pasos" y en búsqueda por voz.

---

### 2.10 Keywords y contenido

**2.10.1 — Intención por página, ya razonablemente clara:**

| Página | Intención dominante |
|---|---|
| `/` (puerta) | Navegacional (marca) |
| `/asesoria/` | Comercial/transaccional ("asesoría fiscal Ibiza") |
| `/asesoria/servicios.html` | Comercial (detalle de cada servicio) |
| `/asesoria/nosotros.html` | Informacional/confianza |
| `/asesoria/contacto.html` | Transaccional (lead) |
| `/marketing/*` | Mismo patrón, para las 5 líneas de marketing |

**2.10.2 — Los 4 servicios de Asesoría (y los 5 de Marketing) viven como anclas dentro de una sola página, no como URLs propias.**
Evidencia: `servicios.html#fiscal`, `#contable`, `#societaria`, `#laboral`.
Impacto: medio — limita cuánto puede posicionar cada servicio por separado para su propia keyword long-tail (p. ej. "constitución de sociedades Ibiza" compitiendo en la misma URL que "gestión de nóminas Ibiza"), y no se puede compartir/enlazar un servicio concreto de forma tan específica en resultados de búsqueda o en respuestas de IA.
Esfuerzo: medio-alto (implica decidir arquitectura de URLs, no solo código).
Recomendación: **no lo cambiaría en la Fase 3 técnica** — es una decisión de arquitectura de contenido que merece su propia conversación (¿4 páginas nuevas `/asesoria/servicios/fiscal.html` etc., o mantener anclas y reforzar cada sección con más contenido propio?). Lo planteo como pregunta abierta para la Fase 4.

**2.10.3 — Gap analysis frente a competidores: pendiente de tus URLs.**
El brief original dejaba `[URLs de otras asesorías en Ibiza]` sin rellenar y no tengo forma de inferir esto del código. Lo necesito de ti para la Fase 4 (`SEO_CONTENT_PLAN.md`).

---

## 3. Plan priorizado

### Quick wins (bajo esfuerzo, alto impacto — primeros commits de la Fase 3)
1. Comprimir/redimensionar las 4 imágenes de `asesoria/servicios.html` (2.4.1) — **el más importante de todos**.
2. Migrar canonicals/sitemap/robots/OG a `www.asesores360.com` (2.1.2 / 2.2.1).
3. Arreglar los 3 contrastes de color (2.4.3).
4. Añadir `legalName`/`taxID` reales al JSON-LD de `Organization` (2.5.6).
5. Alargar/mejorar los 6 `<title>` demasiado cortos (2.3.2).
6. Publicar `/llms.txt` (2.8.1).

### Técnico
7. Enlazar el grafo JSON-LD con `@id` (2.5.2) + `BreadcrumbList` (2.5.3).
8. Página `404.html` (2.2.5).
9. Normalizar el campo `telephone` en JSON-LD (2.5.7).
10. Script de generación de `sitemap.xml` (2.2.1).

### Local y E-E-A-T
11. Confirmar contigo los datos de horario de Marketing (2.6.2) y checklist de Google Business Profile (2.6.4) — fuera del código.
12. `TODO` bloqueante de contenido: nombres y cualificación reales del equipo (2.7.1) — esperando tus datos.

### Contenido (Fase 4)
13. `SEO_CONTENT_PLAN.md`: mapa de keywords, gap vs. competidores (necesito URLs), calendario a 3 meses, y decisión sobre arquitectura de URLs de servicios (2.10.2).

### GEO/AEO
14. Ampliar `FAQPage` con preguntas long-tail reales de Baleares (2.9.2), revisadas por un profesional cualificado antes de publicarlas (regla 8).
15. Confirmar política de bots de IA en `robots.txt` (2.8.2) — pregunta abierta, no toco nada aquí sin tu respuesta.

---

## 4. Métricas Lighthouse — línea base

Ver tablas completas en la sección **2.4**. Resumen de un vistazo (móvil):

- **Mejor página:** `/marketing/contacto.html` — 97 perf / 100 a11y / 100 BP / 100 SEO.
- **Peor página:** `/asesoria/servicios.html` — 73 perf (por el hallazgo 2.4.1), pero 100 en el resto de categorías.
- **Media de Performance (móvil, 7 páginas):** ~91.4, arrastrada a la baja por ese único caso extremo — sin él, la media sube a ~95.
- **Accesibilidad:** 96-100 en todas, con 3 fallos puntuales de contraste ya documentados y con solución propuesta.
- **Best Practices y SEO (Lighthouse):** 100 en las 9 páginas auditadas, sin excepción.

---

## 5. Preguntas abiertas para ti antes de la Fase 3

1. ¿Redirección 301 de `asesores360.com` → `www.asesores360.com`, o al revés? (necesito saber quién gestiona el DNS del dominio).
2. Política sobre bots de IA en `robots.txt` (2.8.2): ¿abierto a todos, o bloqueáis alguno?
3. Nombres y cualificación/colegiación reales del equipo, cuando los tengas (2.7.1) — sin prisa, lo dejo marcado como TODO hasta entonces.
4. ¿El horario de `marketing/contacto.html` es el mismo que el de Asesoría (Lun-Vie 08:00-14:00), o distinto? (2.6.2)
5. URLs de 2-3 competidores reales en Ibiza, para el gap analysis de la Fase 4.
6. ¿Vale la pena separar cada servicio en su propia URL (2.10.2), o preferís mantener la estructura actual de anclas y reforzar el contenido dentro de la misma página?

Quedo a la espera de tu OK para este documento (y de las respuestas que quieras darme ya) antes de tocar ningún archivo del sitio.

---

## 6. Fase 3 — progreso, Lighthouse antes/después y estado real (actualizado 2026-09-26)

### 6.1 Corrección a la auditoría original

Al implementar el enlazado de `@id` (bloque técnico) encontré que el hallazgo **2.5.3 estaba mal**: dije que faltaba `BreadcrumbList` en todo el sitio, pero en realidad **ya existía en 6 de las 10 páginas** (`asesoria/nosotros.html`, `asesoria/servicios.html`, `asesoria/contacto.html`, `marketing/nosotros.html`, `marketing/servicios.html`, `marketing/contacto.html`). Solo faltaba en las 2 páginas de inicio (`asesoria/index.html`, `marketing/index.html`) y, razonablemente, no aplica a `/` ni a `legal.html`. Ya está corregido (ver 6.2).

### 6.2 Qué se aplicó (commits en `seo/optimizacion`)

| # | Bloque | Commit | Archivos principales |
|---|---|---|---|
| 1 | Imágenes → WebP + fallback PNG (2.4.1 / 2.3.3) | `a4ce81c` | 4 fotos de `asesoria/servicios.html` + 4 fotos más pesadas del resto del sitio |
| 2 | Dominio → `www.asesores360.com` + política de bots IA (2.1.2 / 2.2.1 / 2.8.2) | `39738f6` | `CNAME`, `robots.txt`, `sitemap.xml`, las 10 páginas HTML |
| 3 | `legalName`/`taxID` reales + títulos SEO (2.5.6 / 2.3.2) | `6d6319f` | 5 bloques JSON-LD, 7 `<title>`/`og:title`/`twitter:title` |
| 4 | `llms.txt` (2.8.1) | `26bd9a2` | `llms.txt` (nuevo) |
| 5 | Grafo JSON-LD con `@id` + `BreadcrumbList` en las 2 home (2.5.2 / 2.5.3) | `9ea05da` | `index.html`, `asesoria/index.html`, `asesoria/contacto.html`, `marketing/index.html`, `marketing/contacto.html` |
| 6 | Página 404 (2.2.5) | `55cba3c` | `404.html` (nuevo), `assets/css/puerta.css` |
| 7 | Script de generación de `sitemap.xml` (2.2.1) | `ef4d1a2` | `scripts/generar_sitemap.py` (nuevo), `sitemap.xml` |

Todos los bloques JSON-LD se validaron con un parser real (`JSON.parse`) tras cada cambio — los 10+ bloques siguen siendo JSON válido. Cada bloque de imágenes y el 404 se verificaron visualmente en el navegador.

### 6.3 Pendiente — 3 decisiones que esperan tu respuesta (no se tocó nada de esto)

**A) Contraste de color (2.4.3)** — opciones con ratio real calculado (fórmula WCAG, luminancia relativa):

*Badge naranja del scroll + botón primario de Contacto (texto blanco sobre `#E95117`, ratio actual 3.71:1, necesita 4.5:1):*

| Opción | Color de fondo propuesto | Ratio vs. blanco | Cómo se ve |
|---|---|---|---|
| A | `#C43F0F` (naranja −12% luminosidad) | **5.17:1** ✅ | Prácticamente el mismo naranja, un pelín más profundo |
| B | `#B23A0E` (naranja −20%) | **5.99:1** ✅ | Un poco más tirando a terracota, más margen de sobra |
| C | `#0B3A54` (azul-hondo de marca, en vez de naranja) | **12.02:1** ✅✅ | Cambia el acento de estos 3 elementos de naranja a azul — más contraste que necesario, pero coherente con el resto de azules del sitio |

*Chips de servicios de Marketing (texto `#F3EEE7` sobre turquesa `#51BCBD`, ratio actual 1.96:1):*

| Opción | Color de fondo propuesto | Ratio vs. texto claro actual | Cómo se ve |
|---|---|---|---|
| D | `#2F7677` (turquesa −25%) | **4.57:1** ✅ | Mismo turquesa, notablemente más oscuro |
| E | `#245B5C` (turquesa −35%) | **6.67:1** ✅✅ | Más oscuro todavía, casi un petróleo |

Mi recomendación: **A** para el naranja (cambio casi imperceptible) y **D** para el turquesa (el mínimo cambio que ya cumple). Decime cuáles aplico.

**B) Contenido del home-selector (2.1.3)** — propuesta de texto (sin cambiar el diseño de las dos mitades):

Añadir una sola línea, discreta, dentro del `<footer class="puerta-pie">` ya existente (donde hoy solo hay dirección/email/teléfono/aviso legal), como primer elemento del footer:

> "Asesoría fiscal, contable, laboral y societaria — y marketing digital — bajo una misma marca en Ibiza."

Por qué ahí y no en el centro de la pantalla: el footer ya es donde vive el texto "secundario" de esta página (dirección, contacto), así que sumar una frase de contexto no compite visualmente con el selector de dos mitades, que sigue siendo el 100% del foco. Si preferís otra ubicación (p. ej. como subtítulo bajo el logo, arriba del todo) o otro texto, decímelo y lo ajusto antes de implementarlo.

**C) `telephone` en JSON-LD (2.5.7)** — propuesta final para las 5 entidades (`Organization`, 2×`AccountingService`, 2×`MarketingAgency`):

```json
"telephone": "+34971339488",
"contactPoint": {
  "@type": "ContactPoint",
  "contactType": "customer service",
  "telephone": "+34971339488",
  "url": "https://wa.me/34649032854"
}
```

Es decir: el fijo (`971339488`) pasa a ser el `telephone` principal en las 5 entidades (hoy la `Organization` de la puerta usa el móvil de WhatsApp), y añado un `contactPoint` con ese mismo fijo más la `url` de WhatsApp — schema.org no tiene un tipo dedicado a "WhatsApp", así que la vía estándar es exponer el enlace `wa.me` como URL de contacto dentro del `contactPoint`, no como un segundo `telephone`. Decime si aplico esto tal cual.

### 6.4 Instrucciones de DNS (para el registrador)

Para que `www.asesores360.com` sirva el sitio desde GitHub Pages y `asesores360.com` (sin `www`) redirija automáticamente:

1. **Registro CNAME** (subdominio `www`):
   - Tipo: `CNAME`
   - Nombre/host: `www`
   - Valor/destino: `juanrome09.github.io`
   - TTL: el que tenga por defecto el panel (3600 o "automático" están bien)

2. **Registros A** (apex/raíz `asesores360.com`, las 4 IPs de GitHub Pages):
   - Tipo: `A`, Nombre/host: `@` (o vacío, según el panel) → `185.199.108.153`
   - Tipo: `A`, Nombre/host: `@` → `185.199.109.153`
   - Tipo: `A`, Nombre/host: `@` → `185.199.110.153`
   - Tipo: `A`, Nombre/host: `@` → `185.199.111.153`

3. **Registros AAAA** (opcional pero recomendado, IPv6):
   - Tipo: `AAAA`, Nombre/host: `@` → `2606:50c0:8000::153`
   - Tipo: `AAAA`, Nombre/host: `@` → `2606:50c0:8001::153`
   - Tipo: `AAAA`, Nombre/host: `@` → `2606:50c0:8002::153`
   - Tipo: `AAAA`, Nombre/host: `@` → `2606:50c0:8003::153`

4. **En GitHub** (Settings → Pages, del repo `juanrome09/juanrome09.github.io`):
   - Custom domain: escribir `www.asesores360.com` y guardar (esto es lo que hace que GitHub reconozca el `CNAME` que ya está en el repo y configure la redirección automática del apex → `www`).
   - Esperar a que el check DNS se ponga en verde (puede tardar minutos u horas según la propagación).
   - Marcar **"Enforce HTTPS"** en cuanto la casilla deje de estar bloqueada (GitHub la habilita sola cuando termina de emitir el certificado; si no aparece de inmediato, reintentar en unas horas).

Nota: estas 4 IPs son las que documenta GitHub para Pages y llevan años estables, pero confirmá en `docs.github.com` → "Managing a custom domain" que no hayan cambiado antes de cargarlas, por si acaso.

**Quién gestiona el DNS:** tu mensaje decía "[yo / el cliente / NOMBRE DEL REGISTRADOR]" sin completar — decime cuál de las tres opciones aplica, así sé si esto te lo llevás vos o hay que coordinarlo con alguien más.

### 6.5 Lighthouse — antes / después (mismas 9 páginas, misma metodología)

| Página | Perf antes → después | LCP antes → después | Peso total antes → después |
|---|---|---|---|
| `/` (móvil) | 96 → 96 | 2.6s → 2.4s | 253KB → 254KB |
| `/` (escritorio) | 100 → 100 | 0.5s → 0.6s | 253KB → 254KB |
| `/asesoria/` (móvil) | 94 → 93 | 2.9s → 3.0s | 318KB → 319KB |
| `/asesoria/` (escritorio) | 100 → 100 | 0.6s → 0.6s | 318KB → 319KB |
| `/asesoria/servicios.html` (móvil) | **73 → 92** | **25.7s → 3.2s** | **7294KB → 440KB** |
| `/asesoria/contacto.html` (móvil) | 95 → 95 | 2.6s → 2.6s | 730KB → 730KB |
| `/marketing/` (móvil) | 89 → 89 | 3.5s → 3.5s | 2077KB → 1339KB |
| `/marketing/servicios.html` (móvil) | 96 → 95 | 2.6s → 2.7s | 273KB → 273KB |
| `/marketing/contacto.html` (móvil) | 97 → 97 | 2.4s → 2.4s | 705KB → 705KB |

El cambio grande es exactamente donde se esperaba: `asesoria/servicios.html` pasa de ser la peor página del sitio a estar en línea con el resto (LCP de 25.7s a 3.2s, un 94% menos de peso). Las variaciones de ±1 punto en el resto son ruido normal de Lighthouse entre corridas, no una regresión real. `marketing/` bajó 738KB de peso total (por las fotos optimizadas que usa) aunque su score de Performance no cambió — su cuello de botella no eran esas imágenes.

Accesibilidad no cambió en ninguna página (96-100, con los mismos 3 fallos de contraste ya documentados) porque ese fix está pendiente de tu elección (6.3-A).

### 6.6 Qué falta para cerrar la Fase 3

Solo tus respuestas a 6.3 (A, B, C) y a "quién gestiona el DNS" en 6.4. En cuanto las tenga, aplico esos 3 cambios, corro Lighthouse una vez más si el de contraste toca CSS visible, y quedamos listos para la Fase 4.
