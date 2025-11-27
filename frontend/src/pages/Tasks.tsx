import React, { useEffect, useState } from 'react';
import api from '@/utils/api';
import './Tasks.css';
import { CreateTaskModal } from '@/components/CreateTaskModal';
import { EditTaskModal } from '@/components/EditTaskModal';
import { CreateSubTaskModal } from '@/components/CreateSubtaskModal';
import { EditSubtaskModal } from '@/components/EditSubtaskModal';
import { useUser } from '@/context/UserContext';

type Subtask = {
  id: string;
  title: string;
  description?: string;
  status?: string;
  order?: number;
  taskId?: string;
};

type Task = {
  id: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string | null;
  assignedTo?: { id: string; name: string } | null;
  subtasks?: Subtask[];
};

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [creatingSubtaskFor, setCreatingSubtaskFor] = useState<Task | null>(null);
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null);

  const [openSubtasks, setOpenSubtasks] = useState<{ [taskId: string]: boolean }>({});

  const { currentUser } = useUser();

  const fetchTasks = async () => {
    if (!currentUser) {
      console.warn('[Tasks] No user selected, skipping fetch');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await api.get(`/tasks/user/${currentUser.id}`);
      setTasks(res.data || []);
    } catch (err) {
      console.error('[Tasks] Failed to load tasks', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    fetchTasks();
  }, [currentUser]);

  const loadSubtasks = async (taskId: string) => {
    try {
      const res = await api.get(`/subtasks/task/${taskId}`);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, subtasks: res.data } : t
        )
      );
    } catch (err) {
      console.error('Error loading subtasks:', err);
    }
  };

  const toggleSubtasks = (taskId: string) => {
    setOpenSubtasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

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

  const handleDeleteSubtask = async (subtaskId: string, taskId: string) => {
    if (!window.confirm("¿Eliminar subtarea?")) return;

    try {
      await api.delete(`/subtasks/${subtaskId}`);

      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === taskId
            ? {
              ...task,
              subtasks: task.subtasks?.filter((s) => s.id !== subtaskId) || [],
            }
            : task
        )
      );
    } catch (err) {
      console.error("Error eliminando subtarea", err);
      alert("Error al eliminar subtarea");
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
              {tasks.map((task, idx) => {
                // ---------------------------
                // CÁLCULO DE PORCENTAJES AQUÍ
                // ---------------------------
                const total = task.subtasks?.length ?? 0;
                const pending = task.subtasks?.filter(st => st.status === "pending").length ?? 0;
                const inProgress = task.subtasks?.filter(st => st.status === "in-progress").length ?? 0;
                const completed = task.subtasks?.filter(st => st.status === "completed").length ?? 0;

                const pctPending = total ? Math.round((pending / total) * 100) : 0;
                const pctInProgress = total ? Math.round((inProgress / total) * 100) : 0;
                const pctCompleted = total ? Math.round((completed / total) * 100) : 0;

                return (
                  <React.Fragment key={task.id}>
                    <tr>
                      <td>{idx + 1}</td>

                      <td>
                        {task.title}

                        <button
                          className="btn-small"
                          style={{ marginLeft: "8px" }}
                          onClick={() => {
                            if (!openSubtasks[task.id]) loadSubtasks(task.id);
                            toggleSubtasks(task.id);
                          }}
                        >
                          {openSubtasks[task.id] ? "▼ Ocultar" : "▶ Subtareas"}
                        </button>
                      </td>

                      <td>{task.status || "Pendiente"}</td>
                      <td>{task.priority || "Media"}</td>
                      <td>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                      </td>
                      <td>{task.assignedTo?.name || "—"}</td>

                      <td className="actions-cell">
                        <button className="btn-small" onClick={() => setEditingTask(task)}>
                          ✏️ Editar
                        </button>

                        <button
                          className="btn-small"
                          onClick={() => setCreatingSubtaskFor(task)}
                        >
                          ➕ Subtarea
                        </button>

                        <button
                          className="btn-small danger"
                          onClick={() => handleDelete(task.id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>

                    {openSubtasks[task.id] && (
                      <tr className="subtasks-row">
                        <td></td>
                        <td colSpan={6}>
                          {/* Cálculo de porcentajes de subtareas activas */}
                          {task.subtasks && task.subtasks.length > 0 && (() => {
                            const validSubtasks = task.subtasks
                              .filter(s => s.status !== "cancelled")
                              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

                            const total = validSubtasks.length;
                            const counts = { pending: 0, inProgress: 0, completed: 0 };

                            validSubtasks.forEach(s => {
                              if (s.status === "pending") counts.pending++;
                              if (s.status === "in-progress") counts.inProgress++;
                              if (s.status === "completed") counts.completed++;
                            });

                            return total > 0 ? (
                              <div className="subtask-percentages">
                                🟡 {Math.round((counts.pending / total) * 100)}% /
                                🟠 {Math.round((counts.inProgress / total) * 100)}% /
                                🟢 {Math.round((counts.completed / total) * 100)}%
                              </div>
                            ) : (
                              <div className="subtask-percentages">No hay subtareas activas</div>
                            );
                          })()}

                          <ul className="subtask-list">
                            {(task.subtasks ?? []).map((st) => (
                              <li key={st.id} className="subtask-item">
                                <div className="subtask-main">
                                  <span className="subtask-title">{st.title}</span>

                                  <span className={`subtask-status-badge status-${st.status}`}>
                                    {st.status === "pending" && "🟡 Pendiente"}
                                    {st.status === "in-progress" && "🟠 En progreso"}
                                    {st.status === "completed" && "🟢 Completada"}
                                    {st.status === "cancelled" && "⚫ Cancelada"}
                                  </span>
                                </div>

                                <div className="subtask-actions">
                                  <button
                                    className="btn-small"
                                    onClick={() => setEditingSubtask(st)}
                                  >
                                    ✏️ Editar
                                  </button>

                                  <button
                                    className="btn-small danger"
                                    onClick={() =>
                                      handleDeleteSubtask(st.id, task.id)
                                    }
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </li>
                            ))}

                            {(!task.subtasks || task.subtasks.length === 0) && (
                              <div className="empty-subtasks">No hay subtareas</div>
                            )}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
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

      {creatingSubtaskFor && (
        <CreateSubTaskModal
          taskId={creatingSubtaskFor.id}
          onClose={() => setCreatingSubtaskFor(null)}
          onCreated={(subtask) => {
            loadSubtasks(creatingSubtaskFor.id);
            setCreatingSubtaskFor(null);
          }}
        />
      )}

      {editingSubtask && (
        <EditSubtaskModal
          subtask={editingSubtask}
          onClose={() => setEditingSubtask(null)}
          onUpdated={(updated) => {
            setTasks((tasks) =>
              tasks.map((task) =>
                task.id === updated.taskId
                  ? {
                    ...task,
                    subtasks: task.subtasks?.map((s) =>
                      s.id === updated.id ? updated : s
                    ),
                  }
                  : task
              )
            );
            setEditingSubtask(null);
          }}
        />
      )}
    </div>
  );
}

export default Tasks;

