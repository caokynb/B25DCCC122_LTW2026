import { useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { LEVELS } from '../data';

export const QuestionBank = () => {
  const { questions, loading, error } = useOutletContext();
  const [level, setLevel] = useState('all');
  const [query, setQuery] = useState('');

  const handleQueryShift = (event) => setQuery(event.target.value);
  const visibleQuestions = useMemo(() => questions.filter((question) => {
    const matchesLevel = level === 'all' || question.level === Number(level);
    const matchesQuery = question.question.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi'));
    return matchesLevel && matchesQuery;
  }), [questions, level, query]);

  if (loading) return <p className="panel status-message">Đang tải câu hỏi...</p>;
  if (error) return <p className="panel status-message error-text">Không tải được câu hỏi.</p>;

  return (
    <section className="panel">
      <div className="section-heading">
        <div><p className="eyebrow">ÔN TẬP KIẾN THỨC</p><h1>Ngân hàng câu hỏi</h1></div>
        <span className="count-pill">{`Có ${visibleQuestions.length} câu hỏi`}</span>
      </div>
      <div className="filters">
        <label>Mức độ
          <select value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value="all">Tất cả</option>
            <option value="1">Dễ</option>
            <option value="2">Trung bình</option>
            <option value="3">Khó</option>
          </select>
        </label>
        <label className="search-label">Tìm kiếm
          <input type="search" placeholder="Nhập nội dung câu hỏi..." value={query} onChange={handleQueryShift} />
        </label>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>STT</th><th>Mức độ</th><th>Câu hỏi</th></tr></thead>
          <tbody>
            {visibleQuestions.map((question, index) => (
              <tr key={question.id}>
                <td>{index + 1}</td>
                <td><span className={`level level-${question.level}`}>{LEVELS[question.level]}</span></td>
                <td><Link className="question-link" to={`/questions/${question.id}`}>{question.question}</Link></td>
              </tr>
            ))}
            {visibleQuestions.length === 0 && <tr><td colSpan="3" className="muted-cell">Không tìm thấy câu hỏi phù hợp.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
};
