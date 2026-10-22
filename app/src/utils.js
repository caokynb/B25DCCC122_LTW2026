import { MILESTONES, PRIZES } from './data';

export const calcPrize = (correctCount, reason) => {
  if (reason === 'win') return PRIZES[PRIZES.length - 1];
  if (reason === 'quit') return correctCount > 0 ? PRIZES[correctCount - 1] : 0;
  const safeMilestone = MILESTONES.filter((milestone) => milestone <= correctCount).pop();
  return safeMilestone ? PRIZES[safeMilestone - 1] : 0;
};

export const createAudiencePercentages = (correctIndex, hiddenAnswers) => {
  const available = [0, 1, 2, 3].filter((index) => !hiddenAnswers.includes(index));
  const correctPercent = Math.floor(Math.random() * 21) + 50;
  const percentages = [0, 0, 0, 0];
  percentages[correctIndex] = correctPercent;
  let remaining = 100 - correctPercent;
  const wrongAnswers = available.filter((index) => index !== correctIndex);
  wrongAnswers.forEach((answerIndex, position) => {
    const answersAfter = wrongAnswers.length - position - 1;
    const minimumForThisAnswer = Math.max(0, remaining - answersAfter * correctPercent);
    const maximumForThisAnswer = Math.min(correctPercent, remaining);
    const amount = answersAfter === 0
      ? remaining
      : Math.floor(Math.random() * (maximumForThisAnswer - minimumForThisAnswer + 1)) + minimumForThisAnswer;
    percentages[answerIndex] = amount;
    remaining -= amount;
  });
  return percentages;
};
