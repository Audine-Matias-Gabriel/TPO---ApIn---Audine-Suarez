import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import './EditProjectModal.css';

type Project = {
    id: string;
    name: string;
    description?: string;
};

type Props = {
    project: Project;
    onClose: () => void;
    onUpdated: (project: Project) => void;
};

export const EditProjectModal: React.FC<Props> = ({ project, onClose, onUpdated }) => {
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleted, setDeleted] = useState(false);
    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setError(null);
        if (!name.trim()) return setError('Project name is required');
        setLoading(true);
        try {
            const payload: any = { name: name.trim(), description: description.trim() };
            const res = await api.put(`/projects/${project.id}`, payload);
            onUpdated(res.data);
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || 'Failed to update project');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }
        setError(null);
        setLoading(true);
        try {
            await api.delete(`/projects/${project.id}`);
            setDeleted(true);
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || 'Failed to delete project');
        } finally {
            setLoading(false);
        }
    };

    if (deleted) {
        return null;
    }
    return (
        <div className="modal-backdrop">
            <div className="modal edit-project-modal">
                <header>
                    <h3>Edit Project</h3>
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
                        <button type="button" className="btn delete" onClick={handleDelete} disabled={loading}>
                            {loading ? 'Deleting…' : 'Delete Project'}
                        </button>
                        <div>
                            <button type="button" className="btn" onClick={onClose} disabled={loading}>
                                Cancel
                            </button>
                            <button type="submit" className="btn primary" disabled={loading}>
                                {loading ? 'Saving…' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};