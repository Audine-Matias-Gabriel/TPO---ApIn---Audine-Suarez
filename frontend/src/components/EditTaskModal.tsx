import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import './EditTaskModal.css';

type Task = {
  id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string | null;
  assignedTo?: { id: string; name: string } | null;
};

type Props = {
  task: Task;
  onClose: () => void;
  onUpdated: (task: Task) => void;
};

export const EditTaskModal: React.FC<Props> = ({ task, onClose, onUpdated }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status || 'pending');
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [dueDate, setDueDate] = useState<string>(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [assignedTo, setAssignedTo] = useState<string | null>(task.assignedTo?.id || null);

  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data || []);
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (!title.trim()) return setError('El título es requerido');
    setLoading(true);
    try {
      const payload: any = {
        title: title.trim(),
        description: description.trim(),
        status,
      };
      if (dueDate) payload.dueDate = dueDate;
      if (assignedTo) payload.assignedTo = assignedTo;

      const res = await api.put(`/tasks/${task.id}`, payload);
      onUpdated(res.data);
    } catch (err: any) {
      console.error('Update task failed', err);
      setError(err?.response?.data?.message || 'Error al actualizar la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal task-modal">
        <header>
          <h3>Editar Tarea</h3>
          <button className="close" onClick={onClose}>&times;</button>
        </header>
        <form onSubmit={handleSubmit}>
          <label>
            Título *
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>

          <label>
            Descripción
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>

          <div className="row">
            <label>
              Estado
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pendiente</option>
                <option value="in-progress">En curso</option>
                <option value="completed">Finalizada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </label>

            <label>
              Prioridad
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </label>
          </div>

          <div className="row">
            <label>
              Fecha límite
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </label>

            <label>
              Asignado a
              <select value={assignedTo ?? ''} onChange={(e) => setAssignedTo(e.target.value || null)}>
                <option value="">—</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </label>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="actions">
            <button type="button" className="btn" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
