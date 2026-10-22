export const Lifelines = ({ usedLifelines, onFiftyFifty, onAudience, onQuit, disabled }) => (
  <div className="lifeline-row" aria-label="Quyền trợ giúp">
    <button className="button button-secondary" disabled={disabled || usedLifelines.includes('fifty')} onClick={onFiftyFifty}>50:50</button>
    <button className="button button-secondary" disabled={disabled || usedLifelines.includes('audience')} onClick={onAudience}>Hỏi khán giả</button>
    <button className="button button-secondary" disabled={disabled} onClick={onQuit}>Dừng cuộc chơi</button>
  </div>
);
