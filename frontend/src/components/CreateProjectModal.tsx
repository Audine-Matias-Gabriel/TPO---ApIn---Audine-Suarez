import React, { useState } from 'react';
import api from '@/utils/api';
import './CreateProjectModal.css';

type Props = {
  ownerId?: string | null;
  onClose: () => void;
  onCreated: (project: any) => void;
};

export const CreateProjectModal: React.FC<Props> = ({ ownerId, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    if (!name.trim()) return setError('Project name is required');
    setLoading(true);
    try {
      const payload: any = { name: name.trim(), description: description.trim() };
      if (ownerId) payload.ownerId = ownerId;
      const res = await api.post('/projects', payload);
      onCreated(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal create-project-modal">
        <header>
          <h3>Create Project</h3>
          <button className="close" onClick={onClose}>&times;</button>
        </header>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          {error && <div className="error">{error}</div>}
          <div className="actions">
            <button type="button" className="btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
