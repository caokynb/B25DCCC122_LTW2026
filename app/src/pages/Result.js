import { Link, Navigate, useLocation } from 'react-router-dom';
import { formatMoney } from '../data';

const resultMessages = {
  win: 'Chúc mừng! Bạn đã trở thành triệu phú',
  wrong: 'Rất tiếc, bạn đã trả lời sai',
  timeout: 'Hết giờ!',
  quit: 'Bạn đã dừng cuộc chơi',
};

export const Result = () => {
  const { state } = useLocation();
  if (!state) return <Navigate to="/" replace />;

  return (
    <section className="panel result-panel">
      <p className="eyebrow">KẾT THÚC LƯỢT CHƠI</p>
      <h1>{resultMessages[state.reason] || resultMessages.wrong}</h1>
      <p>{`Người chơi: ${state.name}`}</p>
      <p>{`Số câu trả lời đúng: ${state.correctCount}`}</p>
      <p className="result-prize">{formatMoney(state.prize)}</p>
      <div className="result-actions">
        <Link className="button button-primary" to="/play">Chơi lại</Link>
        <Link className="button button-secondary" to="/">Về trang chủ</Link>
      </div>
    </section>
  );
};
