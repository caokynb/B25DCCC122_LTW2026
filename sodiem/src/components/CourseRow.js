import React, { useRef } from 'react';
import { getGrade } from '../utils';
import { formatPoint } from '../data';

const CourseRow = React.memo(({ course, onScore, onRemove }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const grade = getGrade(Number(course.score));
  const isF = grade.letter === 'F';

  return (
    <tr style={isF ? { color: '#c62828' } : {}}>
      <td>{course.code}</td>
      <td>{course.name}</td>
      <td>{course.credits}</td>
      <td>{course.semester}</td>
      <td>
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={course.score}
          aria-label={`Điểm ${course.name}`}
          onChange={(e) => {
            const val = e.target.valueAsNumber;
            if (!isNaN(val) && val >= 0 && val <= 10) {
              onScore(course.id, val);
            }
          }}
        />
      </td>
      <td>{isF ? 'F – Học lại' : grade.letter}</td>
      <td>{formatPoint(grade.point)}</td>
      <td>{renderCount.current}</td>
      <td>
        <button type="button" onClick={() => onRemove(course)}>
          Xóa
        </button>
      </td>
    </tr>
  );
});

export default CourseRow;
