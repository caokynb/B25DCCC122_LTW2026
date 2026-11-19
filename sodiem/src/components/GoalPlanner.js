import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCourses } from '../features/coursesSlice';
import { selectGoal, setTarget, setRemaining } from '../features/goalSlice';
import { calcRequired } from '../utils';

const GoalPlanner = () => {
  const courses = useSelector(selectCourses);
  const { target, remaining } = useSelector(selectGoal);
  const dispatch = useDispatch();

  const message = useMemo(() => {
    return calcRequired(courses, target, remaining);
  }, [courses, target, remaining]);

  return (
    <section className="goal-planner-section">
      <h2>Mục tiêu GPA</h2>
      <div className="form-group">
        <label htmlFor="target-input">GPA mục tiêu</label>
        <input
          id="target-input"
          type="number"
          step="0.01"
          value={target}
          onChange={(e) => dispatch(setTarget(e.target.value))}
        />
      </div>

      <div className="form-group">
        <label htmlFor="remaining-input">Số tín chỉ còn lại</label>
        <input
          id="remaining-input"
          type="number"
          value={remaining}
          onChange={(e) => dispatch(setRemaining(e.target.value))}
        />
      </div>

      <p className="goal-result">{message}</p>
    </section>
  );
};

export default GoalPlanner;
