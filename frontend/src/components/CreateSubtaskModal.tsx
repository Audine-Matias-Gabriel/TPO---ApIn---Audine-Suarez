import React, { useState } from "react";
import api from "@/utils/api";
import "./CreateSubtaskModal.css";

type Props = {
  taskId: string;
  currentOrder?: number; // se usa para sugerir el próximo orden
  onClose: () => void;
  onCreated: (subtask: any) => void;
};

export const CreateSubTaskModal: React.FC<Props> = ({
  taskId,
  currentOrder = 0,
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState<number>(currentOrder + 1);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const newSubtask = await api.post("/subtasks", {
        taskId,
        title,
        description,
        order,
      });

      onCreated(newSubtask.data);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al crear la subtarea");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Nueva Subtarea</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Título *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isCreating}
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isCreating}
          />
        </div>

        <div className="form-group">
          <label>Orden</label>
          <input
            type="number"
            min={1}
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value))}
            disabled={isCreating}
          />
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose} disabled={isCreating}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={!title.trim() || isCreating}
          >
            {isCreating ? "Creando..." : "Crear Subtarea"}
          </button>
        </div>
      </div>
    </div>
  );
};
