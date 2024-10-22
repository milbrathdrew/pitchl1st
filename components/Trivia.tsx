'use client';

import { useState, useEffect } from 'react';

interface TriviaQuestion {
  id: string;
  question: {
    text: string;
  };
  correctAnswer: string;
  incorrectAnswers: string[];
}

export default function Trivia() {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    console.log('Fetching questions...');
    setLoading(true);
    setError(null);
    setScore(0);
    setQuizCompleted(false);
    try {
      const response = await fetch('/api/trivia');
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      console.log('Received data:', data);
      setQuestions(data);
      setCurrentQuestionIndex(0);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load trivia questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestionIndex]?.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const shuffleAnswers = (question: TriviaQuestion) => {
    return [...question.incorrectAnswers, question.correctAnswer].sort(() => Math.random() - 0.5);
  };

  if (loading) return <div>Loading trivia questions...</div>;
  if (error) return <div>Error: {error}</div>;
  if (questions.length === 0) return null;

  if (quizCompleted) {
    return (
      <div className="trivia-container">
        <h2 className="trivia-title">Quiz Completed!</h2>
        <p className="trivia-question">Your score: {score} out of {questions.length}</p>
        <button onClick={fetchQuestions} className="trivia-next-button">
          Start New Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answers = shuffleAnswers(currentQuestion);

  return (
    <div className="trivia-container">
      <h2 className="trivia-title">Trivia Question {currentQuestionIndex + 1} of {questions.length}</h2>
      <p className="trivia-question">{currentQuestion.question.text}</p>
      <div>
        {answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(answer)}
            className={`trivia-answer-button ${
              selectedAnswer === answer
                ? isCorrect
                  ? 'trivia-answer-button-correct'
                  : 'trivia-answer-button-incorrect'
                : 'trivia-answer-button-default'
            }`}
            disabled={selectedAnswer !== null}
          >
            {answer}
          </button>
        ))}
      </div>
      {selectedAnswer && (
        <div className="trivia-feedback">
          <p style={{ color: isCorrect ? '#10b981' : '#ef4444' }}>
            {isCorrect ? 'Correct!' : 'Incorrect. The correct answer was: ' + currentQuestion.correctAnswer}
          </p>
          <button
            onClick={nextQuestion}
            className="trivia-next-button"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}
      <p className="trivia-score">Current Score: {score}/{currentQuestionIndex + 1}</p>
    </div>
  );
}
