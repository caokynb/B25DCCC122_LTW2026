const BUILD_TAG = "tp-4186";
/* eslint-disable import/first */

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { NotFound } from './pages/NotFound';
import { Play } from './pages/Play';
import { QuestionBank } from './pages/QuestionBank';
import { QuestionDetail } from './pages/QuestionDetail';
import { Result } from './pages/Result';

void BUILD_TAG;

const HISTORY_KEY = 'ltw_trieuphu_history';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const controller = new AbortController();
    axios.get('/data/questions.json', { signal: controller.signal })
      .then(({ data }) => setQuestions(data))
      .catch((err) => {
        if (!axios.isCancel(err) && err.code !== 'ERR_CANCELED') setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const saveGame = (result) => {
    const record = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: result.name,
      prize: result.prize,
      correctCount: result.correctCount,
      playedAt: new Date().toLocaleString('vi-VN'),
    };
    setHistory((currentHistory) => [...currentHistory, record]);
  };

  const outletContext = {
    questions, loading, error, playerName, setPlayerName, history,
    saveGame, clearHistory: () => setHistory([]),
  };

  return (
    <Routes>
        <Route element={<Layout context={outletContext} />}>
          <Route index element={<Home />} />
          <Route path="play" element={<Play />} />
          <Route path="result" element={<Result />} />
          <Route path="history" element={<History />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="questions/:id" element={<QuestionDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
    </Routes>
  );
};

export default App;
