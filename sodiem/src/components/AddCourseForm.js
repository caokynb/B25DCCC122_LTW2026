import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCourses, addCourse } from '../features/coursesSlice';
import { useNotice } from '../context/NoticeContext';
import { SEMESTERS, CREDIT_OPTIONS } from '../data';

const AddCourseForm = () => {
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();
  const showNotice = useNotice();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState('Học kỳ 1');
  const [score, setScore] = useState('');
  const [errors, setErrors] = useState({});

  const codeInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    const cleanCode = code.trim();
    if (!cleanCode) {
      errs.code = 'Hãy nhập mã môn';
    } else if (
      courses.some((c) => c.code.trim().toLowerCase() === cleanCode.toLowerCase())
    ) {
      errs.code = 'Mã môn đã tồn tại';
    }

    const cleanName = name.trim();
    if (!cleanName) {
      errs.name = 'Hãy nhập tên môn';
    }

    const numScore = parseFloat(score);
    if (score === '' || isNaN(numScore) || numScore < 0 || numScore > 10) {
      errs.score = 'Điểm phải từ 0 đến 10';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    dispatch(
      addCourse({
        code: cleanCode.toUpperCase(),
        name: cleanName,
        credits: Number(credits),
        semester,
        score: numScore,
      })
    );

    showNotice(`Đã thêm môn ${cleanName}`);

    setCode('');
    setName('');
    setCredits(3);
    setSemester('Học kỳ 1');
    setScore('');
    setErrors({});
    if (codeInputRef.current) {
      codeInputRef.current.focus();
    }
  };

  return (
    <section className="add-course-section">
      <h2>Thêm môn học</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="code-input">Mã môn</label>
          <input
            id="code-input"
            type="text"
            ref={codeInputRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {errors.code && <span role="alert">{errors.code}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="name-input">Tên môn</label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span role="alert">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="credits-select">Số tín chỉ</label>
          <select
            id="credits-select"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
          >
            {CREDIT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="semester-select">Học kỳ</label>
          <select
            id="semester-select"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="score-input">Điểm hệ 10</label>
          <input
            id="score-input"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
          {errors.score && <span role="alert">{errors.score}</span>}
        </div>

        <button type="submit">Thêm môn</button>
      </form>
    </section>
  );
};

export default AddCourseForm;
