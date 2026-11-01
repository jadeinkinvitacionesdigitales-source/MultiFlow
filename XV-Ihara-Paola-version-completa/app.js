(function () {
  var C = window.CONFIG, I = C.img;
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  };
  var paras = function (list) { return list.map(function (t) { return "<p>" + esc(t) + "</p>"; }).join(""); };
  var sec = function (html) { return '<section><div class="reveal">' + html + "</div></section>"; };
  var dato = function (label, valor, cls) {
    return '<div class="' + (cls || "") + '"><small>' + esc(label) + "</small><strong>" + esc(valor || C.textoPendiente) + "</strong></div>";
  };
  // Destellos de color junto al XV
  var flor = function (cls) {
    return '<svg class="c-flor ' + cls + '" viewBox="0 0 60 100" aria-hidden="true">' +
      '<path fill="#f0609b" d="M57 56C37 42 18 18 15 4 7 2 3 12 8 21c8 15 28 30 49 35Z"/>' +
      '<path fill="#e3b949" d="M56 72C40 60 18 54 2 58c-3 5 2 9 12 9 15 0 30 2 42 5Z"/>' +
      '<path fill="#1aa5a8" d="M54 86C42 76 20 73 5 83c0 7 7 10 15 7 11-5 22-6 34-4Z"/></svg>';
  };
  var linea = function (cls, ancho) {
    return '<svg class="' + cls + '" viewBox="0 0 300 20" aria-hidden="true"><path d="M0 10h' + ancho + "M" + (300 - ancho) + ' 10h' + ancho + '" stroke="#c79a3a" stroke-width="1.6"/>' +
      '<path fill="#c79a3a" d="M150 18c-9-6-12-9-12-12 0-5 8-6 12-1 4-5 12-4 12 1 0 3-3 6-12 12Z"/></svg>';
  };

  // Invitado personalizado: index.html?n=Juan%20Pérez&c=2
  var params = new URLSearchParams(location.search);
  var guest = params.get("n");
  var seats = parseInt(params.get("c"), 10);

  document.title = C.tituloPagina;
  document.querySelector('meta[name="description"]').content = C.descripcion;

  var celdas = ["Días", "Horas", "Min", "Seg"].map(function (l, i) {
    return '<div class="sello"><b data-cd="' + i + '">00</b><span>' + l + "</span></div>";
  }).join("");

  document.getElementById("app").innerHTML =
    '<div class="intro" id="intro"><video id="introVideo" src="' + I.video + '#t=0.001" preload="auto" muted playsinline></video>' +
    '<div class="intro-hint" id="introHint"><span>' + esc(C.textoTocaPantalla) + "</span></div>" +
    '<button class="intro-skip" id="introSkip">SALTAR</button></div>' +
    '<audio id="song" preload="auto" src="' + I.cancion + '"></audio>' +
    '<button class="musica" id="musicBtn" aria-label="Música" hidden>&#9835;</button>' +

    '<main id="main"><div class="marco"><div class="carta">' +
    '<p class="c-invito">' + esc(C.invito) + "</p>" +
    '<img class="c-corona" src="assets/corona.webp" alt="">' +
    '<p class="c-mis">' + esc(C.mis) + "</p>" +
    flor("izq") + flor("der") +
    '<p class="c-xv">' + esc(C.xv) + "</p>" +
    '<p class="c-anos">' + esc(C.anos) + "</p>" +
    '<h1 class="c-nombre">' + esc(C.nombre) + "</h1>" +
    linea("c-linea", 125) +
    '<p class="c-arriba">' + esc(C.tematicaArriba) + "</p>" +
    '<p class="c-tema">' + esc(C.tematica) + "</p>" +
    '<div class="c-mensaje">' + paras(C.mensaje) + "</div>" +
    linea("c-linea2", 120) +
    '<p class="c-fecha">' + esc(C.fechaTexto[0]) + "<b>" + esc(C.fechaTexto[1]) + "</b></p>" +
    "</div></div>" +

    '<div class="hoja">' +
    (guest
      ? '<section class="invitado"><div class="reveal"><p>Esta invitación es especialmente para</p><strong>' + esc(guest) + "</strong>" +
        (seats ? "<p>Válida para " + seats + " " + (seats === 1 ? "persona" : "personas") + "</p>" : "") + "</div></section>"
      : "") +
    (C.foto ? sec('<div class="foto"><img src="' + esc(C.foto) + '" alt="' + esc(C.nombre) + '"></div>') : "") +
    (C.padres.length ? sec("<p>" + esc(C.textoPadres) + '</p><div class="padres-nombres">' + paras(C.padres) + "</div>") : "") +
    sec("<h2>" + esc(C.tituloConteo) + '</h2><div id="countdown"><div class="conteo">' + celdas + "</div></div>") +
    sec('<div class="pase"><div class="pase-top"><span>' + esc(C.tituloPase) + "</span><span>XV</span></div>" +
      '<div class="pase-datos">' + dato("Pasajera", C.nombre) + dato("Destino", C.destino) +
      dato("Fecha", C.fechaPase) + dato("Hora", C.hora) + dato("Lugar", C.lugar + (C.direccion ? " · " + C.direccion : ""), "ancho") + "</div>" +
      (C.linkMapa ? '<div class="pase-mapa"><a class="btn" href="' + esc(C.linkMapa) + '" target="_blank" rel="noreferrer">' + esc(C.textoBotonMapa) + "</a></div>" : "") +
      "</div>") +
    (C.galeria.length ? sec("<h2>" + esc(C.tituloGaleria) + '</h2><div class="galeria">' + C.galeria.map(function (src) {
      return '<div class="foto"><img src="' + esc(src) + '" alt="' + esc(C.nombre) + '" loading="lazy"></div>';
    }).join("") + "</div>") : "") +
    (C.textoDress ? sec("<h2>" + esc(C.tituloDress) + "</h2><p>" + esc(C.textoDress) + "</p>" +
      (C.coloresReservados.length
        ? "<p>" + esc(C.textoColoresReservados) + '</p><div class="colores">' + C.coloresReservados.map(function (c) {
            return '<span><i style="background:' + esc(c.color) + '"></i>' + esc(c.nombre) + "</span>";
          }).join("") + "</div>"
        : "")) : "") +
    (C.textoRegalos.length ? sec("<h2>" + esc(C.tituloRegalos) + "</h2>" + paras(C.textoRegalos)) : "") +
    sec("<h2>" + esc(C.tituloConfirmar) + "</h2><p>" + esc(C.textoConfirmar) + "</p>" +
      '<form class="rsvp" id="rsvpForm" novalidate>' +
      '<label class="nom" for="rsvpName">' + esc(C.textoCampoNombre) + "</label>" +
      '<input type="text" id="rsvpName" autocomplete="name" placeholder="Nombre y apellido" value="' + esc(guest || "") + '">' +
      '<div class="opciones" role="radiogroup" aria-label="¿Podrás asistir?">' +
      '<label><input type="radio" name="asiste" value="si"><span>' + esc(C.opcionSi) + "</span></label>" +
      '<label><input type="radio" name="asiste" value="no"><span>' + esc(C.opcionNo) + "</span></label></div>" +
      '<p class="rsvp-error" id="rsvpError" role="alert" hidden></p>' +
      '<button class="btn" type="submit">' + esc(C.textoBotonConfirmar) + "</button></form>") +
    '<section class="cierre"><div class="reveal"><p class="frase">' + esc(C.despedida) + '</p><p class="nom">' + esc(C.nombre) + '</p><p class="fec">' + esc(C.fechaCorta) + "</p></div></section>" +
    "</div>" +
    '<img class="banda" src="assets/rio-banda.webp" alt="" loading="lazy">' +
    "</main>";

  // ---- Formulario de confirmación ----
  document.getElementById("rsvpForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("rsvpName").value.trim();
    var choice = this.querySelector('input[name="asiste"]:checked');
    var error = document.getElementById("rsvpError");
    var problem = !name ? "Escribe tu nombre, por favor." : !choice ? "Elige si podrás asistir o no." : !C.whatsapp ? "Aún no está configurado el número de WhatsApp." : "";
    error.textContent = problem;
    error.hidden = !problem;
    if (problem) return;
    var text = (choice.value === "si" ? C.mensajeSi : C.mensajeNo).replace("{nombre}", name);
    window.open("https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(text), "_blank");
  });

  // ---- Aparición al hacer scroll ----
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  // ---- Cuenta regresiva ----
  var target = new Date(C.fechaEvento).getTime();
  var nums = document.querySelectorAll("[data-cd]");
  function tick() {
    var d = Math.max(0, target - Date.now());
    if (d === 0) {
      document.getElementById("countdown").innerHTML = "<h2>" + esc(C.textoGranDia) + "</h2>";
      clearInterval(timer);
      return;
    }
    [Math.floor(d / 864e5), Math.floor(d / 36e5 % 24), Math.floor(d / 6e4 % 60), Math.floor(d / 1e3 % 60)].forEach(function (v, i) {
      nums[i].textContent = String(v).padStart(2, "0");
    });
  }
  var timer = setInterval(tick, 1000);
  tick();

  // ---- Música ----
  var song = document.getElementById("song"), btn = document.getElementById("musicBtn"), main = document.getElementById("main");
  var songStart = C.inicioCancion || 0;
  song.volume = 0.8;
  song.addEventListener("loadedmetadata", function () { if (song.currentTime < songStart) song.currentTime = songStart; });
  song.addEventListener("ended", function () { song.currentTime = songStart; song.play().catch(function () {}); });
  song.addEventListener("play", function () { btn.classList.add("sonando"); });
  song.addEventListener("pause", function () { btn.classList.remove("sonando"); });
  btn.addEventListener("click", function () { song.paused ? song.play().catch(function () {}) : song.pause(); });

  // ---- Intro del sobre ----
  var intro = document.getElementById("intro"), video = document.getElementById("introVideo"), closing = false;
  function closeIntro() {
    if (closing) return;
    closing = true;
    main.classList.add("visible");
    btn.hidden = false;
    intro.classList.add("out");
    setTimeout(function () { intro.remove(); }, 1200);
  }
  intro.addEventListener("click", function () {
    video.play().catch(closeIntro);
    song.play().catch(function () {});
    var hint = document.getElementById("introHint"); if (hint) hint.remove();
  });
  video.addEventListener("ended", closeIntro);
  document.getElementById("introSkip").addEventListener("click", function (e) {
    e.stopPropagation();
    song.play().catch(function () {});
    closeIntro();
  });
})();
