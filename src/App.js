import React, { useState, useEffect } from "react";
import questionsData from "./questions.json";
import Question from "./Question";
import subgenres from "./subgenre.json";
import Result from "./Result";
import "./App.css";

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [scores, setScores] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [questions] = useState(() => shuffle(questionsData));
  const MAX_QUESTIONS = 10;

  useEffect(() => {
  if (answered.length === 10 && !finalResult) {
    const result = computeFinalResult();
    setFinalResult(result);
    setShowResult(true);
  }
}, [answered, finalResult]);

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
    loadNextQuestion(newScores);

    const topThree = Object.entries(newScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    console.log("Top 3 genres so far:");
    topThree.forEach(([genre, score], i) => {
      console.log(`#${i + 1}: ${genre} → ${score.toFixed(2)}`);
    });
  };

  const loadNextQuestion = (updatedScores) => {
    const remaining = questions.filter((_, i) => !answered.includes(i) && i !== currentIndex);
    const topGenre = getTopGenres(updatedScores)[0];

    const next = remaining.find((q) =>
      q.options.some((opt) => opt.main === topGenre)
    );

    if (next) {
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

  const computeFinalResult = () => {
    const sortedGenres = getTopGenres(scores);
    const [main, second, third] = sortedGenres;
    let subgenre = "";

    if (
      third &&
      scores[third] >= 1.25 &&
      subgenres[second]?.[third]
    ) {
      subgenre = subgenres[second][third];
    } else if (subgenres[second]?.[second]) {
      subgenre = subgenres[second][second];
    } else if (subgenres[main]?.[main]) {
      subgenre = subgenres[main][main]; // fallback
    }

    return {
      mainGenre: main,
      subGenre: subgenre || "Subgenre not found",
    };
  };

  return (
    <div className="App">
      {!showResult ? (
        <Question
          data={questions[currentIndex]}
          onSelect={handleAnswer}
          displayNumber={Math.min(answered.length + 1, MAX_QUESTIONS)}
        />
      ) : (
        finalResult && <Result result={finalResult} />
      )}
    </div>
  );
};

export default App;