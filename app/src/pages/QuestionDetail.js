import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

export const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { questions, loading, error } = useOutletContext();
  const question = questions.find((item) => item.id === Number(id));

  if (loading) return <p className="panel status-message">Đang tải câu hỏi...</p>;
  if (error) return <p className="panel status-message error-text">Không tải được câu hỏi.</p>;
  if (!question) return <section className="panel"><h1>Không tìm thấy câu hỏi</h1><button className="button button-secondary" onClick={() => navigate(-1)}>Quay lại</button></section>;

  return (
    <section className="panel detail-panel">
      <p className="eyebrow">CHI TIẾT CÂU HỎI</p>
      <h1>{`Câu hỏi số ${question.id} (${LEVELS[question.level]})`}</h1>
      <p className="detail-question">{question.question}</p>
      <div className="detail-options">
        {question.options.map((option, index) => (
          <div key={`${question.id}-${index}`} className={`detail-option ${index === question.answer ? 'correct-option' : ''}`}>
            <strong>{LETTERS[index]}.</strong> {option}{index === question.answer && <span>Đáp án đúng</span>}
          </div>
        ))}
      </div>
      <button className="button button-secondary" onClick={() => navigate(-1)}>Quay lại</button>
    </section>
  );
};
