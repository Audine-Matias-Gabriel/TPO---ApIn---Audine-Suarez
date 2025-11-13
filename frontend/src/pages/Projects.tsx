import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import './Projects.css';
import { CreateProjectModal } from '@/components/CreateProjectModal';
import { useUser } from '@/context/UserContext';

type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const { currentUser } = useUser();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      setProjects(res.data || []);
    } catch (err) {
      console.error('Failed to load projects', err);
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

  return (
    <div className="projects-page">
      <header className="projects-header">
        <h2>Projects</h2>
        <div>
          <button className="btn primary" onClick={() => setShowCreate(true)}>
            + New Project
          </button>
        </div>
      </header>

      <section className="projects-list">
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects yet. Create one to get started.</p>
        ) : (
          projects.map((proj) => (
            <div key={proj.id} className="project-card">
              <h3>{proj.name}</h3>
              {proj.description && <p>{proj.description}</p>}
              <div className="meta">{proj.createdAt && new Date(proj.createdAt).toLocaleString()}</div>
            </div>
          ))
        )}
      </section>

      {showCreate && (
        <CreateProjectModal
          ownerId={currentUser?.id}
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
