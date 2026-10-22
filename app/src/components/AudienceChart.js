import { LETTERS } from '../data';

export const AudienceChart = ({ percentages }) => (
  <div className="audience-chart" aria-label="Tỷ lệ bình chọn của khán giả">
    {percentages.map((percentage, index) => (
      <div key={LETTERS[index]} className="audience-bar" style={{ width: `${percentage}%` }}>
        {`${LETTERS[index]}: ${percentage}%`}
      </div>
    ))}
  </div>
);
