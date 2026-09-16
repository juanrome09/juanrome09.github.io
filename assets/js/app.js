const FORM_KEY = '{{FORM_KEY}}';

document.addEventListener('DOMContentLoaded', () => {
  iniciarCabeceraCompacta();
  iniciarMenuMovil();
  iniciarReveals();
  iniciarAcordeon();
  iniciarAnioFooter();
  iniciarFormulario();
  iniciarHeroScrubMarketing();
  iniciarMaquinaEscribir();
  iniciarCopiarCorreo();
  iniciarNavAdaptativa();
});

function iniciarCabeceraCompacta() {
  const cabecera = document.querySelector('.cabecera');
  if (!cabecera) return;

  const actualizar = () => {
    cabecera.classList.toggle('compacta', window.scrollY > 80);
  };
  actualizar();
  window.addEventListener('scroll', actualizar, { passive: true });
}

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

function iniciarAnioFooter() {
  document.querySelectorAll('[data-anio]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

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
