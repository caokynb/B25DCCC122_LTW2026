import { coursesReducer } from './coursesReducer';
import { calcStats, getGrade, getRank } from './utils';

describe('utils and reducer tests', () => {
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

  test('calcStats for all 12 courses', () => {
    const stats = calcStats(sampleCourses);
    expect(stats.count).toBe(12);
    expect(stats.credits).toBe(34);
    expect(stats.gpa.toFixed(2)).toBe('2.87');
    expect(stats.rank).toBe('Khá');
  });

  test('calcStats for semester 1 (4 courses)', () => {
    const sem1 = sampleCourses.filter((c) => c.semester === 'Học kỳ 1');
    const stats = calcStats(sem1);
    expect(stats.count).toBe(4);
    expect(stats.credits).toBe(11);
    expect(stats.gpa.toFixed(2)).toBe('3.10');
    expect(stats.rank).toBe('Khá');
  });

  test('calcStats for semester 3 (4 courses, 1 F)', () => {
    const sem3 = sampleCourses.filter((c) => c.semester === 'Học kỳ 3');
    const stats = calcStats(sem3);
    expect(stats.count).toBe(4);
    expect(stats.credits).toBe(12);
    expect(stats.gpa.toFixed(2)).toBe('2.50');
    expect(stats.rank).toBe('Khá');
  });

  test('calcStats for empty list', () => {
    const stats = calcStats([]);
    expect(stats.count).toBe(0);
    expect(stats.credits).toBe(0);
    expect(stats.gpa.toFixed(2)).toBe('0.00');
    expect(stats.rank).toBe('Chưa xếp loại');
  });

  test('reducer actions', () => {
    let state = coursesReducer([], { type: 'LOAD', payload: sampleCourses });
    expect(state.length).toBe(12);

    state = coursesReducer(state, {
      type: 'ADD',
      payload: { code: 'MH401', name: 'Trí tuệ nhân tạo', credits: 4, semester: 'Học kỳ 3', score: 9.5 },
    });
    expect(state.length).toBe(13);
    expect(state[12].id).toBe(13);
    expect(state[12].code).toBe('MH401');

    state = coursesReducer(state, {
      type: 'SET_SCORE',
      payload: { id: 1, score: 9.2 },
    });
    expect(state[0].score).toBe(9.2);

    state = coursesReducer(state, {
      type: 'REMOVE',
      payload: 11,
    });
    expect(state.length).toBe(12);
    expect(state.find((c) => c.id === 11)).toBeUndefined();
  });
});
