export const Timer = ({ seconds }) => (
  <span className={`timer ${seconds <= 10 ? 'timer-low' : ''}`}>{`Còn ${seconds} giây`}</span>
);
