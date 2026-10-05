"use strict";

// Encabezado
const header = document.querySelector(".header");

function actualizarHeader() {
  header?.classList.toggle("con-fondo", window.scrollY > 40);
}

window.addEventListener("scroll", actualizarHeader, {
  passive: true,
});

actualizarHeader();

// Aparición de títulos, textos, tarjetas y galería
const movimientoReducido = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

const elementosRevelar = document.querySelectorAll(
  ".revelar, .hero-contenido > *, .seccion > .etiqueta, " +
  ".seccion > h2, .contacto > p, .galeria-fotos, " +
  ".controles-galeria"
);

let observadorRevelar = null;

if (
  !movimientoReducido.matches &&
  "IntersectionObserver" in window
) {
  observadorRevelar = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observadorRevelar.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elementosRevelar.forEach((elemento) => {
    elemento.classList.add("revelar", "animacion-lista");
    observadorRevelar.observe(elemento);
  });
}

movimientoReducido.addEventListener("change", () => {
  if (movimientoReducido.matches) {
    observadorRevelar?.disconnect();

    elementosRevelar.forEach((elemento) => {
      elemento.classList.add("visible");
    });
  }
});

// Menú de tres rayitas
const botonMenu = document.querySelector(".menu-boton");
const menuPrincipal = document.querySelector("#menu-principal");

if (botonMenu && menuPrincipal) {
  botonMenu.hidden = false;

  function actualizarMenu(abierto) {
    menuPrincipal.hidden = !abierto;

    botonMenu.setAttribute(
      "aria-expanded",
      String(abierto)
    );

    botonMenu.setAttribute(
      "aria-label",
      abierto ? "Cerrar menú" : "Abrir menú"
    );
  }

  botonMenu.addEventListener("click", () => {
    const abierto =
      botonMenu.getAttribute("aria-expanded") === "true";

    actualizarMenu(!abierto);
  });

  menuPrincipal.addEventListener("click", (evento) => {
    if (evento.target.closest("a")) {
      actualizarMenu(false);
      botonMenu.focus({ preventScroll: true });
    }
  });

  document.addEventListener("click", (evento) => {
    if (
      !botonMenu.contains(evento.target) &&
      !menuPrincipal.contains(evento.target)
    ) {
      actualizarMenu(false);
    }
  });

  document.addEventListener("keydown", (evento) => {
    if (
      evento.key === "Escape" &&
      !menuPrincipal.hidden
    ) {
      actualizarMenu(false);
      botonMenu.focus({ preventScroll: true });
    }
  });

  document.addEventListener("focusin", (evento) => {
    if (
      !botonMenu.contains(evento.target) &&
      !menuPrincipal.contains(evento.target)
    ) {
      actualizarMenu(false);
    }
  });
}

// Formulario: prepara la consulta para WhatsApp
const formulario = document.querySelector("#formulario-evento");
const estado = document.querySelector("#estado-formulario");

if (formulario && estado) {
  const fecha = formulario.elements.namedItem("fecha");
  const hoy = new Date();

  const fechaLocal = [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, "0"),
    String(hoy.getDate()).padStart(2, "0"),
  ].join("-");

  if (fecha) {
    fecha.min = fechaLocal;
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!formulario.reportValidity()) return;

    const datos = new FormData(formulario);

    const leer = (campo) =>
      String(datos.get(campo) || "").trim();

    const nombre = leer("nombre");

    if (!nombre) {
      estado.textContent = "Escribí tu nombre y apellido.";
      formulario.elements.namedItem("nombre").focus();
      return;
    }

    const [anio, mes, dia] = leer("fecha").split("-");

    const mensaje = [
      "Hola, quiero consultar por un evento en Hipocampo Playa.",
      `Nombre y apellido: ${nombre}`,
      `Correo: ${leer("correo")}`,
      `Tipo de evento: ${leer("evento")}`,
      `Cantidad de personas: ${leer("personas")}`,
      `Fecha estimada: ${dia}/${mes}/${anio}`,
      leer("telefono")
        ? `Teléfono: ${leer("telefono")}`
        : "",
      leer("mensaje")
        ? `Mi idea: ${leer("mensaje")}`
        : "",
    ]
      .filter((linea) => linea !== "")
      .join("\n");

    const enlace =
      "https://wa.me/5492254599425?text=" +
      encodeURIComponent(mensaje);

    const alternativa = document.createElement("a");

    alternativa.href = enlace;
    alternativa.target = "_blank";
    alternativa.rel = "noopener noreferrer";
    alternativa.textContent = "Abrir mi consulta en WhatsApp";
    alternativa.style.textDecoration = "underline";

    estado.replaceChildren(
      document.createTextNode(
        "Revisá el mensaje antes de enviarlo. "
      ),
      alternativa
    );

    window.open(
      enlace,
      "_blank",
      "noopener,noreferrer"
    );
  });
}

// Efecto visual de agua: ondas y reflejos suaves
const canvas = document.querySelector("#efecto-agua");
const contexto = canvas?.getContext("2d");
const hero = document.querySelector(".hero");

if (canvas && contexto && hero) {
  let ancho = 0;
  let alto = 0;
  let cuadro = null;
  let heroVisible = true;

  function ajustarCanvas() {
    const escala = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    ancho = hero.clientWidth;
    alto = hero.clientHeight;

    canvas.width = Math.round(ancho * escala);
    canvas.height = Math.round(alto * escala);

    contexto.setTransform(
      escala,
      0,
      0,
      escala,
      0,
      0
    );

    if (movimientoReducido.matches) {
      dibujarAgua(0);
    }
  }

  function dibujarAgua(tiempo) {
    contexto.clearRect(0, 0, ancho, alto);

    const segundos = tiempo / 1000;

    for (let i = 0; i < 7; i++) {
      const base = alto * (0.38 + i * 0.09);
      const amplitud = 12 + i * 4;

      contexto.beginPath();

      for (let x = 0; x <= ancho + 12; x += 12) {
        const y =
          base +
          Math.sin(
            x * 0.006 + segundos * 0.28 + i
          ) * amplitud +
          Math.cos(
            x * 0.003 - segundos * 0.18 + i
          ) * 12;

        if (x === 0) {
          contexto.moveTo(x, y);
        } else {
          contexto.lineTo(x, y);
        }
      }

      contexto.strokeStyle =
        `rgba(255,255,255,${0.07 + i * 0.012})`;

      contexto.lineWidth = 2 + i * 0.6;
      contexto.stroke();
    }

    const brilloX =
      ancho * (
        0.72 + Math.sin(segundos * 0.1) * 0.035
      );

    const brilloY = alto * 0.28;
    const radio = Math.max(ancho, alto) * 0.48;

    if (!radio) return;

    const brillo = contexto.createRadialGradient(
      brilloX,
      brilloY,
      0,
      brilloX,
      brilloY,
      radio
    );

    brillo.addColorStop(
      0,
      "rgba(255,255,255,0.12)"
    );

    brillo.addColorStop(
      1,
      "rgba(255,255,255,0)"
    );

    contexto.fillStyle = brillo;
    contexto.fillRect(0, 0, ancho, alto);
  }

  function animar(tiempo) {
    cuadro = null;

    if (
      document.hidden ||
      !heroVisible ||
      movimientoReducido.matches
    ) {
      return;
    }

    dibujarAgua(tiempo);
    cuadro = requestAnimationFrame(animar);
  }

  function actualizarAnimacion() {
    if (cuadro !== null) {
      cancelAnimationFrame(cuadro);
      cuadro = null;
    }

    if (movimientoReducido.matches) {
      dibujarAgua(0);
    } else if (!document.hidden && heroVisible) {
      cuadro = requestAnimationFrame(animar);
    }
  }

  window.addEventListener(
    "resize",
    ajustarCanvas
  );

  document.addEventListener(
    "visibilitychange",
    actualizarAnimacion
  );

  movimientoReducido.addEventListener(
    "change",
    actualizarAnimacion
  );

  if ("IntersectionObserver" in window) {
    const observadorHero = new IntersectionObserver(
      (entradas) => {
        heroVisible = entradas[0].isIntersecting;
        actualizarAnimacion();
      }
    );

    observadorHero.observe(hero);
  }

  ajustarCanvas();
  actualizarAnimacion();
}

// Carrusel: movimiento automático y controles
const carrusel = document.querySelector(
  ".galeria-fotos.carrusel"
);

function cambiarFoto(direccion) {
  if (!carrusel || !carrusel.clientWidth) return;

  const cantidad =
    carrusel.querySelectorAll("img").length;

  if (!cantidad) return;

  const actual = Math.round(
    carrusel.scrollLeft / carrusel.clientWidth
  );

  const siguiente =
    (actual + direccion + cantidad) % cantidad;

  carrusel.scrollTo({
    left: siguiente * carrusel.clientWidth,
    behavior: movimientoReducido.matches
      ? "instant"
      : "smooth",
  });
}

if (carrusel) {
  let pausa = false;

  const zonaGaleria =
    carrusel.closest(".galeria") || carrusel;

  zonaGaleria.addEventListener("mouseenter", () => {
    pausa = true;
  });

  zonaGaleria.addEventListener("mouseleave", () => {
    pausa = false;
  });

  carrusel.addEventListener("keydown", (evento) => {
    if (
      evento.key === "ArrowLeft" ||
      evento.key === "ArrowRight"
    ) {
      evento.preventDefault();

      cambiarFoto(
        evento.key === "ArrowRight" ? 1 : -1
      );
    }
  });

  setInterval(() => {
    if (
      pausa ||
      zonaGaleria.contains(document.activeElement) ||
      document.hidden ||
      movimientoReducido.matches ||
      carrusel.querySelectorAll("img").length < 2 ||
      carrusel.clientWidth === 0
    ) {
      return;
    }

    const posicion =
      carrusel.getBoundingClientRect();

    if (
      posicion.bottom <= 0 ||
      posicion.top >= window.innerHeight
    ) {
      return;
    }

    cambiarFoto(1);
  }, 5000);
}

document
  .getElementById("foto-anterior")
  ?.addEventListener("click", () => {
    cambiarFoto(-1);
  });

document
  .getElementById("foto-siguiente")
  ?.addEventListener("click", () => {
    cambiarFoto(1);
  });// Propuestas de Celebraciones de fin de año
const botonPropuestas = document.querySelector("#abrir-propuestas");
const seccionPropuestas = document.querySelector("#propuestas");

if (botonPropuestas && seccionPropuestas) {
  function mostrarPropuestas(abiertas) {
    seccionPropuestas.hidden = !abiertas;

    botonPropuestas.setAttribute(
      "aria-expanded",
      String(abiertas)
    );

    botonPropuestas.textContent = abiertas
      ? "Ocultar las propuestas ↑"
      : "Ver las tres propuestas →";
  }

  function irAPropuestas() {
    mostrarPropuestas(true);

    seccionPropuestas.scrollIntoView({
      behavior: movimientoReducido.matches ? "instant" : "smooth",
      block: "start",
    });
  }

  botonPropuestas.addEventListener("click", () => {
    if (seccionPropuestas.hidden) {
      irAPropuestas();
    } else {
      mostrarPropuestas(false);
    }
  });

  document.querySelectorAll('a[href="#propuestas"]').forEach(
    (enlace) => {
      enlace.addEventListener("click", (evento) => {
        evento.preventDefault();
        irAPropuestas();
      });
    }
  );

  function revisarEnlacePropuestas() {
    if (window.location.hash === "#propuestas") {
      irAPropuestas();
    }
  }

  window.addEventListener("hashchange", revisarEnlacePropuestas);
  revisarEnlacePropuestas();
}// Cerrar las propuestas desde el botón inferior
const botonCerrarPropuestas = document.querySelector(
  "#cerrar-propuestas"
);

if (
  botonCerrarPropuestas &&
  botonPropuestas &&
  seccionPropuestas
) {
  botonCerrarPropuestas.addEventListener("click", () => {
    seccionPropuestas.hidden = true;

    botonPropuestas.setAttribute("aria-expanded", "false");
    botonPropuestas.textContent = "Ver las tres propuestas →";

    botonPropuestas.focus({ preventScroll: true });

    botonPropuestas.closest(".tarjeta").scrollIntoView({
      behavior: movimientoReducido.matches ? "instant" : "smooth",
      block: "center",
    });
  });
}// Movimiento de la ola al desplazarse
(() => {
  const portada = document.querySelector(".hero");
  if (!portada) return;

  const reducirMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let cuadroPendiente = false;

  function actualizarOla() {
    cuadroPendiente = false;

    const alturaInicial = window.innerWidth <= 760 ? 120 : 220;
    const posicion = portada.getBoundingClientRect();
    const recorrido = Math.max(portada.offsetHeight * 0.7, 1);

    const progreso = reducirMovimiento.matches
      ? 0
      : Math.min(1, Math.max(0, -posicion.top / recorrido));

    const altura = alturaInicial * (1 - progreso * 0.9);

    portada.style.setProperty(
      "--altura-ola",
      `${altura.toFixed(1)}px`
    );
  }

  function solicitarActualizacion() {
    if (cuadroPendiente) return;

    cuadroPendiente = true;
    requestAnimationFrame(actualizarOla);
  }

  window.addEventListener("scroll", solicitarActualizacion, {
    passive: true
  });

  window.addEventListener("resize", solicitarActualizacion);

  reducirMovimiento.addEventListener(
    "change",
    solicitarActualizacion
  );

  actualizarOla();
})();// Carrusel de eventos
(() => {
  const carruselEventos = document.querySelector(".eventos-carrusel");
  if (!carruselEventos) return;

  const ventana = carruselEventos.querySelector(".eventos-ventana");
  const tarjetas = [...carruselEventos.querySelectorAll(".evento-slide")];
  const controles = carruselEventos.querySelector(".eventos-controles");
  const anterior = document.querySelector("#evento-anterior");
  const siguiente = document.querySelector("#evento-siguiente");
  const posicion = document.querySelector("#evento-posicion");

  if (
    !ventana ||
    !tarjetas.length ||
    !controles ||
    !anterior ||
    !siguiente ||
    !posicion
  ) {
    return;
  }

  const reducirMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  let actual = 0;
  let cuadroPendiente = false;

  function actualizarPosicion() {
    cuadroPendiente = false;
    if (!ventana.clientWidth) return;

    actual = Math.min(
      tarjetas.length - 1,
      Math.max(0, Math.round(ventana.scrollLeft / ventana.clientWidth))
    );

    posicion.textContent = `${actual + 1} / ${tarjetas.length}`;
  }

  function irAEvento(indice, inmediato = false) {
    actual = (indice + tarjetas.length) % tarjetas.length;

    ventana.scrollTo({
      left: actual * ventana.clientWidth,
      behavior:
        inmediato || reducirMovimiento.matches ? "instant" : "smooth"
    });
  }

  anterior.addEventListener("click", () => {
    irAEvento(actual - 1);
  });

  siguiente.addEventListener("click", () => {
    irAEvento(actual + 1);
  });

  ventana.addEventListener("keydown", (evento) => {
    if (evento.target !== ventana) return;

    if (evento.key === "ArrowRight") {
      evento.preventDefault();
      irAEvento(actual + 1);
    } else if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      irAEvento(actual - 1);
    }
  });

  ventana.addEventListener(
    "scroll",
    () => {
      if (cuadroPendiente) return;
      cuadroPendiente = true;
      requestAnimationFrame(actualizarPosicion);
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    irAEvento(actual, true);
  });

  controles.hidden = tarjetas.length < 2;
  actualizarPosicion();
})();