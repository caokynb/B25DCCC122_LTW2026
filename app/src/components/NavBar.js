import { NavLink } from 'react-router-dom';

export const NavBar = () => (
  <header className="topbar">
    <NavLink className="brand" to="/">AI TRIỆU PHÚ</NavLink>
    <nav aria-label="Điều hướng chính">
      <NavLink to="/" end>Trang chủ</NavLink>
      <NavLink to="/questions">Ngân hàng câu hỏi</NavLink>
      <NavLink to="/history">Lịch sử</NavLink>
    </nav>
  </header>
);
