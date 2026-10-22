import { MILESTONES, PRIZES, formatMoney } from '../data';

export const MoneyLadder = ({ questionNumber }) => (
  <aside className="ladder" aria-label="Thang tiền thưởng">
    {PRIZES.map((prize, index) => {
      const number = index + 1;
      const milestone = MILESTONES.includes(number);
      return (
        <div key={number} className={`ladder-row ${milestone ? 'milestone' : ''} ${number === questionNumber ? 'current' : ''}`}>
          <span>{number}</span><span>{formatMoney(prize)}</span>
        </div>
      );
    })}
  </aside>
);
