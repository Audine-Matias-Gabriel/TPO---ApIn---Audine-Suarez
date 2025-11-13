import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import './CreateTaskModal.css';

type Props = {
  creatorId?: string | null;
  onClose: () => void;
  onCreated: (task: any) => void;
};

export const CreateTaskModal: React.FC<Props> = ({ creatorId, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState<string>('');
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [tags, setTags] = useState('');

  const [users, setUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [uRes, pRes] = await Promise.all([api.get('/users'), api.get('/projects')]);
        setUsers(uRes.data || []);
        setProjects(pRes.data || []);
      } catch (err) {
        console.error('Failed to load selects', err);
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
        priority,
      };
      if (dueDate) payload.dueDate = dueDate;
      if (assignedTo) payload.assignedToId = assignedTo;
      if (teamId) payload.teamId = teamId;
      if (tags) payload.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (creatorId) payload.creatorId = creatorId;

      const res = await api.post('/tasks', payload);
      onCreated(res.data);
    } catch (err: any) {
      console.error('Create task failed', err);
      setError(err?.response?.data?.message || 'Error al crear la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal task-modal">
        <header>
          <h3>Nueva Tarea</h3>
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
                <option value="PENDING">Pendiente</option>
                <option value="IN_PROGRESS">En curso</option>
                <option value="DONE">Finalizada</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </label>

            <label>
              Prioridad
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="HIGH">Alta</option>
                <option value="MEDIUM">Media</option>
                <option value="LOW">Baja</option>
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

          <label>
            Equipo (opcional)
            <select value={teamId ?? ''} onChange={(e) => setTeamId(e.target.value || null)}>
              <option value="">—</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>

          <label>
            Etiquetas (coma separadas)
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="bug, frontend, urgent" />
          </label>

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

export default CreateTaskModal;
