import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PRIZES, formatMoney } from '../data';

export const Home = () => {
  const { history, playerName, setPlayerName } = useOutletContext();
  const navigate = useNavigate();
  const [draftName, setDraftName] = useState(playerName);
  const record = [...history].sort((first, second) => second.prize - first.prize)[0];
  const startGame = (event) => {
    event.preventDefault();
    const name = draftName.trim();
    if (!name) return;
    setPlayerName(name);
    navigate('/play');
  };

  return (
    <section className="panel home-layout">
      <div className="home-copy">
        <p className="eyebrow">THỬ THÁCH KIẾN THỨC LẬP TRÌNH</p>
        <h1>Ai là triệu phú</h1>
        <p>Chinh phục 15 câu hỏi về HTML, CSS, ES6 và React để chạm tới giải thưởng 250 triệu đồng. Mỗi câu có 30 giây và ba mốc an toàn ở câu 5, 10, 15.</p>
        <p>Trả lời sai hoặc hết giờ, bạn nhận tiền ở mốc an toàn cao nhất đã vượt qua. Hãy cân nhắc trước mỗi câu trả lời.</p>
        {record && <p className="record">{`Kỷ lục: ${formatMoney(record.prize)} – ${record.name}`}</p>}
      </div>
      <form className="home-form" onSubmit={startGame}>
        <p className="eyebrow">SẴN SÀNG CHƯA?</p>
        <label htmlFor="player-name">Tên người chơi
          <input id="player-name" className="text-input" value={draftName} onChange={(event) => setDraftName(event.target.value)} placeholder="Nhập tên của bạn" maxLength="40" />
        </label>
        <p className="muted-cell">Câu 15 trị giá {formatMoney(PRIZES[14])}</p>
        <button className="button button-primary" type="submit" disabled={!draftName.trim()}>Bắt đầu</button>
      </form>
    </section>
  );
};
