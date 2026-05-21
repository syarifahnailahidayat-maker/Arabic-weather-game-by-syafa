// =============================================
//  ARABIC WEATHER GAME — script.js
//  by: syafanaila (enhanced version)
// =============================================

// =============== SOUND ENGINE ===============
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

function playTone(freq, type = "sine", duration = 0.15, vol = 0.3) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function soundClick()   { playTone(660, "sine", 0.1, 0.2); }
function soundCorrect() {
  playTone(523, "sine", 0.12, 0.3);
  setTimeout(() => playTone(659, "sine", 0.12, 0.3), 120);
  setTimeout(() => playTone(784, "sine", 0.2, 0.4), 240);
}
function soundWrong()   {
  playTone(300, "sawtooth", 0.15, 0.3);
  setTimeout(() => playTone(220, "sawtooth", 0.2, 0.3), 150);
}
function soundTimeout() { playTone(200, "triangle", 0.3, 0.4); }
function soundLevelUp() {
  [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => playTone(f, "sine", 0.2, 0.4), i * 150));
}
function soundGameOver() {
  [400, 320, 250].forEach((f, i) => setTimeout(() => playTone(f, "sawtooth", 0.3, 0.4), i * 200));
}


// =============== QUESTION DATA ===============

// --- LEVEL 1: Word → Emoji matching ---
const questions = [
  { word: "شَمْسٌ",                answer: "☀️",  meaning: "Matahari" },
  { word: "مَطَرٌ",                answer: "🌧️", meaning: "Hujan" },
  { word: "غَيْمٌ",                answer: "☁️",  meaning: "Awan" },
  { word: "رِيَاحٌ",               answer: "💨",  meaning: "Angin" },
  { word: "مِظَلَّةٌ",             answer: "☂️",  meaning: "Payung" },
  { word: "مِعْطَفُ الْمَطَرِ",   answer: "🧥",  meaning: "Jas hujan" },
  { word: "ثَلْجٌ",                answer: "❄️",  meaning: "Salju" },
  { word: "بَرْقٌ",                answer: "⚡",  meaning: "Petir" },
  { word: "قَوْسُ قُزَحَ",         answer: "🌈",  meaning: "Pelangi" },
  { word: "نَظَّارَةٌ شَمْسِيَّةٌ", answer: "🕶️", meaning: "Kacamata hitam" },
  { word: "ضَبَابٌ",               answer: "🌫️", meaning: "Kabut" },
  { word: "عَاصِفَةٌ",             answer: "🌪️", meaning: "Badai" },
  { word: "قَمَرٌ",                answer: "🌙",  meaning: "Bulan" },
  { word: "نَجْمٌ",                answer: "⭐",  meaning: "Bintang" },
  { word: "بَرَدٌ",                answer: "🌨️", meaning: "Salju ringan" },
  { word: "رَعْدٌ",                answer: "🌩️", meaning: "Guntur" },
  { word: "طَقْسٌ",                answer: "🌤️", meaning: "Cuaca" },
  { word: "دَرَجَةُ الْحَرَارَةِ", answer: "🌡️", meaning: "Suhu" },
  { word: "صَحْوٌ",                answer: "🌞",  meaning: "Cerah" },
  { word: "جَلِيدٌ",               answer: "🧊",  meaning: "Es" },
];

// --- LEVEL 2: Sentence completion ---
const level2Questions = [
  { sentence: "كَيْفَ الْجَوُّ ☀️؟", answer: "حَارٌّ وَمُشْمِسٌ",    options: ["حَارٌّ وَمُشْمِسٌ","بَارِدٌ","مُمْطِرٌ","غَائِمٌ"] },
  { sentence: "كَيْفَ الْجَوُّ ❄️؟", answer: "بَارِدٌ جِدًّا",         options: ["بَارِدٌ جِدًّا","حَارٌّ","مُمْطِرٌ","عَاصِفٌ"] },
  { sentence: "كَيْفَ الْجَوُّ 🌧️؟", answer: "مُمْطِرٌ",               options: ["حَارٌّ","بَارِدٌ","مُمْطِرٌ","غَائِمٌ"] },
  { sentence: "كَيْفَ الْجَوُّ ☁️؟", answer: "غَائِمٌ",                options: ["حَارٌّ","بَارِدٌ","مُمْطِرٌ","غَائِمٌ"] },
  { sentence: "أَرَى فِي السَّمَاءِ 🌈", answer: "قَوْسُ قُزَحَ",     options: ["قَوْسُ قُزَحَ","شَمْسٌ","قَمَرٌ","نَجْمٌ"] },
  { sentence: "عِنْدَ الْمَطَر أَحْتَاجُ ☂️", answer: "مِظَلَّةٌ",    options: ["مِظَلَّةٌ","كِتَابٌ","قَلَمٌ","كُرْسِيٌّ"] },
  { sentence: "فِي الْبَرْد أَلْبَسُ 🧥", answer: "مِعْطَفًا",         options: ["مِعْطَفًا","سَيَّارَةٌ","بَيْتٌ","مَاءٌ"] },
  { sentence: "يَسْطَعُ فِي السَّمَاءِ ⚡", answer: "بَرْقٌ",          options: ["بَرْقٌ","غَيْمٌ","رِيَاحٌ","مَطَرٌ"] },
  { sentence: "فِي النَّهَار يُضِيءُ ☀️", answer: "شَمْسٌ",           options: ["شَمْسٌ","قَمَرٌ","غَيْمٌ","نَجْمٌ"] },
  { sentence: "السَّمَاءُ مَمْلُوءَةٌ بِـ ☁️", answer: "غُيُومٌ",     options: ["غُيُومٌ","حَارَّةٌ","بَارِدَةٌ","مُمْطِرَةٌ"] },
  { sentence: "عِنْدَ الشَّمْسِ أَضَعُ 🕶️", answer: "نَظَّارَةً شَمْسِيَّةً", options: ["نَظَّارَةً شَمْسِيَّةً","مِظَلَّةٌ","مِعْطَفٌ","حِذَاءٌ"] },
  { sentence: "كَيْفَ الْجَوُّ 🌪️؟", answer: "عَاصِفٌ",               options: ["عَاصِفٌ","صَاحٍ","مُمْطِرٌ","غَائِمٌ"] },
  { sentence: "كَيْفَ الْجَوُّ 🌫️؟", answer: "ضَبَابِيٌّ",            options: ["ضَبَابِيٌّ","حَارٌّ","بَارِدٌ","مُمْطِرٌ"] },
  { sentence: "فِي اللَّيْلِ يُضِيءُ 🌙", answer: "قَمَرٌ",            options: ["قَمَرٌ","شَمْسٌ","بَرْقٌ","نَارٌ"] },
  { sentence: "الطَّقْسُ الْيَوْمَ 🌤️", answer: "جَمِيلٌ وَمُشْمِسٌ", options: ["جَمِيلٌ وَمُشْمِسٌ","سَيِّئٌ","عَاصِفٌ","بَارِدٌ"] },
];

// --- LEVEL 3: Story comprehension ---
const level3Questions = [
  {
    story: "الْجَوُّ مُمْطِرٌ الْيَوْمَ. أَحْمَدُ أَخَذَ مِظَلَّتَهُ قَبْلَ أَنْ يَخْرُجَ.",
    question: "لِمَاذَا أَخَذَ أَحْمَدُ الْمِظَلَّةَ؟",
    options: ["لِأَنَّ الْجَوَّ مُمْطِرٌ","لِأَنَّهُ حَارٌّ","لِأَنَّهُ بَارِدٌ","لِأَنَّهُ مُشْمِسٌ"],
    answer: "لِأَنَّ الْجَوَّ مُمْطِرٌ"
  },
  {
    story: "الْجَوُّ بَارِدٌ جِدًّا. فَاطِمَةُ لَبِسَتْ مِعْطَفًا ثَقِيلًا وَقُفَّازَيْنِ.",
    question: "لِمَاذَا لَبِسَتْ فَاطِمَةُ مِعْطَفًا؟",
    options: ["لِأَنَّ الْجَوَّ بَارِدٌ","لِأَنَّهُ حَارٌّ","لِأَنَّهُ مُمْطِرٌ","لِأَنَّهُ غَائِمٌ"],
    answer: "لِأَنَّ الْجَوَّ بَارِدٌ"
  },
  {
    story: "الْجَوُّ حَارٌّ وَجَافٌّ. سَعِيدٌ يَشْرَبُ مَاءً بَارِدًا كُلَّ سَاعَةٍ.",
    question: "لِمَاذَا يَشْرَبُ سَعِيدٌ كَثِيرًا؟",
    options: ["لِأَنَّ الْجَوَّ حَارٌّ","لِأَنَّهُ بَارِدٌ","لِأَنَّهُ مُمْطِرٌ","لِأَنَّهُ عَاصِفٌ"],
    answer: "لِأَنَّ الْجَوَّ حَارٌّ"
  },
  {
    story: "السَّمَاءُ غَائِمَةٌ وَالرِّيَاحُ تَهُبُّ بِقُوَّةٍ. الْأَطْفَالُ يَلْعَبُونَ بِطَيَّارَةٍ وَرَقِيَّةٍ.",
    question: "كَيْفَ السَّمَاءُ؟",
    options: ["غَائِمَةٌ","مُشْمِسَةٌ","صَافِيَةٌ","حَارَّةٌ"],
    answer: "غَائِمَةٌ"
  },
  {
    story: "النَّاسُ يَحْمِلُونَ مَظَلَّاتٍ فِي الشَّارِعِ. الْمَطَرُ يَنْزِلُ بِغَزَارَةٍ.",
    question: "لِمَاذَا يَحْمِلُ النَّاسُ مَظَلَّاتٍ؟",
    options: ["لِأَنَّ الْمَطَرَ يَنْزِلُ","لِأَنَّ الشَّمْسَ حَارَّةٌ","لِأَنَّ الرِّيَاحَ قَوِيَّةٌ","لِأَنَّ الثَّلْجَ يَنْزِلُ"],
    answer: "لِأَنَّ الْمَطَرَ يَنْزِلُ"
  },
  {
    story: "هُنَاكَ بَرْقٌ وَرَعْدٌ شَدِيدٌ. الْأُمُّ أَغْلَقَتِ النَّوَافِذَ.",
    question: "مَاذَا يُوجَدُ فِي السَّمَاءِ؟",
    options: ["بَرْقٌ وَرَعْدٌ","شَمْسٌ","قَوْسُ قُزَحَ","غُيُومٌ فَقَطْ"],
    answer: "بَرْقٌ وَرَعْدٌ"
  },
  {
    story: "الثَّلْجُ يَغْطِّي الْأَرْضَ وَالْأَشْجَارَ. الْأَوْلَادُ يَلْعَبُونَ بِالثَّلْجِ فَرِحِينَ.",
    question: "مَاذَا يَغْطِّي الْأَرْضَ؟",
    options: ["ثَلْجٌ","مَطَرٌ","رَمْلٌ","وَرَقُ الشَّجَرِ"],
    answer: "ثَلْجٌ"
  },
  {
    story: "الْجَوُّ مُشْمِسٌ وَجَمِيلٌ. الْعَائِلَةُ ذَهَبَتْ إِلَى الشَّاطِئِ لِلسِّبَاحَةِ.",
    question: "كَيْفَ الْجَوُّ الْيَوْمَ؟",
    options: ["مُشْمِسٌ وَجَمِيلٌ","غَائِمٌ","مُمْطِرٌ","بَارِدٌ"],
    answer: "مُشْمِسٌ وَجَمِيلٌ"
  },
  {
    story: "الْوَرَقُ يَطِيرُ فِي الْهَوَاءِ. الرِّيَاحُ تَهُبُّ بِشِدَّةٍ الْيَوْمَ.",
    question: "لِمَاذَا يَطِيرُ الْوَرَقُ؟",
    options: ["بِسَبَبِ الرِّيَاحِ","بِسَبَبِ الْمَطَرِ","بِسَبَبِ الشَّمْسِ","بِسَبَبِ الثَّلْجِ"],
    answer: "بِسَبَبِ الرِّيَاحِ"
  },
  {
    story: "بَعْدَ الْمَطَرِ، ظَهَرَ قَوْسُ قُزَحَ جَمِيلٌ فِي السَّمَاءِ بِأَلْوَانٍ كَثِيرَةٍ.",
    question: "مَتَى ظَهَرَ قَوْسُ قُزَحَ؟",
    options: ["بَعْدَ الْمَطَرِ","قَبْلَ الْمَطَرِ","فِي اللَّيْلِ","فِي الصَّبَاحِ"],
    answer: "بَعْدَ الْمَطَرِ"
  },
  {
    story: "الضَّبَابُ يَغْطِّي الطَّرِيقَ. السَّيَّارَاتُ تَسِيرُ ببُطْءٍ.",
    question: "مَاذَا يَغْطِّي الطَّرِيقَ؟",
    options: ["ضَبَابٌ","ثَلْجٌ","مَطَرٌ","رِيَاحٌ"],
    answer: "ضَبَابٌ"
  },
  {
    story: "الْعَاصِفَةُ قَوِيَّةٌ جِدًّا. النَّاسُ بَقُوا فِي بُيُوتِهِمْ وَلَمْ يَخْرُجُوا.",
    question: "لِمَاذَا بَقِيَ النَّاسُ فِي بُيُوتِهِمْ؟",
    options: ["بِسَبَبِ الْعَاصِفَةِ","بِسَبَبِ الْمَطَرِ","بِسَبَبِ الْبَرْدِ","بِسَبَبِ الْحَرِّ"],
    answer: "بِسَبَبِ الْعَاصِفَةِ"
  },
];

// =============== MATERI DATA ===============
const materiL1 = [
  { word: "شَمْسٌ", emoji: "☀️", meaning: "Matahari" },
  { word: "مَطَرٌ", emoji: "🌧️", meaning: "Hujan" },
  { word: "غَيْمٌ", emoji: "☁️", meaning: "Awan" },
  { word: "رِيَاحٌ", emoji: "💨", meaning: "Angin" },
  { word: "ثَلْجٌ", emoji: "❄️", meaning: "Salju" },
  { word: "بَرْقٌ", emoji: "⚡", meaning: "Petir" },
  { word: "رَعْدٌ", emoji: "🌩️", meaning: "Guntur" },
  { word: "ضَبَابٌ", emoji: "🌫️", meaning: "Kabut" },
  { word: "عَاصِفَةٌ", emoji: "🌪️", meaning: "Badai" },
  { word: "قَوْسُ قُزَحَ", emoji: "🌈", meaning: "Pelangi" },
  { word: "مِظَلَّةٌ", emoji: "☂️", meaning: "Payung" },
  { word: "مِعْطَفُ الْمَطَرِ", emoji: "🧥", meaning: "Jas hujan" },
  { word: "نَظَّارَةٌ شَمْسِيَّةٌ", emoji: "🕶️", meaning: "Kacamata hitam" },
  { word: "جَلِيدٌ", emoji: "🧊", meaning: "Es batu" },
  { word: "قَمَرٌ", emoji: "🌙", meaning: "Bulan" },
  { word: "نَجْمٌ", emoji: "⭐", meaning: "Bintang" },
];

const materiL2 = [
  { emoji: "☀️", arabic: "حَارٌّ / مُشْمِسٌ", meaning: "Panas / Cerah" },
  { emoji: "❄️", arabic: "بَارِدٌ", meaning: "Dingin" },
  { emoji: "🌧️", arabic: "مُمْطِرٌ", meaning: "Hujan" },
  { emoji: "☁️", arabic: "غَائِمٌ", meaning: "Berawan" },
  { emoji: "🌪️", arabic: "عَاصِفٌ", meaning: "Badai" },
  { emoji: "🌫️", arabic: "ضَبَابِيٌّ", meaning: "Berkabut" },
];

const materiL3 = [
  { story: "الْجَوُّ بَارِدٌ ❄️ → فَاطِمَةُ لَبِسَتْ مِعْطَفًا 🧥", tip: "Cuaca dingin → pakai jaket" },
  { story: "الْجَوُّ مُمْطِرٌ 🌧️ → أَحْمَدُ أَخَذَ مِظَلَّتَهُ ☂️", tip: "Hujan → bawa payung" },
  { story: "الْجَوُّ حَارٌّ ☀️ → سَعِيدٌ يَشْرَبُ مَاءً 💧", tip: "Panas → minum air" },
];

// =============== GAME STATE ===============
let score = 0;
let lives = 3;
let time = 15;
let timerInterval;
let level = 1;
let currentQuestion = null;
let currentDeck = [];
let deckIndex = 0;
let totalQuestionsInSession = 10;
let questionsAnswered = 0;

// =============== SCREEN MANAGEMENT ===============
function showScreen(id) {
  soundClick();
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  if (id === "screen-materi") renderMateri();
}

// =============== RENDER MATERI ===============
function renderMateri() {
  // Level 1 vocab
  const g1 = document.getElementById("vocab-grid-l1");
  g1.innerHTML = "";
  materiL1.forEach(item => {
    const card = document.createElement("div");
    card.className = "vocab-card";
    card.innerHTML = `<span class="vocab-emoji">${item.emoji}</span>
                      <span class="vocab-arabic">${item.word}</span>
                      <span class="vocab-meaning">${item.meaning}</span>`;
    card.onclick = () => { soundClick(); card.classList.toggle("flipped"); };
    g1.appendChild(card);
  });

  // Level 2 vocab
  const g2 = document.getElementById("vocab-grid-l2");
  g2.innerHTML = "";
  materiL2.forEach(item => {
    const card = document.createElement("div");
    card.className = "vocab-card";
    card.innerHTML = `<span class="vocab-emoji">${item.emoji}</span>
                      <span class="vocab-arabic">${item.arabic}</span>
                      <span class="vocab-meaning">${item.meaning}</span>`;
    g2.appendChild(card);
  });

  // Level 3 examples
  const s3 = document.getElementById("story-examples");
  s3.innerHTML = "";
  materiL3.forEach(item => {
    const card = document.createElement("div");
    card.className = "story-example-card";
    card.innerHTML = `<p class="story-text">${item.story}</p>
                      <p class="story-tip">💡 ${item.tip}</p>`;
    s3.appendChild(card);
  });
}

// =============== START GAME ===============
function startGame(lvl) {
  soundClick();
  level = lvl;
  score = 0;
  lives = 3;
  questionsAnswered = 0;

  // Build shuffled deck for chosen level
  if (level === 1) {
    currentDeck = shuffleArray([...questions]);
    totalQuestionsInSession = 10;
  } else if (level === 2) {
    currentDeck = shuffleArray([...level2Questions]);
    totalQuestionsInSession = level2Questions.length;
  } else {
    currentDeck = shuffleArray([...level3Questions]);
    totalQuestionsInSession = level3Questions.length;
  }
  deckIndex = 0;

  updateInfo();
  showScreen("screen-game");
  document.getElementById("current-level").innerText = level;
  nextQuestion();
}

// =============== NEXT QUESTION ===============
function nextQuestion() {
  clearInterval(timerInterval);
  time = level === 3 ? 20 : 15;

  hideFeedback();

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  if (deckIndex >= currentDeck.length) deckIndex = 0;
  currentQuestion = currentDeck[deckIndex];
  deckIndex++;

  const label = document.getElementById("question-label");
  const word = document.getElementById("word");

  if (level === 1) {
    label.innerText = "Pilih emoji yang sesuai dengan kata Arab ini:";
    word.innerText = currentQuestion.word;

    let options = [currentQuestion.answer];
    while (options.length < 4) {
      let r = questions[Math.floor(Math.random() * questions.length)].answer;
      if (!options.includes(r)) options.push(r);
    }
    shuffleArray(options);
    options.forEach(o => {
      const btn = document.createElement("button");
      btn.className = "choice-btn emoji-btn";
      btn.innerText = o;
      btn.onclick = () => { soundClick(); checkAnswer(o); };
      choicesDiv.appendChild(btn);
    });

  } else if (level === 2) {
    label.innerText = "Lengkapi kalimat berikut:";
    word.innerText = currentQuestion.sentence;

    shuffleArray([...currentQuestion.options]).forEach(o => {
      const btn = document.createElement("button");
      btn.className = "choice-btn text-btn";
      btn.innerText = o;
      btn.onclick = () => { soundClick(); checkAnswer(o); };
      choicesDiv.appendChild(btn);
    });

  } else {
    label.innerText = "Baca cerita lalu jawab pertanyaan:";
    word.innerHTML = `<span class="story-text">${currentQuestion.story}</span>
                      <span class="story-question">${currentQuestion.question}</span>`;

    shuffleArray([...currentQuestion.options]).forEach(o => {
      const btn = document.createElement("button");
      btn.className = "choice-btn text-btn";
      btn.innerText = o;
      btn.onclick = () => { soundClick(); checkAnswer(o); };
      choicesDiv.appendChild(btn);
    });
  }

  updateProgress();
  startTimer();
}

// =============== CHECK ANSWER ===============
function checkAnswer(selected) {
  clearInterval(timerInterval);
  questionsAnswered++;

  const isCorrect = selected === currentQuestion.answer;

  if (isCorrect) {
    score += 10;
    soundCorrect();
    showFeedback("✅ صَحِيحٌ! Betul!", "correct");
  } else {
    lives--;
    soundWrong();
    showFeedback(`❌ خَطَأٌ! Jawaban: ${currentQuestion.answer}`, "wrong");
  }

  updateInfo();
  updateProgress();

  if (lives <= 0) {
    setTimeout(() => endGame(false), 1200);
    return;
  }

  if (questionsAnswered >= totalQuestionsInSession) {
    setTimeout(() => endGame(true), 1200);
    return;
  }

  setTimeout(nextQuestion, 1400);
}

// =============== END GAME ===============
function endGame(won) {
  clearInterval(timerInterval);
  soundLevelUp();

  const emoji   = document.getElementById("result-emoji");
  const title   = document.getElementById("result-title");
  const msg     = document.getElementById("result-msg");
  const stars   = document.getElementById("result-stars");
  const scoreEl = document.getElementById("result-score-val");

  scoreEl.innerText = score;

  const pct = (score / (totalQuestionsInSession * 10)) * 100;
  let starCount = 1;
  if (pct >= 50) starCount = 2;
  if (pct >= 80) starCount = 3;

  stars.innerHTML = "⭐".repeat(starCount) + "🌑".repeat(3 - starCount);

  if (!won) {
    soundGameOver();
    emoji.innerText = "😢";
    title.innerText = "انْتَهَتِ اللُّعْبَةُ";
    msg.innerText = "Game Over! Coba lagi ya!";
  } else if (pct === 100) {
    emoji.innerText = "🏆";
    title.innerText = "مُمْتَازٌ!";
    msg.innerText = "Sempurna! Kamu luar biasa!";
  } else if (pct >= 70) {
    emoji.innerText = "🌟";
    title.innerText = "أَحْسَنْتَ!";
    msg.innerText = "Bagus sekali! Terus berlatih!";
  } else {
    emoji.innerText = "💪";
    title.innerText = "جَيِّدٌ!";
    msg.innerText = "Cukup bagus! Pelajari materi lagi untuk hasil lebih baik!";
  }

  showScreen("screen-result");
}

// =============== QUIT ===============
function quitGame() {
  soundClick();
  clearInterval(timerInterval);
  showScreen("screen-menu");
}

// =============== TIMER ===============
function startTimer() {
  document.getElementById("timer").innerText = time;
  const timerEl = document.getElementById("timer");
  timerEl.parentElement.classList.remove("danger");

  timerInterval = setInterval(() => {
    time--;
    timerEl.innerText = time;

    if (time <= 5) timerEl.parentElement.classList.add("danger");

    if (time <= 0) {
      clearInterval(timerInterval);
      soundTimeout();
      lives--;
      updateInfo();
      questionsAnswered++;
      showFeedback(`⏰ Waktu habis! Jawaban: ${currentQuestion.answer}`, "wrong");

      if (lives <= 0) {
        setTimeout(() => endGame(false), 1400);
        return;
      }
      if (questionsAnswered >= totalQuestionsInSession) {
        setTimeout(() => endGame(true), 1400);
        return;
      }
      setTimeout(nextQuestion, 1600);
    }
  }, 1000);
}

// =============== UI HELPERS ===============
function updateInfo() {
  document.getElementById("score").innerText = score;
  document.getElementById("lives").innerText = "❤️".repeat(Math.max(0, lives));
}

function updateProgress() {
  const pct = (questionsAnswered / totalQuestionsInSession) * 100;
  document.getElementById("progress-bar").style.width = Math.min(pct, 100) + "%";
}

function showFeedback(msg, type) {
  const fb = document.getElementById("feedback");
  fb.innerText = msg;
  fb.className = "feedback " + type;
}

function hideFeedback() {
  document.getElementById("feedback").className = "feedback hidden";
}

// =============== SHUFFLE ===============
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}