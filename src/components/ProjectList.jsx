import { useState } from "react";
import TaskBoard from "./TaskBoard";
import "../styles/ProjectList.css";
import { Link } from "react-router-dom";

function ProjectList({ projects, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [openTasks, setOpenTasks] = useState(new Set());

  const startEditing = (project) => {
    setEditingId(project.id);
    setEditedName(project.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedName("");
  };

  const handleEditSubmit = (e, project) => {
    e.preventDefault();
    const updated = { ...project, name: editedName };
    onUpdate(updated);
    cancelEditing();
  };

  return (
    <div className="project-list">
      {projects.length === 0 ? (
        <p className="empty">No projects added</p>
      ) : (
        projects.map((project) => (
          <div className="project-item" key={project.id}>
            {editingId === project.id ? (
              <form
                onSubmit={(e) => handleEditSubmit(e, project)}
                className="inline-edit-form"
              >
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  required
                />
                <button type="submit">Save</button>
                <button type="button" onClick={cancelEditing}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <div className="project-info">
                  <strong>{project.name}</strong>
                  <span className="date">
                    Create :{" "}
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="project-actions">
                  
                  <button onClick={() => startEditing(project)}>Edit</button>
                  <button onClick={() => onDelete(project.id)}>Remove</button>
                  <Link to={`/project/${project.id}`}>
                    <button>Show Tasks</button>
                  </Link>
                </div>
              </>
            )}

            {openTasks.has(project.id) && (
              <TaskBoard project={project} onUpdateProject={onUpdate} />
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ProjectList;
