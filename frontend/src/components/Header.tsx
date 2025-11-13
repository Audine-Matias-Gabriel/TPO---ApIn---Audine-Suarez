import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import type { User } from '@/types';
import './Header.css';

export function Header({ currentUser }: { currentUser: User | null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCurrentUser } = useUser();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    clearCurrentUser();
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>📋 Task Manager</h1>
        </div>
        <nav className="nav">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            📊 Dashboard
          </Link>
          <Link to="/projects" className={`nav-link ${isActive('/projects')}`}>
            📁 Projects
          </Link>
          <Link to="/tasks" className={`nav-link ${isActive('/tasks')}`}>
            ✓ Tasks
          </Link>
          <Link to="/activity" className={`nav-link ${isActive('/activity')}`}>
            📈 Activity
          </Link>
        </nav>
        <div className="user-selector">
          {currentUser && (
            <div className="current-user">
              <div className="user-avatar-small">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info-small">
                <div className="user-name">{currentUser.name}</div>
                <div className="user-email">{currentUser.email}</div>
              </div>
              <button
                className="logout-btn"
                onClick={handleLogout}
                title="Change user"
              >
                🚪
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
