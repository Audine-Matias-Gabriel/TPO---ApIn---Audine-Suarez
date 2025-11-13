import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import './Projects.css';
import { CreateProjectModal } from '@/components/CreateProjectModal';
import { EditProjectModal } from '@/components/EditProjectModal';
import { useUser } from '@/context/UserContext';

type Project = {
  id: string;
  name: string;
  description?: string | undefined;
  createdAt?: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { currentUser } = useUser();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      setProjects(res.data || []);
    } catch (err) {
      console.error('Failed to load projects', err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreated = (project: Project) => {
    setProjects((p) => [project, ...p]);
    setShowCreate(false);
  };

  const handleUpdated = (updated: Project) => {
    setProjects((p) => p.map((proj) => (proj.id === updated.id ? updated : proj)));
    setEditingProject(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects((p) => p.filter((proj) => proj.id !== id));
    } catch (err) {
      console.error('Failed to delete project', err);
      alert('Error al eliminar el proyecto');
    }
  };

  return (
    <div className="projects-page">
      <header className="projects-header">
        <h2>Proyectos</h2>
        <div className="actions">
          <button className="btn" onClick={() => setShowCreate(true)}>
            + Nuevo Proyecto
          </button>
        </div>
      </header>

      <section className="projects-list">
        {loading ? (
          <div className="empty-state">Cargando proyectos...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No hay proyectos aún</h3>
            <p>¡Crea tu primer proyecto para comenzar!</p>
            <button className="btn primary" onClick={() => setShowCreate(true)}>
              + Crear Proyecto
            </button>
          </div>
        ) : (
          <table className="projects-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Creado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, idx) => (
                <tr key={proj.id}>
                  <td>{idx + 1}</td>
                  <td>{proj.name}</td>
                  <td>{proj.description || '—'}</td>
                  <td>
                    {proj.createdAt
                      ? new Date(proj.createdAt).toLocaleString()
                      : '—'}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-small"
                      onClick={() => setEditingProject(proj)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn-small danger"
                      onClick={() => handleDelete(proj.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {showCreate && (
        <CreateProjectModal
          ownerId={currentUser?.id}
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}
