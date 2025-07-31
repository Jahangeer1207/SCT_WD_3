const quizData = [
  {
    type: "single",
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: ["Mars"],
  },
  {
    type: "multi",
    question: "Select all programming languages:",
    options: ["Python", "HTML", "CSS", "Java"],
    answer: ["Python", "Java"],
  },
  {
    type: "fill",
    question: "Fill in the blank: The capital of France is _____.",
    answer: ["paris"],
  },
  {
    type: "single",
    question: "Which company developed JavaScript?",
    options: ["Google", "Microsoft", "Netscape", "Apple"],
    answer: ["Netscape"],
  },
];

let currentQuestion = 0;
let score = 0;
let userAnswers = [];

const quizContainer = document.getElementById("quiz");
const resultsContainer = document.getElementById("results");
const submitButton = document.getElementById("submit");
const restartButton = document.getElementById("restart");
const themeToggle = document.getElementById("themeToggle");

// 🎵 Sound Effects (Play after user interaction)
let startSound, correctSound, wrongSound;
document.body.addEventListener("click", initSounds, { once: true });

function initSounds() {
  startSound = new Audio(
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_7f9ec7057a.mp3?filename=click-124467.mp3"
  );
  correctSound = new Audio(
    "https://cdn.pixabay.com/download/audio/2021/09/17/audio_2942a352c7.mp3?filename=correct-6033.mp3"
  );
  wrongSound = new Audio(
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_cce1772b3d.mp3?filename=wrong-47985.mp3"
  );
}

function loadQuestion() {
  const currentQuiz = quizData[currentQuestion];
  let output = `<div class="question"><h3>${currentQuiz.question}</h3></div>`;

  if (currentQuiz.type === "single") {
    output += currentQuiz.options
      .map(
        (opt) =>
          `<label class="option"><input type="radio" name="question" value="${opt}">${opt}</label>`
      )
      .join("");
  } else if (currentQuiz.type === "multi") {
    output += currentQuiz.options
      .map(
        (opt) =>
          `<label class="option"><input type="checkbox" name="question" value="${opt}">${opt}</label>`
      )
      .join("");
  } else if (currentQuiz.type === "fill") {
    output += `<input type="text" id="fillAnswer" placeholder="Type your answer">`;
  }

  quizContainer.innerHTML = output;
}

function getAnswer() {
  const currentQuiz = quizData[currentQuestion];
  if (currentQuiz.type === "single") {
    const selected = document.querySelector("input[name='question']:checked");
    return selected ? [selected.value] : [];
  } else if (currentQuiz.type === "multi") {
    const selected = document.querySelectorAll(
      "input[name='question']:checked"
    );
    return Array.from(selected).map((el) => el.value);
  } else if (currentQuiz.type === "fill") {
    const fillInput = document.getElementById("fillAnswer");
    return fillInput ? [fillInput.value.trim().toLowerCase()] : [];
  }
}

function checkAnswer(answer, index = currentQuestion) {
  const correctAnswer = quizData[index].answer.map((a) => a.toLowerCase());
  answer = answer.map((a) => a.toLowerCase());

  if (quizData[index].type === "multi") {
    return (
      correctAnswer.length === answer.length &&
      correctAnswer.every((a) => answer.includes(a))
    );
  } else {
    return JSON.stringify(correctAnswer) === JSON.stringify(answer);
  }
}

function showResults() {
  quizContainer.innerHTML = "";
  submitButton.style.display = "none";
  restartButton.style.display = "inline-block";

  let resultsHTML = `<h2>Your Score: ${score}/${quizData.length}</h2><p>Congratulations! You answered ${score} questions correctly.</p><ul>`;

  quizData.forEach((q, i) => {
    const userAnswer = userAnswers[i] || ["No Answer"];
    const isCorrect = checkAnswer(userAnswer, i);

    resultsHTML += `<li>
      <strong>Q${i + 1}:</strong> ${q.question} <br>
      <strong>Your Answer:</strong> ${userAnswer.join(", ")} <br>
      <strong>Correct Answer:</strong> ${q.answer.join(", ")} <br>
      <span style="color:${isCorrect ? "green" : "red"}">${
      isCorrect ? "✔ Correct" : "❌ Wrong"
    }</span>
    </li><br>`;
  });

  resultsHTML += "</ul>";
  resultsContainer.innerHTML = resultsHTML;
}

submitButton.addEventListener("click", () => {
  const answer = getAnswer();
  userAnswers[currentQuestion] = answer || [];

  if (currentQuestion === 0 && startSound) startSound.play();

  if (checkAnswer(answer)) {
    score++;
    correctSound && correctSound.play();
  } else {
    wrongSound && wrongSound.play();
  }

  currentQuestion++;

  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
});

restartButton.addEventListener("click", () => {
  startSound && startSound.play();
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  submitButton.style.display = "inline-block";
  restartButton.style.display = "none";
  resultsContainer.innerHTML = "";
  loadQuestion();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = document.body.classList.contains("dark-mode")
    ? "☀ Light Mode"
    : "🌙 Dark Mode";
});

loadQuestion();
