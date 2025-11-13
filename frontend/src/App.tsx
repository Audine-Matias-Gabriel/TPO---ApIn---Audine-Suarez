import { useState, useEffect } from 'react';
import './App.css';
import api from '@/utils/api';
import type { User, Task, Project } from '@/types';

function App() {
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

  return (
    <div className="App">
      <h1>Task Management Dashboard</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          <section>
            <h2>Users ({users.length})</h2>
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Projects ({projects.length})</h2>
            <ul>
              {projects.map((project) => (
                <li key={project.id}>
                  <strong>{project.name}</strong>: {project.description}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Tasks ({tasks.length})</h2>
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>
                  <strong>{task.title}</strong> ({task.status}) - Project:{' '}
                  {task.project?.name}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
