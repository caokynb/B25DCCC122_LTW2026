import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useFetch from './hooks/useFetch';
import { selectCourses, setCourses, removeCourse, setScore } from './features/coursesSlice';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { SEMESTERS, formatPoint } from './data';
import { getGrade, calcStats } from './utils';
import AddCourseForm from './components/AddCourseForm';
import GoalPlanner from './components/GoalPlanner';

const BUILD_TAG = 'gp-4073';

function App() {
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();

  const { data, loading, error } = useFetch('/data/courses.json');
  const [semesterFilter, setSemesterFilter] = useState('all');

  useEffect(() => {
    if (data) {
      dispatch(setCourses(data));
    }
  }, [data, dispatch]);

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

  const handleRemove = (course) => {
    dispatch(removeCourse(course.id));
    showNotice(`Đã xóa môn ${course.name}`);
  };

  if (loading) {
    return (
      <div className={`app ${theme}`} data-build={BUILD_TAG}>
        <p>Đang tải bảng điểm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`app ${theme}`} data-build={BUILD_TAG}>
        <p>Không tải được bảng điểm</p>
      </div>
    );
  }

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <h1>Sổ điểm sinh viên</h1>
      <button type="button" onClick={toggleTheme}>
        {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
      </button>

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
                            dispatch(setScore({ id: c.id, score: val }));
                          }
                        }}
                      />
                    </td>
                    <td>{isF ? 'F – Học lại' : grade.letter}</td>
                    <td>{formatPoint(grade.point)}</td>
                    <td>
                      <button type="button" onClick={() => handleRemove(c)}>
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

      <AddCourseForm />
      <GoalPlanner />
    </div>
  );
}

export default App;
