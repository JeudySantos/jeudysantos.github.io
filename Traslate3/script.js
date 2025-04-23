
const fromText = document.getElementById("from-text");
const toText = document.getElementById("to-text");
const fromLang = document.getElementById("from-lang");
const toLang = document.getElementById("to-lang");
const translateBtn = document.getElementById("translate-btn");
const swapBtn = document.getElementById("swap-btn");

// Lista de idiomas disponibles
const languages = {
  "en": "Inglés",
  "es": "Español",
  "fr": "Francés",
  "de": "Alemán",
  "it": "Italiano",
  "pt": "Portugués",
  "ja": "Japonés",
  "ar": "Árabe",
  "zh-CN": "Chino (Simplificado)"
};

// Función para rellenar los selectores de idioma
function populateLanguages(selectElement) {
  Object.entries(languages).forEach(([code, name]) => {
    const option = document.createElement("option");
    option.value = code;
    option.text = name;
    selectElement.appendChild(option);
  });
}

// Inicializar idiomas
populateLanguages(fromLang);
populateLanguages(toLang);
fromLang.value = "en";
toLang.value = "es";

// Función para traducir texto
function translateText(text, from, to) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  return fetch(url).then(res => res.json());
}

// Evento para el botón traducir
translateBtn.addEventListener("click", () => {
  const text = fromText.value.trim();
  const from = fromLang.value;
  const to = toLang.value;

  if (!text) {
    toText.value = "Por favor escribe algo para traducir.";
    return;
  }

  toText.value = "Traduciendo...";
  translateBtn.disabled = true;

  translateText(text, from, to)
    .then(data => {
      toText.value = data.responseData.translatedText || "Traducción no disponible.";
    })
    .catch(error => {
      toText.value = "Error al traducir.";
      console.error("Error:", error);
    })
    .finally(() => {
      translateBtn.disabled = false;
    });
});

// Evento para botón de intercambio
swapBtn.addEventListener("click", () => {
  const tempLang = fromLang.value;
  fromLang.value = toLang.value;
  toLang.value = tempLang;

  const tempText = fromText.value;
  fromText.value = toText.value;
  toText.value = tempText;
});

// Limpiar traducción si se escribe algo nuevo
fromText.addEventListener("input", () => {
  toText.value = "";
});

const playVoiceBtn = document.getElementById("play-voice");

playVoiceBtn.addEventListener("click", () => {
  const text = toText.value.trim();
  const lang = toLang.value;

  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  // Asegura usar una voz compatible con el idioma
  const voices = speechSynthesis.getVoices();
  const matchingVoice = voices.find(voice => voice.lang.startsWith(lang));
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  speechSynthesis.speak(utterance);
});

