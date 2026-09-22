/* Clave de acceso de Web3Forms — placeholder, hay que sustituirlo por la
   clave real del cliente antes de publicar o el formulario no enviará. */
const FORM_KEY = '{{FORM_KEY}}';

/* Arranque: un inicializador por función de la página */
document.addEventListener('DOMContentLoaded', () => {
  iniciarCabeceraCompacta();
  iniciarMenuMovil();
  iniciarDesplegables();
  iniciarReveals();
  iniciarAcordeon();
  iniciarAnioFooter();
  iniciarFormulario();
  iniciarHeroScrubMarketing();
  iniciarMaquinaEscribir();
  iniciarCopiarCorreo();
  iniciarNavAdaptativa();
  iniciarTransicionCambioMundo();
  iniciarTemaPuerta();
  iniciarProcesoConScroll();
  iniciarSombraTarjetas();
  iniciarChatWhatsapp();
});

/* Nav: encoge la cabecera al hacer scroll */
function iniciarCabeceraCompacta() {
  const cabecera = document.querySelector('.cabecera');
  if (!cabecera) return;

  const actualizar = () => {
    cabecera.classList.toggle('compacta', window.scrollY > 80);
  };
  actualizar();
  window.addEventListener('scroll', actualizar, { passive: true });
}

/* Nav: abre/cierra el menú a pantalla completa en móvil */
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

/* Nav: desplegables de Nosotros/Servicios (escritorio y móvil) */
function iniciarDesplegables() {
  const desplegables = Array.from(document.querySelectorAll('.desplegable'));
  if (!desplegables.length) return;

  const cerrar = (el) => {
    el.classList.remove('desplegable--abierto');
    const boton = el.querySelector('.desplegable__boton');
    if (boton) boton.setAttribute('aria-expanded', 'false');
  };

  const cerrarTodos = (excepto) => {
    desplegables.forEach((el) => {
      if (el !== excepto) cerrar(el);
    });
  };

  const puedeHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let temporizadorCierre = null;

  desplegables.forEach((el) => {
    const boton = el.querySelector('.desplegable__boton');
    if (!boton) return;

    boton.addEventListener('click', (evento) => {
      evento.stopPropagation();
      const abierto = el.classList.contains('desplegable--abierto');
      cerrarTodos(el);
      el.classList.toggle('desplegable--abierto', !abierto);
      boton.setAttribute('aria-expanded', String(!abierto));
    });

    if (puedeHover && el.closest('.nav-flotante__nav')) {
      el.addEventListener('mouseenter', () => {
        if (temporizadorCierre) {
          window.clearTimeout(temporizadorCierre);
          temporizadorCierre = null;
        }
        cerrarTodos(el);
        el.classList.add('desplegable--abierto');
        boton.setAttribute('aria-expanded', 'true');
      });
      el.addEventListener('mouseleave', () => {
        if (temporizadorCierre) window.clearTimeout(temporizadorCierre);
        temporizadorCierre = window.setTimeout(() => {
          cerrar(el);
          temporizadorCierre = null;
        }, 250);
      });
    }
  });

  document.addEventListener('click', (evento) => {
    desplegables.forEach((el) => {
      if (!el.contains(evento.target)) cerrar(el);
    });
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') cerrarTodos(null);
  });
}

/* Animación: revela los elementos .reveal al entrar en pantalla */
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

/* Animación: la sombra de las tarjetas de servicio sigue al cursor */
function iniciarSombraTarjetas() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tarjetas = document.querySelectorAll('.servicio-grande, .servicio-panel-mk');
  if (!tarjetas.length) return;

  const LIMITE_PX = 16;

  tarjetas.forEach((tarjeta) => {
    let objetivoX = 0;
    let objetivoY = 0;
    let actualX = 0;
    let actualY = 0;
    let idFotograma = null;

    const avanzar = () => {
      actualX += (objetivoX - actualX) * 0.15;
      actualY += (objetivoY - actualY) * 0.15;
      tarjeta.style.setProperty('--sx', `${actualX.toFixed(1)}px`);
      tarjeta.style.setProperty('--sy', `${actualY.toFixed(1)}px`);

      if (Math.abs(objetivoX - actualX) > 0.1 || Math.abs(objetivoY - actualY) > 0.1) {
        idFotograma = window.requestAnimationFrame(avanzar);
      } else {
        idFotograma = null;
      }
    };

    const iniciarSeguimiento = () => {
      if (idFotograma === null) idFotograma = window.requestAnimationFrame(avanzar);
    };

    tarjeta.addEventListener('mousemove', (evento) => {
      const rect = tarjeta.getBoundingClientRect();
      const relX = (evento.clientX - rect.left) / rect.width - 0.5;
      const relY = (evento.clientY - rect.top) / rect.height - 0.5;
      objetivoX = relX * 2 * LIMITE_PX;
      objetivoY = relY * 2 * LIMITE_PX;
      iniciarSeguimiento();
    });

    tarjeta.addEventListener('mouseleave', () => {
      objetivoX = 0;
      objetivoY = 0;
      iniciarSeguimiento();
    });
  });
}

/* Animación: sticky scroll de [data-scroll-activo] (Cómo trabajamos, etc.) */
function iniciarProcesoConScroll() {
  if (!('IntersectionObserver' in window)) return;

  document.querySelectorAll('[data-scroll-activo]').forEach((bloque) => {
    const pasos = bloque.querySelectorAll('.proceso__pasos [data-paso]');
    const marcadores = bloque.querySelectorAll('.proceso__progreso [data-paso]');
    if (!pasos.length || !marcadores.length) return;

    const activarPaso = (numero) => {
      marcadores.forEach((marcador) => {
        marcador.classList.toggle('proceso__marcador--activo', marcador.dataset.paso === numero);
      });
      pasos.forEach((paso) => {
        paso.classList.toggle('proceso__paso--activo', paso.dataset.paso === numero);
      });
    };

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) activarPaso(entrada.target.dataset.paso);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    pasos.forEach((paso) => observador.observe(paso));
  });
}

/* FAQ: abre/cierra las preguntas del acordeón */
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

/* Pie de página: año actual en el copyright */
function iniciarAnioFooter() {
  document.querySelectorAll('[data-anio]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* Contacto: valida y envía el formulario a Web3Forms */
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

/* Hero: el logo de fondo sigue al cursor (parallax) */
function iniciarHeroScrubMarketing() {
  const logo = document.querySelector('.marketing-hero__fondo-logo, .asesoria-hero__fondo-logo');
  const heroSeccion = document.querySelector('.marketing-hero, .asesoria-hero');
  if (!logo || !heroSeccion) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const LIMITE_PX = 46;
  let objetivoX = 0;
  let objetivoY = 0;
  let actualX = 0;
  let actualY = 0;
  let idFotograma = null;

  const alMoverRaton = (evento) => {
    const relX = evento.clientX / window.innerWidth - 0.5;
    const relY = evento.clientY / window.innerHeight - 0.5;
    objetivoX = relX * 2 * LIMITE_PX;
    objetivoY = relY * 2 * LIMITE_PX;
  };

  const avanzar = () => {
    actualX += (objetivoX - actualX) * 0.06;
    actualY += (objetivoY - actualY) * 0.06;
    logo.style.translate = `${actualX.toFixed(1)}px ${actualY.toFixed(1)}px`;
    idFotograma = window.requestAnimationFrame(avanzar);
  };

  const observador = new IntersectionObserver((entradas) => {
    const visible = entradas[0].isIntersecting;
    if (visible && idFotograma === null) {
      document.addEventListener('mousemove', alMoverRaton, { passive: true });
      idFotograma = window.requestAnimationFrame(avanzar);
    } else if (!visible && idFotograma !== null) {
      document.removeEventListener('mousemove', alMoverRaton);
      window.cancelAnimationFrame(idFotograma);
      idFotograma = null;
    }
  });
  observador.observe(heroSeccion);
}

/* Hero: efecto máquina de escribir en el subtítulo */
function iniciarMaquinaEscribir() {
  const parrafo = document.querySelector('[data-texto-maquina]');
  if (!parrafo) return;

  const texto = parrafo.getAttribute('data-texto-maquina') || '';
  const cursor = parrafo.querySelector('.marketing-hero__cursor, .asesoria-hero__cursor');

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
  };

  window.setTimeout(escribirSiguienteCaracter, RETRASO_INICIAL_MS);
}

/* Nav: cambia entre estado claro y oscuro según la sección visible */
function iniciarNavAdaptativa() {
  const esSitioConNavFlotante = document.body.classList.contains('marketing') || document.body.classList.contains('asesoria');
  if (!esSitioConNavFlotante) return;
  const nav = document.querySelector('.nav-flotante');
  const envoltorio = document.querySelector('.nav-flotante-envoltorio');
  const pie = document.querySelector('footer.pie');
  if (!nav || !envoltorio) return;

  const PROPORCION_PIE_MINIMA = .2;

  const aplicarEstado = (oscuroDetras) => {
    nav.classList.toggle('nav-flotante--oscura', !oscuroDetras);
    nav.classList.toggle('nav-flotante--clara', oscuroDetras);
  };

  const pieDomina = () => {
    if (!pie) return false;
    const visible = window.innerHeight - Math.max(pie.getBoundingClientRect().top, 0);
    return visible / window.innerHeight > PROPORCION_PIE_MINIMA;
  };

  const heroDetras = () => {
    const x = Math.round(window.innerWidth / 2);
    const y = Math.min(
      Math.round(envoltorio.getBoundingClientRect().bottom) + 8,
      window.innerHeight - 1
    );
    const elemento = document.elementFromPoint(x, y);
    return !!(elemento && elemento.closest('.marketing-hero, .asesoria-hero'));
  };

  const actualizar = () => {
    aplicarEstado(pieDomina() || heroDetras());
  };
  actualizar();

  let tramitando = false;
  const enScroll = () => {
    if (tramitando) return;
    tramitando = true;
    window.requestAnimationFrame(() => {
      actualizar();
      tramitando = false;
    });
  };
  window.addEventListener('scroll', enScroll, { passive: true });
  window.addEventListener('resize', actualizar, { passive: true });
}

/* Hero: copia el correo al portapapeles al pulsar la píldora */
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
    }
  });
}

/* Toggle Asesoría/Marketing: transición al cambiar de web */
function iniciarTransicionCambioMundo() {
  const sanearTransicion = (evento) => {
    if (evento.viewTransition) {
      evento.viewTransition.ready.catch(() => {});
      evento.viewTransition.finished.catch(() => {});
    }
  };
  if ('onpageswap' in window) window.addEventListener('pageswap', sanearTransicion);
  if ('onpagereveal' in window) {
    window.addEventListener('pagereveal', sanearTransicion);
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (!('onpagereveal' in window)) return;

  const CLAVE = 'a360-cambio-mundo';
  const nav = document.querySelector('.nav-flotante');

  if (nav) {
    let llega = false;
    try { llega = sessionStorage.getItem(CLAVE) === '1'; } catch (error) {}
    if (llega) {
      try { sessionStorage.removeItem(CLAVE); } catch (error) {}
      window.addEventListener('pagereveal', (evento) => {
        nav.style.viewTransitionName = 'cambio-mundo';
        const transicion = evento.viewTransition;
        const limpiar = () => { nav.style.viewTransitionName = ''; };
        if (transicion && transicion.finished && typeof transicion.finished.then === 'function') {
          transicion.finished.finally(limpiar);
        } else {
          window.setTimeout(limpiar, 600);
        }
      }, { once: true });
    }
  }

  const enlaces = document.querySelectorAll('.cambio-mundo-toggle__opcion:not([aria-current="true"])');
  enlaces.forEach((enlace) => {
    enlace.addEventListener('click', () => {
      enlace.style.viewTransitionName = 'cambio-mundo';
      try { sessionStorage.setItem(CLAVE, '1'); } catch (error) {}
    });
  });
}

/* Página de bienvenida: accesibilidad por teclado de las dos mitades */
function iniciarTemaPuerta() {
  const division = document.querySelector('.puerta-split');
  const metaTema = document.querySelector('meta[name="theme-color"]');
  if (!division || !metaTema) return;

  const asesoria = division.querySelector('.puerta-mitad--asesoria');
  const marketing = division.querySelector('.puerta-mitad--marketing');
  if (!asesoria || !marketing) return;

  const estilo = getComputedStyle(document.documentElement);
  const colorNaranja = estilo.getPropertyValue('--naranja').trim();
  const colorAzulHondo = estilo.getPropertyValue('--azul-hondo').trim();
  const colorPorDefecto = metaTema.getAttribute('content');

  const alDefecto = () => metaTema.setAttribute('content', colorPorDefecto);
  asesoria.addEventListener('mouseenter', () => metaTema.setAttribute('content', colorNaranja));
  asesoria.addEventListener('focus', () => metaTema.setAttribute('content', colorNaranja));
  asesoria.addEventListener('blur', alDefecto);
  marketing.addEventListener('mouseenter', () => metaTema.setAttribute('content', colorAzulHondo));
  marketing.addEventListener('focus', () => metaTema.setAttribute('content', colorAzulHondo));
  marketing.addEventListener('blur', alDefecto);
  division.addEventListener('mouseleave', alDefecto);
}

/* Botón flotante de WhatsApp: abre un mini chat con el mensaje editable antes de enviar */
function iniciarChatWhatsapp() {
  const boton = document.querySelector('.whatsapp-flotante');
  if (!boton) return;

  const coincidencia = (boton.getAttribute('href') || '').match(/wa\.me\/(\d+)\?text=(.*)$/);
  if (!coincidencia) return;
  const telefono = coincidencia[1];
  const mensajeInicial = decodeURIComponent(coincidencia[2]);

  const nombre = document.body.classList.contains('asesoria') ? 'A360 Asesoría'
    : document.body.classList.contains('marketing') ? 'A360 Marketing'
    : 'A360';

  const panel = document.createElement('div');
  panel.className = 'whatsapp-chat';
  panel.setAttribute('data-abierto', 'false');
  panel.innerHTML = `
    <div class="whatsapp-chat__cabecera">
      <span class="whatsapp-chat__avatar" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.35 5.08L2 22l5.06-1.32A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2Zm5.2 14.2c-.22.6-1.28 1.15-1.76 1.2-.45.06-1 .09-1.62-.1a13 13 0 0 1-1.48-.55c-2.6-1.12-4.3-3.75-4.43-3.92-.13-.17-1.06-1.41-1.06-2.69s.67-1.9.9-2.16c.24-.26.52-.32.7-.32l.5.01c.16 0 .37-.06.58.44.22.52.74 1.8.8 1.93.06.13.1.28.02.45-.08.17-.13.28-.26.43l-.39.46c-.13.13-.26.27-.11.53.15.26.67 1.11 1.44 1.8.99.89 1.83 1.16 2.09 1.29.26.13.41.11.56-.07.16-.17.65-.76.83-1.02.17-.26.35-.22.58-.13.24.09 1.52.72 1.78.85.26.13.43.2.5.3.06.11.06.62-.16 1.22Z"/></svg>
      </span>
      <span class="whatsapp-chat__info">
        <strong>${nombre}</strong>
        <small>Normalmente responde en el día</small>
      </span>
      <button type="button" class="whatsapp-chat__cerrar" aria-label="Cerrar chat">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="whatsapp-chat__cuerpo">
      <p class="whatsapp-chat__burbuja">¡Hola! 👋 Escribe tu mensaje (puedes cambiar el que ya te dejamos) y te respondemos por WhatsApp.</p>
    </div>
    <form class="whatsapp-chat__compositor">
      <textarea class="whatsapp-chat__campo" rows="1" aria-label="Tu mensaje para WhatsApp"></textarea>
      <button type="submit" class="whatsapp-chat__enviar" aria-label="Enviar por WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M3 11.5L21 3l-7.5 18-3-7.5-7.5-2z"/></svg>
      </button>
    </form>
  `;
  boton.insertAdjacentElement('afterend', panel);

  const campo = panel.querySelector('.whatsapp-chat__campo');
  const botonCerrar = panel.querySelector('.whatsapp-chat__cerrar');
  const formulario = panel.querySelector('.whatsapp-chat__compositor');
  let ultimoFoco = null;

  const ajustarAltura = () => {
    campo.style.height = 'auto';
    campo.style.height = `${campo.scrollHeight}px`;
  };
  campo.addEventListener('input', ajustarAltura);

  const abrirChat = () => {
    ultimoFoco = document.activeElement;
    if (!campo.value) campo.value = mensajeInicial;
    panel.setAttribute('data-abierto', 'true');
    boton.setAttribute('aria-expanded', 'true');
    window.setTimeout(() => { ajustarAltura(); campo.focus(); campo.select(); }, 10);
  };

  const cerrarChat = () => {
    panel.setAttribute('data-abierto', 'false');
    boton.setAttribute('aria-expanded', 'false');
    if (ultimoFoco) ultimoFoco.focus();
  };

  boton.setAttribute('aria-haspopup', 'dialog');
  boton.setAttribute('aria-expanded', 'false');
  boton.addEventListener('click', (evento) => {
    evento.preventDefault();
    if (panel.getAttribute('data-abierto') === 'true') cerrarChat();
    else abrirChat();
  });

  botonCerrar.addEventListener('click', cerrarChat);

  panel.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') cerrarChat();
  });

  document.addEventListener('click', (evento) => {
    if (panel.getAttribute('data-abierto') !== 'true') return;
    if (panel.contains(evento.target) || boton.contains(evento.target)) return;
    cerrarChat();
  });

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const texto = campo.value.trim();
    if (!texto) { campo.focus(); return; }
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
    cerrarChat();
  });
}
