import coursesReducer, {
  setCourses,
  addCourse,
  removeCourse,
  setScore,
} from './features/coursesSlice';
import goalReducer, { setTarget, setRemaining } from './features/goalSlice';
import { calcStats, calcRequired } from './utils';

describe('Bai 2 tests', () => {
  const sampleCourses = [
    { id: 1, code: 'MH101', name: 'Giải tích 1', credits: 3, semester: 'Học kỳ 1', score: 7.5 },
    { id: 2, code: 'MH102', name: 'Vật lý đại cương', credits: 3, semester: 'Học kỳ 1', score: 6.2 },
    { id: 3, code: 'MH103', name: 'Tin học cơ sở', credits: 2, semester: 'Học kỳ 1', score: 9.4 },
    { id: 4, code: 'MH104', name: 'Lập trình C++', credits: 3, semester: 'Học kỳ 1', score: 8.8 },
    { id: 5, code: 'MH201', name: 'Giải tích 2', credits: 3, semester: 'Học kỳ 2', score: 5.8 },
    { id: 6, code: 'MH202', name: 'Cấu trúc dữ liệu và giải thuật', credits: 3, semester: 'Học kỳ 2', score: 8.1 },
    { id: 7, code: 'MH203', name: 'Đại số tuyến tính', credits: 3, semester: 'Học kỳ 2', score: 7.0 },
    { id: 8, code: 'MH204', name: 'Kỹ năng giao tiếp', credits: 2, semester: 'Học kỳ 2', score: 9.0 },
    { id: 9, code: 'MH301', name: 'Cơ sở dữ liệu', credits: 3, semester: 'Học kỳ 3', score: 8.4 },
    { id: 10, code: 'MH302', name: 'Mạng máy tính', credits: 3, semester: 'Học kỳ 3', score: 6.9 },
    { id: 11, code: 'MH303', name: 'Lập trình hướng đối tượng', credits: 3, semester: 'Học kỳ 3', score: 3.8 },
    { id: 12, code: 'MH304', name: 'Lập trình web', credits: 3, semester: 'Học kỳ 3', score: 9.6 },
  ];

  test('coursesSlice reducers', () => {
    let state = coursesReducer([], setCourses(sampleCourses));
    expect(state.length).toBe(12);

    state = coursesReducer(
      state,
      addCourse({ code: 'MH401', name: 'Trí tuệ nhân tạo', credits: 4, semester: 'Học kỳ 3', score: 9.5 })
    );
    expect(state.length).toBe(13);
    expect(state[12].id).toBe(13);

    state = coursesReducer(state, setScore({ id: 1, score: 9.2 }));
    expect(state[0].score).toBe(9.2);

    state = coursesReducer(state, removeCourse(11));
    expect(state.length).toBe(12);
  });

  test('goalSlice reducers', () => {
    let state = goalReducer(undefined, { type: 'unknown' });
    expect(state.target).toBe('3.2');
    expect(state.remaining).toBe('20');

    state = goalReducer(state, setTarget('2.5'));
    expect(state.target).toBe('2.5');

    state = goalReducer(state, setRemaining('15'));
    expect(state.remaining).toBe('15');
  });

  test('calcRequired cases from specification', () => {
    expect(calcRequired(sampleCourses, '3.2', '20')).toBe(
      'Cần đạt trung bình 3.76 điểm (hệ 4) ở 20 tín chỉ còn lại'
    );
    expect(calcRequired(sampleCourses, '2.5', '20')).toBe(
      'Cần đạt trung bình 1.87 điểm (hệ 4) ở 20 tín chỉ còn lại'
    );
    expect(calcRequired(sampleCourses, '4', '3')).toBe('Không thể đạt mục tiêu này');
    expect(calcRequired(sampleCourses, '1', '20')).toBe('Bạn đã đạt mục tiêu');
    expect(calcRequired(sampleCourses, '3.2', '0')).toBe(
      'Hãy nhập GPA mục tiêu (0–4) và số tín chỉ còn lại (từ 1)'
    );
    expect(calcRequired(sampleCourses, '3.2', '')).toBe(
      'Hãy nhập GPA mục tiêu (0–4) và số tín chỉ còn lại (từ 1)'
    );
    expect(calcRequired(sampleCourses, '5', '10')).toBe(
      'Hãy nhập GPA mục tiêu (0–4) và số tín chỉ còn lại (từ 1)'
    );
  });
});
