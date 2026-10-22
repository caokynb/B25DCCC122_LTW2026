import { Link } from 'react-router-dom';

export const NotFound = () => (
  <section className="panel empty-state">
    <p className="eyebrow">404</p>
    <h1>404 - Không tìm thấy trang</h1>
    <Link className="button button-primary" to="/">Về trang chủ</Link>
  </section>
);
