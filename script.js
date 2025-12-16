const OPENWEATHER_KEY = "01aecd6600d0385b32ac426a08294831";

// 24 гонки сезона
const races = [
  {id:'race-1', raceName:'Australian GP', circuit:'Albert Park', locality:'Melbourne', country:'Australia', date:'2025-03-16', time:'05:00:00Z', img:'images/albert-park.jpg'},
  {id:'race-2', raceName:'Bahrain GP', circuit:'Bahrain International Circuit', locality:'Sakhir', country:'Bahrain', date:'2025-03-30', time:'14:00:00Z', img:'images/bahrain.jpg'},
  {id:'race-3', raceName:'Saudi Arabia GP', circuit:'Jeddah Street Circuit', locality:'Jeddah', country:'Saudi Arabia', date:'2025-04-06', time:'17:00:00Z', img:'images/jeddah.jpg'},
  {id:'race-4', raceName:'Emilia Romagna GP', circuit:'Imola', locality:'Imola', country:'Italy', date:'2025-04-20', time:'13:00:00Z', img:'images/imola.jpg'},
  {id:'race-5', raceName:'Miami GP', circuit:'Miami International Autodrome', locality:'Miami', country:'USA', date:'2025-05-04', time:'19:30:00Z', img:'images/miami.jpg'},
  {id:'race-6', raceName:'Spanish GP', circuit:'Circuit de Barcelona-Catalunya', locality:'Barcelona', country:'Spain', date:'2025-05-18', time:'14:00:00Z', img:'images/barcelona.jpg'},
  {id:'race-7', raceName:'Monaco GP', circuit:'Circuit de Monaco', locality:'Monaco', country:'Monaco', date:'2025-05-25', time:'13:00:00Z', img:'images/monaco.jpg'},
  {id:'race-8', raceName:'Canadian GP', circuit:'Circuit Gilles Villeneuve', locality:'Montreal', country:'Canada', date:'2025-06-08', time:'18:00:00Z', img:'images/montreal.jpg'},
  {id:'race-9', raceName:'Austrian GP', circuit:'Red Bull Ring', locality:'Spielberg', country:'Austria', date:'2025-06-22', time:'13:00:00Z', img:'images/austria.jpg'},
  {id:'race-10', raceName:'British GP', circuit:'Silverstone Circuit', locality:'Silversone', country:'UK', date:'2025-06-29', time:'14:00:00Z', img:'images/silverstone.jpg'},
  {id:'race-11', raceName:'Hungarian GP', circuit:'Hungaroring', locality:'Budapest', country:'Hungary', date:'2025-07-20', time:'13:00:00Z', img:'images/hungaroring.jpg'},
  {id:'race-12', raceName:'Belgian GP', circuit:'Circuit de Spa', locality:'Spa', country:'Belgium', date:'2025-07-27', time:'13:00:00Z', img:'images/spa.jpg'},
  {id:'race-13', raceName:'Dutch GP', circuit:'Circuit Zandvoort', locality:'Zandvoort', country:'Netherlands', date:'2025-08-31', time:'13:00:00Z', img:'images/zandvoort.jpg'},
  {id:'race-14', raceName:'Italian GP', circuit:'Monza Circuit', locality:'Monza', country:'Italy', date:'2025-09-07', time:'13:00:00Z', img:'images/monza.jpg'},
  {id:'race-15', raceName:'Singapore GP', circuit:'Marina Bay Street Circuit', locality:'Singapore', country:'Singapore', date:'2025-09-21', time:'13:00:00Z', img:'images/singapore.jpg'},
  {id:'race-16', raceName:'Japanese GP', circuit:'Suzuka Circuit', locality:'Suzuka', country:'Japan', date:'2025-09-28', time:'06:00:00Z', img:'images/suzuka.jpg'},
  {id:'race-17', raceName:'Qatar GP', circuit:'Losail Circuit', locality:'Lusail', country:'Qatar', date:'2025-10-05', time:'14:00:00Z', img:'images/qatar.jpg'},
  {id:'race-18', raceName:'US GP', circuit:'COTA', locality:'Austin', country:'USA', date:'2025-10-19', time:'20:00:00Z', img:'images/cota.jpg'},
  {id:'race-19', raceName:'Mexico GP', circuit:'Autódromo Hermanos Rodríguez', locality:'Mexico City', country:'Mexico', date:'2025-10-26', time:'19:00:00Z', img:'images/mexico.jpg'},
  {id:'race-20', raceName:'Brazilian GP', circuit:'Interlagos', locality:'São Paulo', country:'Brazil', date:'2025-11-02', time:'17:00:00Z', img:'images/interlagos.jpg'},
  {id:'race-21', raceName:'Las Vegas GP', circuit:'Las Vegas Street Circuit', locality:'Las Vegas', country:'USA', date:'2025-11-16', time:'01:30:00Z', img:'images/las-vegas.jpg'},
  {id:'race-22', raceName:'Abu Dhabi GP', circuit:'Yas Marina Circuit', locality:'Abu Dhabi', country:'UAE', date:'2025-12-07', time:'13:00:00Z', img:'images/abu-dhabi.jpg'},
];

// ----------------------------
// ИНИЦИАЛИЗАЦИЯ
// ----------------------------

function init() {
  races.forEach(race => {
    createCard(race);
    createModal(race);
  });
}

function createCard(race) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${race.img}" alt="${race.circuit}">
    <div class="meta">
      <div class="race-name">${race.raceName}</div>
      <div class="race-time">${race.date} ${race.time}</div>
    </div>
    <button onclick="openModal('${race.id}')">Детали</button>
  `;
  document.getElementById("races").appendChild(card);
}

function createModal(race) {
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.id = race.id;
  modal.style.display = "none";

  modal.innerHTML = `
    <div class="modal">
      <div class="header">
        <img src="${race.img}" alt="${race.circuit}">
        <div class="info">
          <h2>${race.raceName}</h2>
          <p>${race.circuit} — ${race.locality}, ${race.country}</p>
          <p data-start="${race.date} ${race.time}">Старт: ${race.date} ${race.time}</p>
        </div>
      </div>
      <div class="blocks">
        <div class="block" id="weather-${race.id}">Загрузка погоды...</div>
        <div class="block" id="clock-${race.id}">--:--:--</div>
        <div class="block" id="countdown-${race.id}">--:--:--</div>
      </div>
      <button class="close-btn" onclick="closeModal('${race.id}')">Закрыть</button>
    </div>
  `;

  document.body.appendChild(modal);
}

// ----------------------------
// ОТКРЫТИЕ / ЗАКРЫТИЕ МОДАЛКИ
// ----------------------------

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.style.display = "flex";

  startClock(id);
  startCountdown(id);
  loadWeather(id);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

// ----------------------------
// ТАЙМЕР ДО ГОНКИ
// ----------------------------

function startCountdown(id) {
  const el = document.getElementById(`countdown-${id}`);
  const startStr = document.querySelector(`#${id} .info p[data-start]`).dataset.start;
  const startTime = new Date(startStr);
  const raceDuration = 2 * 60 * 60 * 1000; // 2 часа

  const timer = setInterval(() => {
    const now = new Date();

    if (now < startTime) {
      const diff = startTime - now;
      el.textContent = formatCountdown("До старта", diff);
    } else if (now < startTime + raceDuration) {
      const diff = startTime + raceDuration - now;
      el.textContent = formatCountdown("Гонка идёт, до финиша", diff);
    } else {
      el.textContent = "Гонка закончилась!";
      clearInterval(timer);
    }
  }, 1000);
}

function formatCountdown(prefix, diff) {
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${prefix}: ${h} ч ${m} мин ${s} сек`;
}

// ----------------------------
// МИРОВЫЕ ЧАСЫ
// ----------------------------

function startClock(id) {
  const el = document.getElementById(`clock-${id}`);
  setInterval(() => {
    el.textContent = new Date().toLocaleTimeString();
  }, 1000);
}

// ----------------------------
// ПОГОДА
// ----------------------------

async function loadWeather(id) {
  const wEl = document.getElementById(`weather-${id}`);

  const locality = document
    .querySelector(`#${id} .info p:nth-child(2)`)
    .textContent.split(" — ")[1]
    .split(",")[0]
    .trim();

  if (!OPENWEATHER_KEY) {
    wEl.textContent = "Нет API ключа";
    return;
  }

  try {
    // Геокодинг
    const geo = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${locality}&limit=1&appid=${OPENWEATHER_KEY}`
    ).then(r => r.json());

    if (!geo[0]) {
      wEl.textContent = "Город не найден";
      return;
    }

    const { lat, lon } = geo[0];

    // Погода
    const w = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric&lang=ru`
    ).then(r => r.json());

    wEl.innerHTML = `
      🌡 ${w.main.temp}°C<br>
      💧 ${w.main.humidity}%<br>
      🌬 ${w.wind.speed} м/с<br>
      ☁️ ${w.clouds.all}%
    `;
  } catch (e) {
    wEl.textContent = "Ошибка погоды";
  }
}


/* second */
// ----------------------------
// СТАРТ
// ----------------------------

// ----------------------------
// NEXT EVENT (для index.html)
// ----------------------------

function renderNextRace() {
  const box = document.getElementById("next-race-box");
  if (!box || !Array.isArray(races)) return;

  const now = new Date();

  // ищем ближайшую будущую гонку
  const next = races
    .map(r => ({
      ...r,
      start: new Date(`${r.date}T${r.time}`)
    }))
    .filter(r => r.start > now)
    .sort((a, b) => a.start - b.start)[0];

  if (!next) {
    box.textContent = "Season finished";
    return;
  }

  box.innerHTML = `
    <div class="next-race-card">
      <img src="${next.img}" alt="${next.circuit}">
      <div class="info">
        <h3>${next.raceName}</h3>
        <p>${next.circuit}</p>
        <p>${next.locality}, ${next.country}</p>
        <p class="date">${next.date} • ${next.time}</p>
        <div id="next-countdown"></div>
        <a href="races.html" class="hero-btn">View calendar</a>
      </div>
    </div>
  `;

  startNextCountdown(next.start);
}

function startNextCountdown(startTime) {
  const el = document.getElementById("next-countdown");

  const timer = setInterval(() => {
    const now = new Date();
    const diff = startTime - now;

    if (diff <= 0) {
      el.textContent = "Race started!";
      clearInterval(timer);
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);

    el.textContent = `Starts in: ${d}d ${h}h ${m}m`;
  }, 60000);
}

// запуск только если мы на главной
if (document.getElementById("next-race-box")) {
  renderNextRace();
}

/* Бургер меню */

const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

if (burger && navLinks) {
  burger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}


init();








