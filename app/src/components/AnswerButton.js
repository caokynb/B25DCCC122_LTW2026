import { LETTERS } from '../data';

export const AnswerButton = ({ option, index, selectedIndex, correctIndex, status, hidden, onAnswer }) => {
  const classes = ['answer-button'];
  if (hidden) classes.push('answer-hidden');
  if (selectedIndex === index && status === 'locked') classes.push('selected-answer');
  if (status === 'revealed' && index === correctIndex) classes.push('answer-correct');
  if (status === 'revealed' && selectedIndex === index && index !== correctIndex) classes.push('answer-wrong');

  return (
    <button className={classes.join(' ')} disabled={status !== 'answering' || hidden} onClick={() => onAnswer(index)}>
      <strong>{LETTERS[index]}.</strong>{hidden ? '' : option}
    </button>
  );
};
