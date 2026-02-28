import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Personal CRM</h1>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-link" end>
          Dashboard
        </NavLink>
        <NavLink to="/contacts" className="sidebar-link">
          Contacts
        </NavLink>
        <NavLink to="/settings" className="sidebar-link">
          Settings
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-user-name">
            {user?.displayName || user?.email}
          </span>
        </div>
        <button onClick={logout} className="btn btn-secondary btn-sm">
          Logout
        </button>
      </div>
    </aside>
  );
}
