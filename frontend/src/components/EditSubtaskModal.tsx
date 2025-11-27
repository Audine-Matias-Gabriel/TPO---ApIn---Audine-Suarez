import React, { useState } from "react";
import api from "@/utils/api";
import "./EditSubtaskModal.css";

type Subtask = {
  id: string;
  title: string;
  description?: string;
  status?: string;
  order?: number;
  taskId?: string;
};

type Props = {
  subtask: Subtask;
  onClose: () => void;
  onUpdated: (subtask: Subtask) => void;
};

export const EditSubtaskModal: React.FC<Props> = ({
  subtask,
  onClose,
  onUpdated,
}) => {
  const [title, setTitle] = useState(subtask.title);
  const [description, setDescription] = useState(subtask.description || "");
  const [status, setStatus] = useState(subtask.status || "pending");
  const [order, setOrder] = useState<number>(subtask.order || 1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
        order,
      };

      const res = await api.put(`/subtasks/${subtask.id}`, payload);

      // Devuelve la subtarea actualizada al componente padre
      onUpdated(res.data);
      onClose();
    } catch (err: any) {
      console.error("Update subtask failed", err);
      setError(err?.response?.data?.message || "Error al actualizar la subtarea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content edit-subtask-modal">
        <h2>Editar Subtarea</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Título *</label>
          <input
            type="text"
            value={title}
            disabled={loading}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={description}
            disabled={loading}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={loading}
          >
            <option value="pending">Pendiente</option>
            <option value="in-progress">En curso</option>
            <option value="completed">Finalizada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>


        <div className="form-group">
          <label>Orden</label>
          <input
            type="number"
            min={1}
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value))}
            disabled={loading}
          />
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" disabled={loading} onClick={onClose}>
            Cancelar
          </button>

          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={handleSave}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSubtaskModal;
