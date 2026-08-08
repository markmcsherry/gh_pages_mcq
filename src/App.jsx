import React, { useEffect, useState } from "react";

function App() {
  const quizUrl = getQuizUrl();
  const [quiz, setQuiz] = useState(null);
  const [attemptQuestions, setAttemptQuestions] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [theme, setTheme] = useState(null);
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    if (!quizUrl) return;

    let cancelled = false;

    async function loadQuiz() {
      try {
        const response = await fetch(quizUrl);
        if (!response.ok) throw new Error("Quiz data could not be loaded.");
        const quizData = await response.json();
        if (!cancelled) {
          setQuiz(quizData);
          setAttemptQuestions(createAttemptQuestions(quizData));
        }
      } catch {
        if (!cancelled) setLoadError(true);
      }
    }

    loadQuiz();
    return () => { cancelled = true; };
  }, [quizUrl]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = (event) => setSystemPrefersDark(event.matches);

    mediaQuery.addEventListener("change", updateSystemTheme);
    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  const question = attemptQuestions[currentQuestion];
  const unansweredCount = attemptQuestions.length - Object.keys(answers).length;

  function selectAnswer(answer) {
    setAnswers({ ...answers, [question.id]: answer });
  }

  function restartQuiz() {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
    setAttemptQuestions(createAttemptQuestions(quiz));
  }

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  const isDark = theme === "dark" || (theme === null && systemPrefersDark);

  return (
    <div className="app" data-theme={theme ?? undefined}>
      <header className="top-bar">
        <span className="brand">MCQ</span>
        <div className="theme-control">
          <button className="theme-toggle" type="button" role="switch" aria-checked={isDark} aria-label="Use dark mode" onClick={toggleTheme}>
            <span>Light</span>
            <span className={`theme-track ${isDark ? "dark" : ""}`} aria-hidden="true"><span className="theme-thumb" /></span>
            <span>Dark</span>
          </button>
        </div>
      </header>

      <main className="content">
        {!quizUrl ? (
          <MissingQuiz />
        ) : loadError ? (
          <section className="status-card" role="alert">
            <h1>Quiz unavailable</h1>
            <p>We could not load this quiz. Please try again later.</p>
          </section>
        ) : !quiz ? (
          <section className="status-card" aria-live="polite">
            <p>Loading quiz...</p>
          </section>
        ) : isComplete ? (
          <Results questions={attemptQuestions} answers={answers} onRestart={restartQuiz} />
        ) : (
          <QuizQuestion
            quiz={quiz}
            question={question}
            questionNumber={currentQuestion + 1}
            totalQuestions={attemptQuestions.length}
            questions={attemptQuestions}
            answers={answers}
            selectedAnswer={answers[question.id]}
            unansweredCount={unansweredCount}
            onSelectAnswer={selectAnswer}
            onGoToQuestion={setCurrentQuestion}
            onPrevious={() => setCurrentQuestion(currentQuestion - 1)}
            onNext={() => setCurrentQuestion(currentQuestion + 1)}
            onSubmit={() => setIsComplete(true)}
          />
        )}
      </main>
    </div>
  );
}

function createAttemptQuestions(quiz) {
  const questions = quiz.randomizeQuestions ? shuffle(quiz.questions) : [...quiz.questions];

  return questions.map((question) => ({
    ...question,
    displayAnswers: quiz.randomizeAnswers ? shuffle(Object.entries(question.answers)) : Object.entries(question.answers),
  }));
}

function shuffle(items) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]];
  }

  return shuffledItems;
}

function getQuizUrl() {
  const quizId = new URLSearchParams(window.location.search).get("quiz");

  if (!quizId || !/^[a-z\d]+(?:-[a-z\d]+)*$/.test(quizId)) {
    return null;
  }

  return new URL(`data/${quizId}.json`, window.location.href).href;
}

function MissingQuiz() {
  return (
    <section className="status-card" aria-labelledby="missing-quiz-title">
      <div className="eyebrow">Quiz required</div>
      <h1 id="missing-quiz-title">Choose a quiz to begin</h1>
      <p>Add a quiz identifier to this page's URL. For example:</p>
      <code>?quiz=sample-quiz</code>
    </section>
  );
}

function QuizQuestion({
  quiz,
  question,
  questionNumber,
  totalQuestions,
  questions,
  answers,
  selectedAnswer,
  unansweredCount,
  onSelectAnswer,
  onGoToQuestion,
  onPrevious,
  onNext,
  onSubmit,
}) {
  const isFirstQuestion = questionNumber === 1;
  const isLastQuestion = questionNumber === totalQuestions;

  return (
    <section className="quiz-card" aria-labelledby="quiz-title">
      <div className="eyebrow">Knowledge check</div>
      <h1 id="quiz-title">{quiz.title}</h1>
      <p className="description">{quiz.description}</p>

      <div className="progress-header">
        <span>Question {questionNumber} of {totalQuestions}</span>
        <span>{unansweredCount} unanswered</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-value" style={{ width: `${(questionNumber / totalQuestions) * 100}%` }} />
      </div>

      <nav className="question-navigator" aria-label="Question navigator">
        <span className="navigator-label">Jump to question</span>
        <StatusKey />
        <div className="navigator-buttons">
          {questions.map((navigatorQuestion, index) => {
            const isCurrent = index === questionNumber - 1;
            const isAnswered = Object.hasOwn(answers, navigatorQuestion.id);
            const status = isAnswered ? "answered" : "unanswered";

            return (
              <button
                className={`question-jump ${isCurrent ? "current" : ""} ${isAnswered ? "answered" : ""}`}
                type="button"
                key={navigatorQuestion.id}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Question ${index + 1}, ${status}${isCurrent ? ", current question" : ""}`}
                onClick={() => onGoToQuestion(index)}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </nav>

      <fieldset className="question">
        <legend>{question.question}</legend>
        <div className="answers">
          {question.displayAnswers.map(([key, answer], index) => (
            <label className={`answer ${selectedAnswer === key ? "selected" : ""}`} key={key}>
              <input type="radio" name={question.id} value={key} checked={selectedAnswer === key} onChange={() => onSelectAnswer(key)} />
              <span className="answer-key" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
              <span>{answer}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="actions">
        <button className="button secondary" type="button" onClick={onPrevious} disabled={isFirstQuestion}>Back</button>
        {isLastQuestion ? (
          <div className="submit-area">
            <p>{unansweredCount > 0 ? `${unansweredCount} unanswered question${unansweredCount === 1 ? "" : "s"} will count as incorrect.` : "Ready to submit your quiz."}</p>
            <button className="button primary" type="button" onClick={onSubmit}>Submit quiz</button>
          </div>
        ) : (
          <button className="button primary" type="button" onClick={onNext}>Next</button>
        )}
      </div>
    </section>
  );
}

function Results({ questions, answers, onRestart }) {
  const incorrectQuestions = questions.filter((question) => answers[question.id] !== question.correctAnswer);
  const score = questions.length - incorrectQuestions.length;

  return (
    <section className="results" aria-labelledby="results-title">
      <div className="score-card">
        <div className="eyebrow">Quiz complete</div>
        <h1 id="results-title">You scored {score} out of {questions.length}</h1>
        <p>{score === questions.length ? "Excellent recall." : "Review the answers below to reinforce the topic."}</p>
        <button className="button primary" type="button" onClick={onRestart}>Take the quiz again</button>
      </div>

      <section className="outcome-map" aria-labelledby="outcome-map-title">
        <h2 id="outcome-map-title">Question results</h2>
        <StatusKey results />
        <div className="outcome-markers">
          {questions.map((question, index) => {
            const isAnswered = Object.hasOwn(answers, question.id);
            const isCorrect = answers[question.id] === question.correctAnswer;
            const status = isCorrect ? "correct" : isAnswered ? "incorrect" : "unanswered";

            return (
              <span className={`outcome-marker ${status}`} key={question.id} aria-label={`Question ${index + 1}, ${status}`}>
                {index + 1}
              </span>
            );
          })}
        </div>
      </section>

      {incorrectQuestions.length > 0 && (
        <section className="review" aria-labelledby="review-title">
          <h2 id="review-title">Review incorrect answers</h2>
          <ol>
            {incorrectQuestions.map((question) => (
              <li key={question.id}>
                <h3>{question.question}</h3>
                <p>Your answer: <strong>{answers[question.id] ? question.answers[answers[question.id]] : "Not answered"}</strong></p>
                <p>Correct answer: <strong>{question.answers[question.correctAnswer]}</strong></p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </section>
  );
}

function StatusKey({ results = false }) {
  const items = results
    ? [["correct", "Correct"], ["incorrect", "Incorrect"], ["unanswered", "Unanswered"]]
    : [["current", "Current"], ["answered", "Answered"], ["unanswered", "Unanswered"]];

  return (
    <ul className="status-key" aria-label={results ? "Question result key" : "Question navigation key"}>
      {items.map(([status, label]) => (
        <li key={status}><span className={`status-swatch ${status}`} aria-hidden="true" />{label}</li>
      ))}
    </ul>
  );
}

export default App;
