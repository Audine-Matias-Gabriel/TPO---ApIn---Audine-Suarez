import { useState, useEffect } from 'react';
import api from '@/utils/api';
import type { User, Task, Project } from '@/types';
import './Dashboard.css';

export function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, projectsRes, tasksRes] = await Promise.all([
          api.get('/users'),
          api.get('/projects'),
          api.get('/tasks'),
        ]);
        setUsers(usersRes.data);
        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>👤 Users</h3>
          <p className="stat-number">{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>📁 Projects</h3>
          <p className="stat-number">{projects.length}</p>
        </div>
        <div className="stat-card">
          <h3>✓ Tasks</h3>
          <p className="stat-number">{tasks.length}</p>
        </div>
        <div className="stat-card">
          <h3>⚙️ Active</h3>
          <p className="stat-number">
            {tasks.filter(t => t.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="content-grid">
        <section className="dashboard-section">
          <h2>Recent Users</h2>
          {users.length === 0 ? (
            <p className="empty-state">No users found</p>
          ) : (
            <ul className="item-list">
              {users.slice(0, 5).map((user) => (
                <li key={user.id} className="item">
                  <strong>{user.name}</strong>
                  <span className="text-muted">{user.email}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dashboard-section">
          <h2>Recent Projects</h2>
          {projects.length === 0 ? (
            <p className="empty-state">No projects found</p>
          ) : (
            <ul className="item-list">
              {projects.slice(0, 5).map((project) => (
                <li key={project.id} className="item">
                  <strong>{project.name}</strong>
                  <span className="text-muted">{project.description}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dashboard-section">
          <h2>Recent Tasks</h2>
          {tasks.length === 0 ? (
            <p className="empty-state">No tasks found</p>
          ) : (
            <ul className="item-list">
              {tasks.slice(0, 5).map((task) => (
                <li key={task.id} className="item">
                  <strong>{task.title}</strong>
                  <span className="text-muted">
                    {task.status} • Project: {task.project?.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
