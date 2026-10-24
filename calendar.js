(() => {
  const DAY = 86400000;
  const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

  function utcDate(year, month, day) {
    return new Date(Date.UTC(year, month, day));
  }

  function iso(date) {
    return date.toISOString().slice(0, 10);
  }

  function addDays(date, amount) {
    return new Date(date.getTime() + amount * DAY);
  }

  function daysBetween(a, b) {
    return Math.round((b.getTime() - a.getTime()) / DAY);
  }

  function sameDay(a, b) {
    return iso(a) === iso(b);
  }

  function sundayOnOrAfter(date) {
    const day = date.getUTCDay();
    return addDays(date, (7 - day) % 7);
  }

  function easterSunday(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return utcDate(year, month, day);
  }

  function adventStart(year) {
    return sundayOnOrAfter(utcDate(year, 10, 27));
  }

  function epiphanySunday(year) {
    return sundayOnOrAfter(utcDate(year, 0, 2));
  }

  function baptismOfLord(year) {
    const epiphany = epiphanySunday(year);
    return epiphany.getUTCDate() >= 7 ? addDays(epiphany, 1) : addDays(epiphany, 7);
  }

  function liturgicalCycle(date) {
    const year = date.getUTCFullYear();
    const startYear = date >= adventStart(year) ? year : year - 1;
    const cycles = ["A", "B", "C"];
    return cycles[((startYear - 2025) % 3 + 3) % 3];
  }

  function weekdayLectionaryCycle(date) {
    // Ciclo bienal do Lecionário ferial: I = ano civil ímpar, II = ano civil par.
    return date.getUTCFullYear() % 2 === 0 ? 'II' : 'I';
  }

  function seasonFor(date) {
    const year = date.getUTCFullYear();
    const easter = easterSunday(year);
    const ash = addDays(easter, -46);
    const pentecost = addDays(easter, 49);
    const advent = adventStart(year);
    const baptism = baptismOfLord(year);

    if (date >= advent && date < utcDate(year, 11, 25)) return "Advento";
    if (date >= utcDate(year, 11, 25)) return "Tempo do Natal";
    if (date <= baptism) return "Tempo do Natal";
    if (date >= ash && date < addDays(easter, -3)) return "Quaresma";
    if (date >= addDays(easter, -3) && date < easter) return "Tríduo Pascal";
    if (date >= easter && date <= pentecost) return "Tempo Pascal";
    return "Tempo Comum";
  }

  function ordinarySundayNumber(date) {
    const year = date.getUTCFullYear();
    const baptism = baptismOfLord(year);
    const easter = easterSunday(year);
    const pentecost = addDays(easter, 49);
    const christKing = addDays(adventStart(year), -7);

    if (date > baptism && date < addDays(easter, -46)) {
      const firstSunday = sundayOnOrAfter(addDays(baptism, 1));
      return 2 + Math.floor(daysBetween(firstSunday, date) / 7);
    }

    if (date > pentecost && date <= christKing) {
      return 34 - Math.floor(daysBetween(date, christKing) / 7);
    }

    return null;
  }

  function majorCelebration(date) {
    const year = date.getUTCFullYear();
    const easter = easterSunday(year);
    const ash = addDays(easter, -46);
    const palm = addDays(easter, -7);
    const holyThursday = addDays(easter, -3);
    const goodFriday = addDays(easter, -2);
    const holySaturday = addDays(easter, -1);
    const ascension = addDays(easter, 42);
    const pentecost = addDays(easter, 49);
    const trinity = addDays(easter, 56);
    const corpus = addDays(easter, 60);
    const advent = adventStart(year);
    const christKing = addDays(advent, -7);
    const epiphany = epiphanySunday(year);
    const baptism = baptismOfLord(year);
    const dec26 = utcDate(year, 11, 26);
    const holyFamilySunday = sundayOnOrAfter(dec26);
    const holyFamily = holyFamilySunday.getUTCMonth() === 11 ? holyFamilySunday : utcDate(year, 11, 30);

    // Exceção brasileira documentada pela CNBB para 01–02/11/2025 e festa de Latrão em 09/11.
    if (year === 2025 && sameDay(date, utcDate(2025, 10, 1))) return "Todos os Santos";
    if (year === 2025 && sameDay(date, utcDate(2025, 10, 2))) return "Comemoração de Todos os Fiéis Defuntos";
    if (year === 2025 && sameDay(date, utcDate(2025, 10, 9))) return "Dedicação da Basílica de Latrão";
    if (sameDay(date, utcDate(year, 0, 1))) return "Santa Maria, Mãe de Deus";
    if (sameDay(date, utcDate(year, 9, 12))) return "Nossa Senhora da Conceição Aparecida"; // Solenidade no Brasil.
    // Solenidades observadas no domingo no calendário brasileiro.
    if (sameDay(date, sundayOnOrAfter(utcDate(year, 5, 28)))) return "São Pedro e São Paulo, Apóstolos";
    if (sameDay(date, sundayOnOrAfter(utcDate(year, 7, 15)))) return "Assunção da Bem-aventurada Virgem Maria";
    if (sameDay(date, sundayOnOrAfter(utcDate(year, 10, 1)))) return "Todos os Santos";
    // Anunciação impedida pela Semana Santa ou Oitava Pascal:
    // celebra-se na segunda-feira depois do II Domingo da Páscoa.
    const annunciation = utcDate(year, 2, 25);
    const annunciationObserved = annunciation >= palm && annunciation <= addDays(easter, 7)
      ? addDays(easter, 8) : annunciation;
    if (sameDay(date, annunciationObserved)) return "Anunciação do Senhor";
    if (sameDay(date, epiphany)) return "Epifania do Senhor";
    if (sameDay(date, baptism)) return "Batismo do Senhor";
    if (sameDay(date, ash)) return "Quarta-feira de Cinzas";
    if (sameDay(date, palm)) return "Domingo de Ramos e da Paixão";
    if (sameDay(date, holyThursday)) return "Quinta-feira Santa";
    if (sameDay(date, goodFriday)) return "Sexta-feira da Paixão do Senhor";
    if (sameDay(date, holySaturday)) return "Sábado Santo";
    if (sameDay(date, easter)) return "Domingo da Páscoa";
    if (sameDay(date, ascension)) return "Ascensão do Senhor";
    if (sameDay(date, pentecost)) return "Pentecostes";
    if (sameDay(date, trinity)) return "Santíssima Trindade";
    if (sameDay(date, corpus)) return "Santíssimo Corpo e Sangue de Cristo";
    if (sameDay(date, christKing)) return "Nosso Senhor Jesus Cristo, Rei do Universo";
    if (sameDay(date, utcDate(year, 11, 25))) return "Natal do Senhor";
    if (sameDay(date, holyFamily)) return "Sagrada Família";

    if (date.getUTCDay() === 0 && date >= advent && date < utcDate(year, 11, 25)) {
      const n = 1 + Math.floor(daysBetween(advent, date) / 7);
      return n + "º Domingo do Advento";
    }

    if (date.getUTCDay() === 0 && date > ash && date < palm) {
      const first = sundayOnOrAfter(addDays(ash, 1));
      const n = 1 + Math.floor(daysBetween(first, date) / 7);
      return n + "º Domingo da Quaresma";
    }

    if (date.getUTCDay() === 0 && date > easter && date < pentecost) {
      const n = 1 + Math.floor(daysBetween(easter, date) / 7);
      return n + "º Domingo da Páscoa";
    }

    if (date.getUTCDay() === 0 && seasonFor(date) === "Tempo Comum") {
      const n = ordinarySundayNumber(date);
      if (n) return n + "º Domingo do Tempo Comum";
    }

    return "";
  }

  function infoForIso(isoDate) {
    const [y,m,d] = isoDate.split("-").map(Number);
    return infoForDate(utcDate(y, m - 1, d));
  }

  function infoForDate(date) {
    return {
      iso: iso(date),
      date,
      year: date.getUTCFullYear(),
      month: date.getUTCMonth(),
      day: date.getUTCDate(),
      weekday: date.getUTCDay(),
      cycle: liturgicalCycle(date),
      // Apenas dias úteis do Tempo Comum recebem indicador ferial.
      // Memórias/festas podem ter leitura própria, verificada separadamente.
      ferialCycle: date.getUTCDay() !== 0 && seasonFor(date) === 'Tempo Comum'
        ? weekdayLectionaryCycle(date) : null,
      season: seasonFor(date),
      celebration: majorCelebration(date)
    };
  }

  function monthMatrix(year, month) {
    const first = utcDate(year, month, 1);
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const leading = first.getUTCDay();
    const cells = [];
    for (let i = 0; i < leading; i++) cells.push(null);
    for (let day = 1; day <= lastDay; day++) cells.push(infoForDate(utcDate(year, month, day)));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }

  window.LCE_CALENDAR = {
    minYear: 2025,
    maxYear: 2031,
    monthNames,
    easterSunday,
    adventStart,
    liturgicalCycle,
    weekdayLectionaryCycle,
    seasonFor,
    majorCelebration,
    infoForIso,
    infoForDate,
    monthMatrix
  };
})();
