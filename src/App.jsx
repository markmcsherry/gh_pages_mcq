import React, { useEffect, useState } from "react";

const answerLabels = {
  a: "A",
  b: "B",
  c: "C",
  d: "D",
};

function App() {
  const quizUrl = getQuizUrl();
  const [quiz, setQuiz] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    if (!quizUrl) return;

    let cancelled = false;

    async function loadQuiz() {
      try {
        const response = await fetch(quizUrl);
        if (!response.ok) throw new Error("Quiz data could not be loaded.");
        const quizData = await response.json();
        if (!cancelled) setQuiz(quizData);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    }

    loadQuiz();
    return () => { cancelled = true; };
  }, [quizUrl]);

  const question = quiz?.questions[currentQuestion];
  const unansweredCount = quiz ? quiz.questions.length - Object.keys(answers).length : 0;

  function selectAnswer(answer) {
    setAnswers({ ...answers, [question.id]: answer });
  }

  function restartQuiz() {
    setCurrentQuestion(0);
    setAnswers({});
    setIsComplete(false);
  }

  function toggleTheme() {
    setTheme((currentTheme) => {
      if (currentTheme === "light") return "dark";
      if (currentTheme === "dark") return null;
      return "light";
    });
  }

  const themeLabel = theme === null ? "System theme" : `${theme[0].toUpperCase()}${theme.slice(1)} theme`;

  return (
    <div className="app" data-theme={theme ?? undefined}>
      <header className="top-bar">
        <span className="brand">MCQ</span>
        <button className="theme-button" type="button" onClick={toggleTheme} aria-label={`Change theme. Current setting: ${themeLabel}`}>
          <span aria-hidden="true">Theme</span>
          <span className="theme-button-label">{themeLabel}</span>
        </button>
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
          <Results quiz={quiz} answers={answers} onRestart={restartQuiz} />
        ) : (
          <QuizQuestion
            quiz={quiz}
            question={question}
            questionNumber={currentQuestion + 1}
            totalQuestions={quiz.questions.length}
            selectedAnswer={answers[question.id]}
            unansweredCount={unansweredCount}
            onSelectAnswer={selectAnswer}
            onPrevious={() => setCurrentQuestion(currentQuestion - 1)}
            onNext={() => setCurrentQuestion(currentQuestion + 1)}
            onSubmit={() => setIsComplete(true)}
          />
        )}
      </main>
    </div>
  );
}

function getQuizUrl() {
  const quizPath = new URLSearchParams(window.location.search).get("quiz");

  if (!quizPath || quizPath.startsWith("/") || /^[a-z][a-z\d+.-]*:/i.test(quizPath)) {
    return null;
  }

  return new URL(quizPath, window.location.href).href;
}

function MissingQuiz() {
  return (
    <section className="status-card" aria-labelledby="missing-quiz-title">
      <div className="eyebrow">Quiz required</div>
      <h1 id="missing-quiz-title">Choose a quiz to begin</h1>
      <p>Add a relative quiz JSON path to this page's URL. For example:</p>
      <code>?quiz=data/sample-quiz.json</code>
    </section>
  );
}

function QuizQuestion({
  quiz,
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  unansweredCount,
  onSelectAnswer,
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

      <fieldset className="question">
        <legend>{question.question}</legend>
        <div className="answers">
          {Object.entries(question.answers).map(([key, answer]) => (
            <label className={`answer ${selectedAnswer === key ? "selected" : ""}`} key={key}>
              <input type="radio" name={question.id} value={key} checked={selectedAnswer === key} onChange={() => onSelectAnswer(key)} />
              <span className="answer-key" aria-hidden="true">{answerLabels[key]}</span>
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

function Results({ quiz, answers, onRestart }) {
  const incorrectQuestions = quiz.questions.filter((question) => answers[question.id] !== question.correctAnswer);
  const score = quiz.questions.length - incorrectQuestions.length;

  return (
    <section className="results" aria-labelledby="results-title">
      <div className="score-card">
        <div className="eyebrow">Quiz complete</div>
        <h1 id="results-title">You scored {score} out of {quiz.questions.length}</h1>
        <p>{score === quiz.questions.length ? "Excellent recall." : "Review the answers below to reinforce the topic."}</p>
        <button className="button primary" type="button" onClick={onRestart}>Try again</button>
      </div>

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

export default App;
