import { useState, useReducer, useEffect, useMemo, useRef } from 'react';
import useFetch from './hooks/useFetch';
import { coursesReducer } from './coursesReducer';
import { SEMESTERS, CREDIT_OPTIONS, formatPoint } from './data';
import { getGrade, calcStats } from './utils';

const BUILD_TAG = 'gp-4073';

function App() {
  const { data, loading, error } = useFetch('/data/courses.json');
  const [courses, dispatch] = useReducer(coursesReducer, []);
  const [semesterFilter, setSemesterFilter] = useState('all');

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState('Học kỳ 1');
  const [score, setScore] = useState('');
  const [errors, setErrors] = useState({});

  const codeInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      dispatch({ type: 'LOAD', payload: data });
    }
  }, [data]);

  const filteredCourses = useMemo(() => {
    if (semesterFilter === 'all') {
      return courses;
    }
    return courses.filter((c) => c.semester === semesterFilter);
  }, [courses, semesterFilter]);

  const currentStats = useMemo(() => {
    return calcStats(filteredCourses);
  }, [filteredCourses]);

  const allStats = useMemo(() => {
    return calcStats(courses);
  }, [courses]);

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

    dispatch({
      type: 'ADD',
      payload: {
        code: cleanCode.toUpperCase(),
        name: cleanName,
        credits: Number(credits),
        semester,
        score: numScore,
      },
    });

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

  if (loading) {
    return (
      <div className="app" data-build={BUILD_TAG}>
        <p>Đang tải bảng điểm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app" data-build={BUILD_TAG}>
        <p>Không tải được bảng điểm</p>
      </div>
    );
  }

  return (
    <div className="app" data-build={BUILD_TAG}>
      <h1>Sổ điểm sinh viên</h1>

      <section className="stats-section">
        <h2>Thống kê</h2>
        <div>Số môn: {currentStats.count}</div>
        <div>Tổng tín chỉ: {currentStats.credits}</div>
        <div>GPA (hệ 4): {currentStats.gpa.toFixed(2)}</div>
        <div>Xếp loại: {currentStats.rank}</div>
        <div>GPA tích lũy: {allStats.gpa.toFixed(2)}</div>
      </section>

      <section className="courses-section">
        <h2>Bảng điểm</h2>
        <div className="filter-group">
          <label htmlFor="semester-filter">Xem học kỳ</label>
          <select
            id="semester-filter"
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {filteredCourses.length === 0 ? (
          <p>Chưa có môn học nào</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Mã môn</th>
                <th>Tên môn</th>
                <th>Tín chỉ</th>
                <th>Học kỳ</th>
                <th>Điểm (hệ 10)</th>
                <th>Điểm chữ</th>
                <th>Điểm (hệ 4)</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((c) => {
                const grade = getGrade(Number(c.score));
                const isF = grade.letter === 'F';
                return (
                  <tr key={c.id} style={isF ? { color: '#c62828' } : {}}>
                    <td>{c.code}</td>
                    <td>{c.name}</td>
                    <td>{c.credits}</td>
                    <td>{c.semester}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={c.score}
                        aria-label={`Điểm ${c.name}`}
                        onChange={(e) => {
                          const val = e.target.valueAsNumber;
                          if (!isNaN(val) && val >= 0 && val <= 10) {
                            dispatch({
                              type: 'SET_SCORE',
                              payload: { id: c.id, score: val },
                            });
                          }
                        }}
                      />
                    </td>
                    <td>{isF ? 'F – Học lại' : grade.letter}</td>
                    <td>{formatPoint(grade.point)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'REMOVE', payload: c.id })}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

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
    </div>
  );
}

export default App;
