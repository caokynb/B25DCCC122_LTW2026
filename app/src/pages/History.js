import { useOutletContext } from 'react-router-dom';
import { formatMoney } from '../data';

export const History = () => {
  const { history, clearHistory } = useOutletContext();
  const totalPrize = history.reduce((total, record) => total + record.prize, 0);
  const bestRecord = history.reduce((best, record) => (!best || record.prize > best.prize ? record : best), null);
  const sortedHistory = [...history].sort((first, second) => second.prize - first.prize);

  return (
    <section className="panel">
      <div className="section-heading">
        <div><p className="eyebrow">NHỮNG LƯỢT ĐÃ CHƠI</p><h1>Lịch sử</h1></div>
        {history.length > 0 && <button className="button button-secondary" onClick={clearHistory}>Xóa lịch sử</button>}
      </div>
      <div className="history-stats">
        <div className="stat-card"><span>Số lượt chơi</span><strong>{history.length}</strong></div>
        <div className="stat-card"><span>Tiền thưởng cao nhất</span><strong>{formatMoney(bestRecord?.prize || 0)}</strong></div>
        <div className="stat-card"><span>Tổng tiền thưởng</span><strong>{formatMoney(totalPrize)}</strong></div>
      </div>
      {history.length === 0 ? <p className="empty-history">Chưa có lượt chơi nào.</p> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Người chơi</th><th>Số câu đúng</th><th>Tiền thưởng</th><th>Thời gian</th></tr></thead>
            <tbody>
              {sortedHistory.map((record) => (
                <tr key={record.id}>
                  <td>{record.name}</td>
                  <td>{record.correctCount}</td>
                  <td><strong>{formatMoney(record.prize)}</strong></td>
                  <td>{record.playedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
