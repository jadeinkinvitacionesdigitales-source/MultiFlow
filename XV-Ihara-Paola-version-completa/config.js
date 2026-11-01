/* =========================================================
   CONFIGURACIÓN DE LA INVITACIÓN DE IHARA PAOLA
   Cambia aquí todos los datos. No necesitas tocar otros archivos.
   Lo que quede vacío ("" o []) no se muestra en la página.
   ========================================================= */
window.CONFIG = {
  // ---- Pestaña del navegador / vista previa al compartir ----
  tituloPagina: "Mis XV años · Ihara Paola",
  descripcion: "Carnaval de Río de Janeiro. Sábado 16 de enero de 2027.",

  // ---- Carta principal ----
  invito: "Te invito a celebrar",
  mis: "Mis",
  xv: "XV",
  anos: "Años",
  nombre: "Ihara Paola",
  tematicaArriba: "Carnaval de",
  tematica: "Río de Janeiro",
  mensaje: ["Será un honor compartir", "este día tan especial", "contigo."],
  fechaTexto: ["Sábado", "16 de enero de 2027"],

  // ---- Fecha del evento (cuenta regresiva) ----
  // Formato: AAAA-MM-DDTHH:MM:SS-05:00  (-05:00 = hora de Panamá)
  // PENDIENTE: cambiar las 19:00 por la hora real
  fechaEvento: "2027-01-16T19:00:00-05:00",
  tituloConteo: "Tu vuelo a Río sale en",
  textoGranDia: "¡Llegó el gran día!",

  // ---- Pase de abordar ----
  tituloPase: "Pase de abordar",
  destino: "Río de Janeiro",
  fechaPase: "16 enero 2027",
  hora: "",                     // PENDIENTE, ejemplo: "7:00 PM"
  lugar: "",                    // PENDIENTE
  direccion: "",                // opcional
  linkMapa: "",                 // PENDIENTE: pega el link de Google Maps
  textoBotonMapa: "Cómo llegar",
  textoPendiente: "Por confirmar",

  // ---- Padres (lista vacía [] = no se muestra) ----
  textoPadres: "Con la bendición de Dios y el amor de mis padres",
  padres: [],

  // ---- Foto principal y galería (vacío = no se muestran) ----
  // Guarda las fotos en la carpeta assets, ejemplo: foto: "assets/ihara-1.jpg"
  foto: "",
  tituloGaleria: "Postales",
  galeria: [],

  // ---- Código de vestimenta (vacío = no se muestra) ----
  tituloDress: "Equipaje",
  textoDress: "",
  textoColoresReservados: "Colores reservados para la quinceañera",
  coloresReservados: [],        // ejemplo: [{ nombre: "Rosa", color: "#D92B6F" }]

  // ---- Regalos (lista vacía [] = no se muestra) ----
  tituloRegalos: "Obsequios",
  textoRegalos: [],

  // ---- Confirmación por WhatsApp ----
  tituloConfirmar: "Confirma tu asistencia",
  textoConfirmar: "Queremos preparar cada detalle especialmente para ti.",
  whatsapp: "",                 // PENDIENTE: número con indicativo, sin + ni espacios (ej. 50761234567)
  textoCampoNombre: "Tu nombre",
  opcionSi: "Sí asistiré",
  opcionNo: "No podré asistir",
  mensajeSi: "Hola, soy {nombre}. ✅ Confirmo que SÍ asistiré a los XV años de Ihara Paola.",
  mensajeNo: "Hola, soy {nombre}. Lamentablemente NO podré asistir a los XV años de Ihara Paola.",
  textoBotonConfirmar: "Enviar por WhatsApp",

  // ---- Cierre ----
  despedida: "Río te espera",
  fechaCorta: "16 · 01 · 2027",

  // ---- Intro del sobre y música ----
  textoTocaPantalla: "Toca el sobre para abrir",
  inicioCancion: 0,             // segundo donde empieza a sonar la canción

  img: {
    video: "assets/sobre.mp4",
    cancion: "assets/magalenha.mp3"
  }
};
