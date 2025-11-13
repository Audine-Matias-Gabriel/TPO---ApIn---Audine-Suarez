import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import type { User } from '@/types';
import { CreateUserModal } from './CreateUserModal';
import './UserSelector.css';

export function UserSelector({ onUserSelect }: { onUserSelect: (user: User) => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectUser = (user: User) => {
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    // Notify parent component
    onUserSelect(user);
    // Navigate to dashboard
    navigate('/');
  };

  const handleUserCreated = (newUser: User) => {
    // Add new user to list
    setUsers([...users, newUser]);
    // Auto-select the new user
    handleSelectUser(newUser);
  };

  if (loading) {
    return (
      <div className="user-selector-container">
        <div className="user-selector-content">
          <h1>📋 Task Manager</h1>
          <div className="loading">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="user-selector-container">
        <div className="user-selector-content">
          <div className="user-selector-header">
            <h1>📋 Task Manager</h1>
            <p>Select a user to get started</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          {users.length === 0 ? (
            <div className="empty-state">
              <p>No users found. Create one to get started.</p>
              <button
                className="btn-create-user"
                onClick={() => setIsCreateModalOpen(true)}
              >
                + Create First User
              </button>
            </div>
          ) : (
            <>
              <div className="users-grid">
                {users.map((user) => (
                  <button
                    key={user.id}
                    className="user-card"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <h3>{user.name}</h3>
                      <p>{user.email}</p>
                    </div>
                    <div className="user-cta">→</div>
                  </button>
                ))}
              </div>

              <div className="create-user-section">
                <button
                  className="btn-create-user"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  + Create New User
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onUserCreated={handleUserCreated}
      />
    </>
  );
}
