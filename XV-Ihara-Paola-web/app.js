(function () {
  var C = window.CONFIG;
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  };
  // Separa cada línea en letras; la numeración sigue de una línea a la siguiente para que aparezcan en orden
  var letras = function (lineas) {
    var n = 0;
    return lineas.map(function (t) {
      return Array.from(t).map(function (c) { return '<span class="l" style="--i:' + (n++) + '">' + esc(c) + "</span>"; }).join("");
    });
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

  document.title = C.tituloPagina;
  document.querySelector('meta[name="description"]').content = C.descripcion;

  var fecha = letras(C.fechaTexto);
  var celdas = ["Días", "Horas", "Min", "Seg"].map(function (l, i) {
    return '<div class="sello"><b data-cd="' + i + '">00</b><span>' + l + "</span></div>";
  }).join("");

  document.getElementById("app").innerHTML =
    '<audio id="song" preload="auto" src="' + C.cancion + '"></audio>' +
    '<button class="musica" id="musicBtn" aria-label="Música">&#9835;</button>' +
    '<main class="marco"><div class="carta">' +
    '<p class="c-invito">' + letras([C.invito])[0] + "</p>" +
    '<img class="c-corona" src="assets/corona.webp" alt="">' +
    '<p class="c-mis">' + esc(C.mis) + "</p>" +
    flor("izq") + flor("der") +
    '<p class="c-xv">' + esc(C.xv) + "</p>" +
    '<p class="c-anos">' + esc(C.anos) + "</p>" +
    '<h1 class="c-nombre">' + esc(C.nombre) + "</h1>" +
    linea("c-linea", 125) +
    '<p class="c-arriba">' + letras([C.tematicaArriba])[0] + "</p>" +
    '<p class="c-tema">' + esc(C.tematica) + "</p>" +
    '<div class="c-mensaje">' + letras(C.mensaje).map(function (l) { return "<p>" + l + "</p>"; }).join("") + "</div>" +
    linea("c-linea2", 120) +
    '<p class="c-fecha">' + fecha[0] + "<b>" + fecha[1] + "</b></p>" +
    '<div class="c-conteo" id="countdown"><p class="b-titulo">' + esc(C.tituloConteo) + '</p><div class="conteo">' + celdas + "</div></div>" +
    '<p class="c-aviso">' + esc(C.aviso) + "</p>" +
    "</div></main>";

  // La animación espera a las letras para no arrancar con otra tipografía
  var empezar = function () { document.body.classList.add("listo"); };
  document.fonts.ready.then(empezar);
  setTimeout(empezar, 1500);

  // ---- Cuenta regresiva ----
  var target = new Date(C.fechaEvento).getTime();
  var nums = document.querySelectorAll("[data-cd]");
  function tick() {
    var d = Math.max(0, target - Date.now());
    if (d === 0) {
      document.getElementById("countdown").innerHTML = '<p class="b-gran">' + esc(C.textoGranDia) + "</p>";
      clearInterval(timer);
      return;
    }
    [Math.floor(d / 864e5), Math.floor(d / 36e5 % 24), Math.floor(d / 6e4 % 60), Math.floor(d / 1e3 % 60)].forEach(function (v, i) {
      nums[i].textContent = String(v).padStart(2, "0");
    });
  }
  var timer = setInterval(tick, 1000);
  tick();

  // ---- Música: el navegador solo la deja sonar después del primer toque ----
  var song = document.getElementById("song"), btn = document.getElementById("musicBtn");
  var songStart = C.inicioCancion || 0;
  song.volume = 0.8;
  song.addEventListener("loadedmetadata", function () { if (song.currentTime < songStart) song.currentTime = songStart; });
  song.addEventListener("ended", function () { song.currentTime = songStart; song.play().catch(function () {}); });
  song.addEventListener("play", function () { btn.classList.add("sonando"); });
  song.addEventListener("pause", function () { btn.classList.remove("sonando"); });
  btn.addEventListener("click", function (e) { e.stopPropagation(); off(); song.paused ? song.play().catch(function () {}) : song.pause(); });
  var first = function () { off(); song.play().catch(function () {}); };
  var off = function () { window.removeEventListener("pointerdown", first); };
  window.addEventListener("pointerdown", first);
})();
