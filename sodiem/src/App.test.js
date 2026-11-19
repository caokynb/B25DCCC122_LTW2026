import coursesReducer, {
  setCourses,
  addCourse,
  removeCourse,
  setScore,
} from './features/coursesSlice';
import goalReducer, { setTarget, setRemaining } from './features/goalSlice';
import { calcStats, calcRequired, getGrade } from './utils';
import { loadSaved, saveCourses } from './storage';
import { GRADES } from './data';

describe('Bai 3 tests', () => {
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

  test('storage loadSaved and saveCourses', () => {
    localStorage.clear();
    expect(loadSaved()).toBeNull();

    saveCourses(sampleCourses);
    expect(loadSaved()).toHaveLength(12);

    localStorage.setItem('ltw_sodiem_courses', 'invalid json{');
    expect(loadSaved()).toBeNull();
    localStorage.clear();
  });

  test('grade distribution for all courses', () => {
    const dist = GRADES.map((g) => {
      const count = sampleCourses.filter(
        (c) => getGrade(Number(c.score)).letter === g.letter
      ).length;
      return `${g.letter}: ${count}`;
    });

    expect(dist).toEqual([
      'A+: 3',
      'A: 1',
      'B+: 2',
      'B: 2',
      'C+: 1',
      'C: 2',
      'D+: 0',
      'D: 0',
      'F: 1',
    ]);
  });

  test('grade distribution for semester 3', () => {
    const sem3 = sampleCourses.filter((c) => c.semester === 'Học kỳ 3');
    const dist = GRADES.map((g) => {
      const count = sem3.filter(
        (c) => getGrade(Number(c.score)).letter === g.letter
      ).length;
      return `${g.letter}: ${count}`;
    });

    expect(dist).toEqual([
      'A+: 1',
      'A: 0',
      'B+: 1',
      'B: 0',
      'C+: 1',
      'C: 0',
      'D+: 0',
      'D: 0',
      'F: 1',
    ]);
  });

  test('search filter query logic', () => {
    const query1 = 'lập trình'.toLowerCase();
    const result1 = sampleCourses.filter(
      (c) => c.name.toLowerCase().includes(query1) || c.code.toLowerCase().includes(query1)
    );
    expect(result1).toHaveLength(3);

    const query2 = 'mh30'.toLowerCase();
    const result2 = sampleCourses.filter(
      (c) => c.name.toLowerCase().includes(query2) || c.code.toLowerCase().includes(query2)
    );
    expect(result2).toHaveLength(4);

    const sem1 = sampleCourses.filter((c) => c.semester === 'Học kỳ 1');
    const result3 = sem1.filter(
      (c) => c.name.toLowerCase().includes(query1) || c.code.toLowerCase().includes(query1)
    );
    expect(result3).toHaveLength(1);
    expect(result3[0].name).toBe('Lập trình C++');
  });

  test('coursesSlice and goalSlice', () => {
    let state = coursesReducer([], setCourses(sampleCourses));
    expect(state.length).toBe(12);

    state = coursesReducer(
      state,
      addCourse({ code: 'MH401', name: 'Trí tuệ nhân tạo', credits: 4, semester: 'Học kỳ 3', score: 9.5 })
    );
    expect(state.length).toBe(13);

    state = coursesReducer(state, setScore({ id: 1, score: 9.2 }));
    expect(state[0].score).toBe(9.2);

    state = coursesReducer(state, removeCourse(11));
    expect(state.length).toBe(12);

    let gState = goalReducer(undefined, { type: 'init' });
    gState = goalReducer(gState, setTarget('3.5'));
    gState = goalReducer(gState, setRemaining('10'));
    expect(gState.target).toBe('3.5');
    expect(gState.remaining).toBe('10');
  });

  test('calcRequired calculations', () => {
    expect(calcRequired(sampleCourses, '3.2', '20')).toBe(
      'Cần đạt trung bình 3.76 điểm (hệ 4) ở 20 tín chỉ còn lại'
    );
    expect(calcRequired(sampleCourses, '2.5', '20')).toBe(
      'Cần đạt trung bình 1.87 điểm (hệ 4) ở 20 tín chỉ còn lại'
    );
    expect(calcRequired(sampleCourses, '4', '3')).toBe('Không thể đạt mục tiêu này');
    expect(calcRequired(sampleCourses, '1', '20')).toBe('Bạn đã đạt mục tiêu');
  });
});
