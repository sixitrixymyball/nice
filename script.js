// --- Sidebar navigation ---
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = link.getAttribute("data-section");

    // Remove active classes
    navLinks.forEach(l => l.classList.remove("active"));
    sections.forEach(s => s.classList.remove("active-section"));

    // Add active
    link.classList.add("active");
    document.getElementById(target).classList.add("active-section");

    // Scroll main content to top
    document.querySelector(".main-content").scrollTo({ top: 0, behavior: "smooth" });
  });
});

// --- Home "Start Quiz" button ---
const startQuizBtn = document.getElementById("startQuizBtn");
startQuizBtn.addEventListener("click", () => {
  // Switch to quiz tab
  document.querySelector(".nav-link.active").classList.remove("active");
  const quizNavLink = [...navLinks].find(l => l.getAttribute("data-section") === "quiz");
  quizNavLink.classList.add("active");

  sections.forEach(s => s.classList.remove("active-section"));
  document.getElementById("quiz").classList.add("active-section");

  currentQuestion = 0;
  answers = [];
  updateQuiz();
});

// --- Quiz Data ---
const quizQuestions = [
  {
    question: "What genre do you listen to the most?",
    answers: ["Trap", "Lo-fi", "Pop", "Rock"],
  },
  {
    question: "What mood matches your current playlist?",
    answers: ["Chill", "Energetic", "Romantic", "Sad"],
  },
  {
    question: "How often do you discover new artists?",
    answers: ["All the time", "Sometimes", "Rarely", "Never"],
  },
  {
    question: "What's your favorite way to listen to music?",
    answers: ["Playlist", "Albums", "Singles", "Live recordings"],
  },
];

// Quiz state
let currentQuestion = 0;
let answers = [];

const questionContainer = document.getElementById("question-container");
const progressBar = document.getElementById("progress");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// Render question and answers
function updateQuiz() {
  const q = quizQuestions[currentQuestion];
  questionContainer.innerHTML = `<h3>${q.question}</h3>`;

  q.answers.forEach((ans, idx) => {
    const option = document.createElement("div");
    option.classList.add("answer-option");
    option.textContent = ans;

    // Highlight if selected
    if (answers[currentQuestion] === idx) option.classList.add("selected");

    option.addEventListener("click", () => {
      answers[currentQuestion] = idx;
      updateQuiz();
      updateNavButtons();
    });

    questionContainer.appendChild(option);
  });

  // Update progress bar
  progressBar.style.width = `${((currentQuestion) / quizQuestions.length) * 100}%`;

  // Update buttons
  updateNavButtons();

  // If last question, change next button to 'See Results'
  if (currentQuestion === quizQuestions.length - 1) {
    nextBtn.textContent = "See Results";
    if (answers.length === quizQuestions.length && answers.every(a => a !== undefined)) {
      nextBtn.disabled = false;
    } else {
      nextBtn.disabled = true;
    }
  } else {
    nextBtn.textContent = "Next";
  }
}

function updateNavButtons() {
  prevBtn.disabled = currentQuestion === 0;
  if (answers[currentQuestion] !== undefined) {
    nextBtn.disabled = false;
  } else {
    nextBtn.disabled = true;
  }
}

prevBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    updateQuiz();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentQuestion < quizQuestions.length - 1) {
    currentQuestion++;
    updateQuiz();
  } else {
    // Show results
    showResults();
  }
});

// Show quiz results
function showResults() {
  questionContainer.innerHTML = "<h3>Your Music Personality Result:</h3>";
  // Simple example - customize as you like
  const genre = quizQuestions[0].answers[answers[0]];
  const mood = quizQuestions[1].answers[answers[1]];
  const discovery = quizQuestions[2].answers[answers[2]];
  const listenStyle = quizQuestions[3].answers[answers[3]];

  let resultText = `You love ${genre} music and your current vibe is ${mood.toLowerCase()}. You ${discovery.toLowerCase()} discover new artists, and prefer listening to music by ${listenStyle.toLowerCase()}. This mix makes you unique and expressive! 🎶`;

  questionContainer.innerHTML += `<p style="margin-top:1rem; font-weight:700;">${resultText}</p>`;
  prevBtn.disabled = true;
  nextBtn.disabled = true;
}

// Initialize quiz disabled buttons
prevBtn.disabled = true;
nextBtn.disabled = true;

// --- Playlist Analyzer ---
const analyzeBtn = document.getElementById("analyzeBtn");
const playlistUrlInput = document.getElementById("playlistUrl");
const playlistResultDiv = document.getElementById("playlistResult");

analyzeBtn.addEventListener("click", () => {
  const url = playlistUrlInput.value.trim();
  playlistResultDiv.innerHTML = "";
  if (!url) {
    playlistResultDiv.innerHTML = `<p style="color:#f33;">Please enter a playlist URL.</p>`;
    return;
  }

  if (url.includes("spotify.com/playlist")) {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    const playlistId = match ? match[1] : null;
    if (!playlistId) {
      playlistResultDiv.innerHTML = `<p style="color:#f33;">Invalid Spotify playlist URL.</p>`;
      return;
    }
    playlistResultDiv.innerHTML = `
      <iframe src="https://open.spotify.com/embed/playlist/${playlistId}" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
      <p style="color:#1DB954; font-weight:700; margin-top:1rem;">Looks like a cool Spotify playlist! You must have great taste 🎧</p>
    `;
  } else if (url.includes("youtube.com/playlist") || url.includes("youtu.be")) {
    try {
      const urlObj = new URL(url);
      const playlistId = urlObj
