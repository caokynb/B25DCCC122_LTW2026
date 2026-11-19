import { GRADES, RANKS } from './data';

export const getGrade = (score) => {
  return GRADES.find((g) => score >= g.min) || GRADES[GRADES.length - 1];
};

export const getRank = (gpa) => {
  const item = RANKS.find((r) => gpa >= r.min);
  return item ? item.title : 'Chưa xếp loại';
};

export const calcStats = (courses = []) => {
  const count = courses.length;
  if (count === 0) {
    return { count: 0, credits: 0, points: 0, gpa: 0, rank: 'Chưa xếp loại' };
  }

  const credits = courses.reduce((sum, c) => sum + Number(c.credits), 0);
  const points = courses.reduce((sum, c) => {
    const grade = getGrade(Number(c.score));
    return sum + Number(c.credits) * grade.point;
  }, 0);

  if (credits === 0) {
    return { count, credits: 0, points: 0, gpa: 0, rank: 'Chưa xếp loại' };
  }

  const gpa = Math.round((points / credits) * 100) / 100;
  const rank = getRank(gpa);

  return { count, credits, points, gpa, rank };
};

export const calcRequired = (courses, target, remaining) => {
  const t = parseFloat(target);
  const r = Number(remaining);

  if (
    target === '' ||
    isNaN(t) ||
    t < 0 ||
    t > 4 ||
    remaining === '' ||
    isNaN(r) ||
    !Number.isInteger(r) ||
    r < 1
  ) {
    return 'Hãy nhập GPA mục tiêu (0–4) và số tín chỉ còn lại (từ 1)';
  }

  const { credits, points } = calcStats(courses);
  const need = (t * (credits + r) - points) / r;

  if (need > 4) {
    return 'Không thể đạt mục tiêu này';
  }
  if (need <= 0) {
    return 'Bạn đã đạt mục tiêu';
  }

  return `Cần đạt trung bình ${need.toFixed(2)} điểm (hệ 4) ở ${r} tín chỉ còn lại`;
};
