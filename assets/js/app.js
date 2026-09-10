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
