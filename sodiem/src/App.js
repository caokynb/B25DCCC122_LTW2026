import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useFetch from './hooks/useFetch';
import useLocalStorage from './hooks/useLocalStorage';
import useDebounce from './hooks/useDebounce';
import { selectCourses, setCourses, removeCourse, setScore } from './features/coursesSlice';
import { hasSaved } from './store';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { SEMESTERS, GRADES } from './data';
import { getGrade, calcStats } from './utils';
import CourseRow from './components/CourseRow';
import AddCourseForm from './components/AddCourseForm';
import GoalPlanner from './components/GoalPlanner';

const BUILD_TAG = 'gp-4073';

function App() {
  const { theme, toggleTheme } = useTheme();
  const showNotice = useNotice();
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();

  const { data, loading, error } = useFetch('/data/courses.json');
  const [semesterFilter, setSemesterFilter] = useLocalStorage('ltw_sodiem_semester', 'all');

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!hasSaved && data) {
      dispatch(setCourses(data));
    }
  }, [data, dispatch]);

  const semesterCourses = useMemo(() => {
    if (semesterFilter === 'all') {
      return courses;
    }
    return courses.filter((c) => c.semester === semesterFilter);
  }, [courses, semesterFilter]);

  const currentStats = useMemo(() => {
    return calcStats(semesterCourses);
  }, [semesterCourses]);

  const allStats = useMemo(() => {
    return calcStats(courses);
  }, [courses]);

  const gradeDistribution = useMemo(() => {
    return GRADES.map((g) => {
      const count = semesterCourses.filter(
        (c) => getGrade(Number(c.score)).letter === g.letter
      ).length;
      return { letter: g.letter, count };
    });
  }, [semesterCourses]);

  const filteredCourses = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return semesterCourses;
    }
    const query = debouncedSearch.trim().toLowerCase();
    return semesterCourses.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query)
    );
  }, [semesterCourses, debouncedSearch]);

  const handleCourseShift = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '/') {
        const tag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        const isInput =
          tag === 'input' ||
          tag === 'select' ||
          tag === 'textarea' ||
          (document.activeElement && document.activeElement.isContentEditable);
        if (!isInput) {
          e.preventDefault();
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }
      } else if (e.key === 'Escape' || e.key === 'Esc') {
        if (document.activeElement === searchInputRef.current) {
          setSearch('');
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      document.title = `GPA ${allStats.gpa.toFixed(2)} – Sổ điểm`;
    } else {
      document.title = 'Sổ điểm';
    }
  }, [courses.length, allStats.gpa]);

  const handleScore = useCallback(
    (id, score) => {
      dispatch(setScore({ id, score }));
    },
    [dispatch]
  );

  const handleRemove = useCallback(
    (course) => {
      dispatch(removeCourse(course.id));
      showNotice(`Đã xóa môn ${course.name}`);
    },
    [dispatch, showNotice]
  );

  const handleReset = () => {
    if (data) {
      dispatch(setCourses(data));
      showNotice('Đã đặt lại dữ liệu mẫu');
    }
  };

  if (!hasSaved && loading) {
    return (
      <div className={`app ${theme}`} data-build={BUILD_TAG}>
        <p>Đang tải bảng điểm...</p>
      </div>
    );
  }

  if (!hasSaved && error) {
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

        <h3>Phân bố điểm chữ</h3>
        <ul>
          {gradeDistribution.map((item) => (
            <li key={item.letter}>
              {item.letter}: {item.count}
              <span
                className="grade-bar"
                style={{ width: `${24 * item.count}px` }}
              />
            </li>
          ))}
        </ul>
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

        <div className="search-group">
          <label htmlFor="search-input">Tìm môn học</label>
          <input
            id="search-input"
            type="text"
            ref={searchInputRef}
            value={search}
            onChange={handleCourseShift}
            placeholder="Tìm kiếm môn học..."
          />
        </div>

        <p>Tìm thấy {filteredCourses.length} môn</p>

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
                <th>Số lần render</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((c) => (
                <CourseRow
                  key={c.id}
                  course={c}
                  onScore={handleScore}
                  onRemove={handleRemove}
                />
              ))}
            </tbody>
          </table>
        )}

        <button type="button" onClick={handleReset}>
          Đặt lại dữ liệu mẫu
        </button>
      </section>

      <AddCourseForm />
      <GoalPlanner />
    </div>
  );
}

export default App;
