import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import './Tasks.css';
import { CreateTaskModal } from '@/components/CreateTaskModal';
import { EditTaskModal } from '@/components/EditTaskModal';
import { useUser } from '@/context/UserContext';

type Task = {
  id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string | null;
  assignedTo?: { id: string; name: string } | null;
};

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { currentUser } = useUser();

  const fetchTasks = async () => {
    console.log('[Tasks] fetchTasks start');
    setLoading(true);
    // Add a timeout guard so the UI doesn't spin forever if the request hangs
    const timeout = 10000; // 10s
    const fetchPromise = api.get('/tasks');
    const timeoutPromise = new Promise((_res, rej) => setTimeout(() => rej(new Error('timeout')), timeout));

    try {
      const res = await Promise.race([fetchPromise, timeoutPromise]) as any;
      setTasks(res.data || []);
      console.log('[Tasks] fetchTasks success, got', Array.isArray(res.data) ? res.data.length : 0);
    } catch (err) {
      console.error('[Tasks] Failed to load tasks', err);
      setTasks([]);
    } finally {
      setLoading(false);
      console.log('[Tasks] fetchTasks end');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreated = (task: Task) => {
    setTasks((t) => [task, ...t]);
    setShowCreate(false);
  };

  const handleUpdated = (updated: Task) => {
    setTasks((t) => t.map((task) => (task.id === updated.id ? updated : task)));
    setEditingTask(null);
  };

  const handleDelete = async (taskId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((t) => t.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Error al eliminar la tarea');
    }
  };

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <h2>Tareas</h2>
        <div className="actions">
          <button className="btn" onClick={() => setShowCreate(true)}>
            + Nueva Tarea
          </button>
        </div>
      </header>

      <section className="tasks-filters">
        <div className="filter-row">
          <div className="filter-item">Equipo [Todos ▾]</div>
          <div className="filter-item">🔍 <input placeholder="Buscar..." /></div>
          <div className="filter-item">Estado [Todos ▾]</div>
          <div className="filter-item">Prioridad [Todas ▾]</div>
        </div>
      </section>

      <section className="tasks-list">
        {loading ? (
          <div className="empty-state">Cargando tareas...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No hay tareas creadas</h3>
            <p>¡Crea tu primera tarea para comenzar!</p>
            <button className="btn primary" onClick={() => setShowCreate(true)}>
              + Crear Tarea
            </button>
          </div>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Título</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Vence</th>
                <th>Asignado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, idx) => (
                <tr key={task.id}>
                  <td>{idx + 1}</td>
                  <td>{task.title}</td>
                  <td>{task.status || 'Pendiente'}</td>
                  <td>{task.priority || 'Media'}</td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</td>
                  <td>{task.assignedTo?.name || '—'}</td>
                  <td className="actions-cell">
                    <button className="btn-small" onClick={() => setEditingTask(task)}>✏️ Editar</button>
                    <button className="btn-small danger" onClick={() => handleDelete(task.id)}>🗑️ Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {showCreate && (
        <CreateTaskModal
          creatorId={currentUser?.id}
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}

export default Tasks;

