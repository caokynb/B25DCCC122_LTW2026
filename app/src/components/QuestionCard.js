import { AnswerButton } from './AnswerButton';

export const QuestionCard = ({ question, questionNumber, status, selectedIndex, hiddenAnswers, onAnswer }) => (
  <section className="game-card">
    <div className="game-meta"><span className="eyebrow">{`CÂU ${questionNumber}/15`}</span></div>
    <h1 className="question-title">{question.question}</h1>
    <div className="answer-grid">
      {question.options.map((option, index) => (
        <AnswerButton
          key={`${question.id}-${index}`}
          option={option}
          index={index}
          selectedIndex={selectedIndex}
          correctIndex={question.answer}
          status={status}
          hidden={hiddenAnswers.includes(index)}
          onAnswer={onAnswer}
        />
      ))}
    </div>
  </section>
);
