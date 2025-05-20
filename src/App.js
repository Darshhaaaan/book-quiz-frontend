import React, { useState, useEffect } from "react";
import questionsData from "./questions.json";
import Question from "./Question";
import subgenres from "./subgenre.json";
import Result from "./Result";
import "./App.css"

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const App = () => {
  const [stage, setStage] = useState("home"); // 'home' | 'quiz' | 'result'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [scores, setScores] = useState({});
  const [finalResult, setFinalResult] = useState(null);

  const startQuiz = () => {
    setQuestions(shuffle(questionsData));
    setScores({});
    setAnswered([]);
    setCurrentIndex(0);
    setFinalResult(null);
    setStage("quiz");
  };

  const handleAnswer = (option) => {
    const newScores = { ...scores };
    newScores[option.main] = (newScores[option.main] || 0) + 1;

    if (option.secondary) {
      option.secondary.forEach((genre) => {
        newScores[genre] = (newScores[genre] || 0) + 0.25;
      });
    }

    setScores(newScores);
    setAnswered([...answered, currentIndex]);

    const remaining = questions.filter((_, i) => !answered.includes(i) && i !== currentIndex);
    const topGenre = getTopGenres(newScores)[0];

    const next = remaining.find((q) =>
      q.options.some((opt) => opt.main === topGenre)
    );

    if (answered.length + 1 === 10) {
      const result = computeFinalResult(newScores);
      setFinalResult(result);
      setStage("result");
    } else if (next) {
      setCurrentIndex(questions.indexOf(next));
    } else if (remaining.length > 0) {
      setCurrentIndex(questions.findIndex((_, i) => !answered.includes(i) && i !== currentIndex));
    }
  };

  const getTopGenres = (genreScores) => {
    return Object.entries(genreScores)
      .sort((a, b) => b[1] - a[1])
      .map((g) => g[0]);
  };

  const computeFinalResult = (scores) => {
    const sortedGenres = getTopGenres(scores);
    const [main, second, third] = sortedGenres;
    let subgenre = "";

    if (third && scores[third] >= 1.25 && subgenres[second]?.[third]) {
      subgenre = subgenres[second][third];
    } else if (subgenres[second]?.[second]) {
      subgenre = subgenres[second][second];
    } else if (subgenres[main]?.[main]) {
      subgenre = subgenres[main][main];
    }

    return {
      mainGenre: main,
      subGenre: subgenre || "Subgenre not found",
    };
  };

  return (
    <div className="App">
      {stage === "home" && (
        <div className="home-screen">
          <h1>📚 Book Persona Quiz</h1>
          <p>Dive into the beautiful world of books. Get personality based book recommendations. So why wait dive right into the quiz</p>
          <button onClick={startQuiz}>Start Quiz</button>
        </div>
      )}

      {stage === "quiz" && (
        <Question
          data={questions[currentIndex]}
          onSelect={handleAnswer}
          displayNumber={Math.min(answered.length + 1, 10)}
        />
      )}

      {stage === "result" && finalResult && (
        <div>
          <Result result={finalResult} />
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button onClick={() => setStage("home")}>Try another path</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;