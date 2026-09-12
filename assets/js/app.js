/* ==========================================================================
   A360 — app.js
   JS vanilla compartido por las 8 páginas interiores: cabecera compacta,
   menú móvil, reveals, acordeón, año del footer y envío de formulario.
   Sin jQuery, sin librerías de animación.
   ========================================================================== */

// Clave de acceso de Web3Forms (https://web3forms.com). Sustituir antes de publicar.
const FORM_KEY = '{{FORM_KEY}}';

document.addEventListener('DOMContentLoaded', () => {
  iniciarCabeceraCompacta();
  iniciarMenuMovil();
  iniciarReveals();
  iniciarAcordeon();
  iniciarAnioFooter();
  iniciarFormulario();
  iniciarSeccionesApiladas();
  iniciarHeroScrubMarketing();
  iniciarMaquinaEscribir();
  iniciarCopiarCorreo();
});

/* ---------- Cabecera: se compacta al pasar 80px ---------- */
function iniciarCabeceraCompacta() {
  const cabecera = document.querySelector('.cabecera');
  if (!cabecera) return;

  const actualizar = () => {
    cabecera.classList.toggle('compacta', window.scrollY > 80);
  };
  actualizar();
  window.addEventListener('scroll', actualizar, { passive: true });
}

/* ---------- Menú móvil: pantalla completa, foco atrapado, Esc cierra ---------- */
function iniciarMenuMovil() {
  const abrir = document.querySelector('[data-menu-abrir]');
  const cerrar = document.querySelector('[data-menu-cerrar]');
  const menu = document.querySelector('.menu-movil');
  if (!abrir || !menu) return;

  let ultimoFoco = null;

  const focosDelMenu = () =>
    Array.from(menu.querySelectorAll('a, button:not([disabled])'));

  const abrirMenu = () => {
    ultimoFoco = document.activeElement;
    menu.setAttribute('data-abierto', 'true');
    abrir.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const focos = focosDelMenu();
    if (focos.length) focos[0].focus();
  };

  const cerrarMenu = () => {
    menu.setAttribute('data-abierto', 'false');
    abrir.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (ultimoFoco) ultimoFoco.focus();
  };

  abrir.addEventListener('click', abrirMenu);
  if (cerrar) cerrar.addEventListener('click', cerrarMenu);

  menu.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
      cerrarMenu();
      return;
    }
    if (evento.key !== 'Tab') return;

    const focos = focosDelMenu();
    if (!focos.length) return;
    const primero = focos[0];
    const ultimo = focos[focos.length - 1];

    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  });

  menu.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', cerrarMenu);
  });
}

/* ---------- Reveals: opacity + translateY al 20% de visibilidad, una sola vez ---------- */
function iniciarReveals() {
  const elementos = document.querySelectorAll('.reveal');
  if (!elementos.length) return;

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elementos.forEach((el) => el.classList.add('en-vista'));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas, obs) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('en-vista');
          obs.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  elementos.forEach((el, indice) => {
    el.style.setProperty('--indice', indice % 5);
    observador.observe(el);
  });

  // Red de seguridad: si por lo que sea el observer no llega a disparar
  // para algo que ya está a la vista al cargar (pestaña en segundo plano,
  // navegador raro, lo que sea), no se queda invisible para siempre.
  window.setTimeout(() => {
    elementos.forEach((el) => {
      if (el.classList.contains('en-vista')) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('en-vista');
        observador.unobserve(el);
      }
    });
  }, 1200);
}

/* ---------- Marketing: apilado de páginas — pegar solo lo que cabe ----------
   En móvil, cada sección de Marketing se queda fija (sticky) mientras la
   siguiente sube y la tapa. Eso solo se ve bien si la sección entera cabe
   en una pantalla; si no, se queda "pegada" mucho más de lo que dura el
   scroll y da sensación de web rota. Qué secciones caben no es algo que
   se pueda fijar a mano de una vez: depende del texto real, del tamaño
   de letra del sistema y del ancho exacto del teléfono (incluso el
   héroe puede no caber en un teléfono muy estrecho). Así que en vez de
   una lista fija de "estas sí, estas no", se mide la altura real de
   cada sección y se le añade .mk-seccion-larga solo si no entra —
   marketing.css le quita el sticky a esas. */
function iniciarSeccionesApiladas() {
  if (!document.body.classList.contains('marketing')) return;
  // El cierre queda fuera: es corto a propósito (ver marketing.css) y
  // siempre va en scroll normal, no según lo que mida aquí.
  const secciones = Array.from(
    document.querySelectorAll('main > section, main > article')
  ).filter((seccion) => !seccion.classList.contains('cierre-marketing'));
  if (!secciones.length) return;

  let ignorarObservador = false;
  let pendiente = null;
  const ajustar = () => {
    if (ignorarObservador) return;
    // Pequeño retardo en vez de requestAnimationFrame: agrupa llamadas
    // seguidas (varios listeners pueden disparar a la vez) sin depender
    // del pipeline de pintado, que en pestañas en segundo plano puede
    // tardar en correr.
    if (pendiente) window.clearTimeout(pendiente);
    pendiente = window.setTimeout(() => {
      if (window.innerWidth > 768) {
        secciones.forEach((seccion) => seccion.classList.remove('mk-seccion-larga'));
      } else {
        // Ojo: .mk-seccion-larga no solo quita el sticky, también reduce
        // el padding superior (no necesita el hueco completo del nav si
        // ya va en scroll normal). Eso significa que medir "la altura
        // que tiene ahora mismo" no es fiable — una sección justo en el
        // límite puede medir "cabe" estando ya en modo largo (con menos
        // padding) y "no cabe" en modo normal (con más), y quedarse
        // oscilando entre los dos sin converger nunca. Por eso se quita
        // la clase ANTES de medir: siempre se decide desde el mismo
        // punto de partida (el padding completo).
        //
        // Ese vaivén (quitar la clase, medir, quizá volver a ponerla) es
        // en sí mismo un cambio de tamaño, y el ResizeObserver lo vería
        // y se dispararía a sí mismo sin parar. `ignorarObservador` le
        // dice que pase de esas notificaciones mientras dura el ajuste;
        // no basta con desconectar y reconectar, porque reconectar
        // (observe()) dispara su propio aviso inicial igualmente.
        ignorarObservador = true;
        secciones.forEach((seccion) => {
          seccion.classList.remove('mk-seccion-larga');
          const cabe = seccion.getBoundingClientRect().height <= window.innerHeight + 24;
          seccion.classList.toggle('mk-seccion-larga', !cabe);
        });
        window.setTimeout(() => { ignorarObservador = false; }, 0);
      }
      pendiente = null;
    }, 50);
  };

  // ResizeObserver en vez de una lista fija de "momentos en los que
  // podría cambiar el alto" (fuentes, imágenes, orientación...): con la
  // lista fija, si la tipografía web tardaba en intercambiarse
  // (font-display: swap) después del último reajuste programado, la
  // sección se quedaba con una clasificación caducada para siempre —
  // pegada cuando ya no cabía, o al revés. El ResizeObserver avisa de
  // cualquier cambio real de alto en cualquier sección, venga de donde
  // venga, así que nunca se queda desactualizado.
  if ('ResizeObserver' in window) {
    const observador = new ResizeObserver(ajustar);
    secciones.forEach((seccion) => observador.observe(seccion));
  } else {
    // Navegadores sin ResizeObserver (rarísimo hoy): red de seguridad
    // con los disparadores de antes.
    window.addEventListener('load', ajustar);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(ajustar).catch(() => {});
    }
    window.setTimeout(ajustar, 1200);
  }

  ajustar();
  window.addEventListener('resize', ajustar, { passive: true });
  window.addEventListener('orientationchange', () => window.setTimeout(ajustar, 300));
}

/* ---------- Acordeón de preguntas frecuentes ---------- */
function iniciarAcordeon() {
  const preguntas = document.querySelectorAll('.acordeon__pregunta');
  preguntas.forEach((boton) => {
    boton.addEventListener('click', () => {
      const expandido = boton.getAttribute('aria-expanded') === 'true';
      const respuesta = document.getElementById(boton.getAttribute('aria-controls'));

      boton.setAttribute('aria-expanded', String(!expandido));
      if (respuesta) {
        respuesta.style.maxHeight = expandido ? '0px' : respuesta.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- Año del footer ---------- */
function iniciarAnioFooter() {
  document.querySelectorAll('[data-anio]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* ---------- Formulario de contacto: validación + envío a Web3Forms ---------- */
function iniciarFormulario() {
  const formulario = document.querySelector('[data-formulario-contacto]');
  if (!formulario) return;

  const estado = formulario.querySelector('.formulario__estado');

  const mensajesError = {
    valueMissing: 'Este campo es obligatorio.',
    typeMismatch: 'Revisa el formato: no parece un correo válido.',
    patternMismatch: 'El formato no es correcto.',
  };

  const mostrarError = (campo, mensaje) => {
    const contenedor = campo.closest('.campo, .campo-consentimiento');
    if (!contenedor) return;
    contenedor.classList.add('con-error');
    const error = contenedor.querySelector('.campo__error');
    if (error) error.textContent = mensaje;
  };

  const limpiarError = (campo) => {
    const contenedor = campo.closest('.campo, .campo-consentimiento');
    if (!contenedor) return;
    contenedor.classList.remove('con-error');
  };

  const validarCampo = (campo) => {
    if (campo.validity.valid) {
      limpiarError(campo);
      return true;
    }
    const tipo = Object.keys(mensajesError).find((clave) => campo.validity[clave]);
    mostrarError(campo, mensajesError[tipo] || 'Revisa este campo.');
    return false;
  };

  formulario.querySelectorAll('input, select, textarea').forEach((campo) => {
    campo.addEventListener('blur', () => validarCampo(campo));
  });

  const mostrarEstado = (tipo, mensaje) => {
    if (!estado) return;
    estado.setAttribute('data-visible', 'true');
    estado.setAttribute('data-tipo', tipo);
    estado.textContent = mensaje;
  };

  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    // Honeypot: si el campo trampa tiene contenido, es un bot. Se ignora en silencio.
    const trampa = formulario.querySelector('[data-trampa]');
    if (trampa && trampa.value) return;

    const campos = Array.from(formulario.querySelectorAll('input, select, textarea'))
      .filter((c) => c.name !== 'trampa');
    const valido = campos.map(validarCampo).every(Boolean);
    if (!valido) {
      mostrarEstado('error', 'Revisa los campos marcados antes de enviar.');
      return;
    }

    const boton = formulario.querySelector('button[type="submit"]');
    if (boton) boton.disabled = true;

    try {
      const datos = new FormData(formulario);
      datos.append('access_key', FORM_KEY);

      const respuesta = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: datos,
      });
      const resultado = await respuesta.json();

      if (resultado.success) {
        mostrarEstado('exito', 'Gracias, hemos recibido tu mensaje. Te responderemos por correo lo antes posible.');
        formulario.reset();
      } else {
        mostrarEstado('error', 'No hemos podido enviar el mensaje. Escríbenos directamente a info@asesores360.com.');
      }
    } catch (error) {
      mostrarEstado('error', 'No hay conexión con el servidor de envío. Escríbenos directamente a info@asesores360.com.');
    } finally {
      if (boton) boton.disabled = false;
    }
  });
}

/* ---------- Héroe de Marketing: el icono de fondo sigue al ratón ----------
   Paralaje suave: el desplazamiento objetivo depende de dónde está el
   ratón respecto al centro de la ventana (no de cuánto se ha movido),
   así el icono siempre "mira" hacia el cursor en vez de poder irse a
   la deriva. La rotación y el pulso de escala son aparte, puro CSS
   (@keyframes mk-respirar-logo) — aquí solo se toca `translate`. */
function iniciarHeroScrubMarketing() {
  const logo = document.querySelector('.marketing-hero__fondo-logo');
  if (!logo) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const LIMITE_PX = 46;
  let objetivoX = 0;
  let objetivoY = 0;
  let actualX = 0;
  let actualY = 0;

  document.addEventListener('mousemove', (evento) => {
    const relX = evento.clientX / window.innerWidth - 0.5;
    const relY = evento.clientY / window.innerHeight - 0.5;
    objetivoX = relX * 2 * LIMITE_PX;
    objetivoY = relY * 2 * LIMITE_PX;
  }, { passive: true });

  const avanzar = () => {
    actualX += (objetivoX - actualX) * 0.06;
    actualY += (objetivoY - actualY) * 0.06;
    logo.style.translate = `${actualX.toFixed(1)}px ${actualY.toFixed(1)}px`;
    window.requestAnimationFrame(avanzar);
  };
  window.requestAnimationFrame(avanzar);
}

/* ---------- Héroe de Marketing: línea a máquina de escribir ---------- */
function iniciarMaquinaEscribir() {
  const parrafo = document.querySelector('[data-texto-maquina]');
  if (!parrafo) return;

  const texto = parrafo.getAttribute('data-texto-maquina') || '';
  const cursor = parrafo.querySelector('.marketing-hero__cursor');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    parrafo.textContent = texto;
    return;
  }

  const VELOCIDAD_MS = 38;
  const RETRASO_INICIAL_MS = 600;
  let indice = 0;

  const escribirSiguienteCaracter = () => {
    indice += 1;
    parrafo.textContent = texto.slice(0, indice);
    if (indice < texto.length) {
      if (cursor) parrafo.appendChild(cursor);
      window.setTimeout(escribirSiguienteCaracter, VELOCIDAD_MS);
    }
    // Al terminar, el cursor no se vuelve a añadir: queda el texto solo.
  };

  window.setTimeout(escribirSiguienteCaracter, RETRASO_INICIAL_MS);
}

/* ---------- Héroe de Marketing: copiar correo al portapapeles ---------- */
function iniciarCopiarCorreo() {
  const boton = document.querySelector('[data-copiar-correo]');
  if (!boton || !navigator.clipboard) return;

  const etiqueta = boton.querySelector('span');
  const textoOriginal = etiqueta ? etiqueta.textContent : '';

  boton.addEventListener('click', async () => {
    const correo = boton.getAttribute('data-copiar-correo');
    try {
      await navigator.clipboard.writeText(correo);
      if (etiqueta) {
        etiqueta.textContent = '¡Copiado!';
        window.setTimeout(() => { etiqueta.textContent = textoOriginal; }, 1600);
      }
    } catch (error) {
      // Sin permiso de portapapeles: el correo ya está visible en el
      // propio botón para copiarlo a mano, no hace falta avisar de nada.
    }
  });
}
