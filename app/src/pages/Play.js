import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import { AudienceChart } from '../components/AudienceChart';
import { Lifelines } from '../components/Lifelines';
import { MoneyLadder } from '../components/MoneyLadder';
import { QuestionCard } from '../components/QuestionCard';
import { Timer } from '../components/Timer';
import { LETTERS, TIME_PER_QUESTION } from '../data';
import { calcPrize, createAudiencePercentages } from '../utils';

export const Play = () => {
  const { questions, loading, error, playerName, saveGame } = useOutletContext();
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [status, setStatus] = useState('answering');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [endingReason, setEndingReason] = useState(null);
  const [hiddenAnswers, setHiddenAnswers] = useState([]);
  const [usedLifelines, setUsedLifelines] = useState([]);
  const [audiencePercentages, setAudiencePercentages] = useState(null);
  const question = questions[questionIndex];
  const questionNumber = questionIndex + 1;

  const finishGame = useCallback((reason, finalCorrectCount = correctCount) => {
    const result = {
      name: playerName,
      correctCount: finalCorrectCount,
      prize: calcPrize(finalCorrectCount, reason),
      reason,
    };
    saveGame(result);
    navigate('/result', { replace: true, state: result });
  }, [correctCount, navigate, playerName, saveGame]);

  const chooseAnswer = useCallback((index) => {
    if (status !== 'answering' || hiddenAnswers.includes(index)) return;
    setSelectedIndex(index);
    setEndingReason(null);
    setStatus('locked');
  }, [hiddenAnswers, status]);

  useEffect(() => {
    if (status !== 'answering') return undefined;
    const intervalId = window.setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          setSelectedIndex(null);
          setEndingReason('timeout');
          setStatus('locked');
          return 0;
        }
        return currentTime - 1;
      });
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [status]);

  useEffect(() => {
    if (status === 'locked') {
      const revealTimeout = window.setTimeout(() => setStatus('revealed'), 1000);
      return () => window.clearTimeout(revealTimeout);
    }
    if (status === 'revealed' && question) {
      const nextTimeout = window.setTimeout(() => {
        const isCorrect = endingReason !== 'timeout' && selectedIndex === question.answer;
        if (!isCorrect) {
          finishGame(endingReason === 'timeout' ? 'timeout' : 'wrong');
          return;
        }
        const nextCorrectCount = correctCount + 1;
        if (questionIndex === questions.length - 1) {
          finishGame('win', nextCorrectCount);
          return;
        }
        setCorrectCount(nextCorrectCount);
        setQuestionIndex((currentIndex) => currentIndex + 1);
        setTimeLeft(TIME_PER_QUESTION);
        setSelectedIndex(null);
        setEndingReason(null);
        setHiddenAnswers([]);
        setAudiencePercentages(null);
        setStatus('answering');
      }, 2000);
      return () => window.clearTimeout(nextTimeout);
    }
    return undefined;
  }, [correctCount, endingReason, finishGame, question, questionIndex, questions.length, selectedIndex, status]);

  useEffect(() => {
    const handleKey = (event) => {
      const key = event.key.toLocaleUpperCase();
      const answerIndex = LETTERS.indexOf(key);
      if (answerIndex !== -1 && !hiddenAnswers.includes(answerIndex)) chooseAnswer(answerIndex);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [chooseAnswer, hiddenAnswers]);

  useEffect(() => {
    document.title = `Câu ${questionNumber}/15 – ${playerName}`;
    return () => { document.title = 'Ai là triệu phú'; };
  }, [playerName, questionNumber]);

  const useFiftyFifty = () => {
    if (status !== 'answering' || usedLifelines.includes('fifty') || !question) return;
    const wrongOptions = question.options.map((option, index) => ({ option, index }))
      .filter(({ index }) => index !== question.answer)
      .map(({ index }) => index)
      .sort(() => Math.random() - 0.5);
    setHiddenAnswers(wrongOptions.slice(0, 2));
    setUsedLifelines((current) => [...current, 'fifty']);
  };

  const askAudience = () => {
    if (status !== 'answering' || usedLifelines.includes('audience') || !question) return;
    setAudiencePercentages(createAudiencePercentages(question.answer, hiddenAnswers));
    setUsedLifelines((current) => [...current, 'audience']);
  };

  if (!playerName) return <Navigate to="/" replace />;
  if (loading) return <p className="panel status-message">Đang tải câu hỏi...</p>;
  if (error || !question) return <p className="panel status-message error-text">Không tải được câu hỏi.</p>;

  return (
    <div className="game-layout">
      <div className="game-main">
        <div className="game-toolbar"><span className="player-badge">{`Người chơi: ${playerName}`}</span><Timer seconds={timeLeft} /></div>
        <QuestionCard
          question={question}
          questionNumber={questionNumber}
          status={status}
          selectedIndex={selectedIndex}
          hiddenAnswers={hiddenAnswers}
          onAnswer={chooseAnswer}
        />
        <Lifelines
          usedLifelines={usedLifelines}
          onFiftyFifty={useFiftyFifty}
          onAudience={askAudience}
          onQuit={() => finishGame('quit')}
          disabled={status !== 'answering'}
        />
        {audiencePercentages && <AudienceChart percentages={audiencePercentages} />}
      </div>
      <MoneyLadder questionNumber={questionNumber} />
    </div>
  );
};
