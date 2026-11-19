export const loadSaved = () => {
  try {
    const raw = localStorage.getItem('ltw_sodiem_courses');
    if (raw === null) return null;
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
    return null;
  } catch {
    return null;
  }
};

export const saveCourses = (courses) => {
  try {
    localStorage.setItem('ltw_sodiem_courses', JSON.stringify(courses));
  } catch {}
};
