import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';

export const Layout = ({ context }) => (
  <div className="app-shell">
    <NavBar />
    <main className="page-content">
      <Outlet context={context} />
    </main>
  </div>
);
