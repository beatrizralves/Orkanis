import React, { useState } from "react";
import "../styles/TaskBoard.css";

const TaskBoard = ({ project, onUpdateProject }) => {
  const [newTitle, setNewTitle] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  if (!project || !project.tasks) {
    return <div style={{ padding: 16 }}>No project selected.</div>;
  }
  const groupedTasks = {
    pendent: project.tasks.filter((task) => task.status === "pendent"),
    progress: project.tasks.filter((task) => task.status === "progress"),
    completed: project.tasks.filter((task) => task.status === "completed"),
  };

  

  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    const newTask = {
      id: `task-${Date.now()}`,
      title: newTitle,
      status: "pendent",
    };
    onUpdateProject({ ...project, tasks: [...project.tasks, newTask] });
    setNewTitle("");
  };


  const handleDelete = (taskId) => {
    const updatedTasks = project.tasks.filter((task) => task.id !== taskId);
    onUpdateProject({ ...project, tasks: updatedTasks });
  };

 

  const getColumnStyle = () => ({
    backgroundColor: "#f4f4f4",
    padding: 10,
    width: 300,
    borderRadius: 6,
    minHeight: 300,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pendent":
        return "#666";
      case "progress":
        return "#2a6cd1";
      case "completed":
        return "#2a9d6f";
      default:
        return "#333";
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="New Task"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ padding: 8, width: 200, marginRight: 8 }}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      <div className="task-board" style={{ display: "flex", gap: 16 }}>
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <div
            key={status}
            style={getColumnStyle()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.backgroundColor = "#e0e7ff";
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f4f4f4";
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.backgroundColor = "#f4f4f4";
              const taskId = e.dataTransfer.getData("text/plain");
              const task = project.tasks.find((t) => t.id === taskId);
              if (task && task.status !== status) {
                const updatedTasks = project.tasks.map((t) =>
                  t.id === taskId ? { ...t, status } : t
                );
                onUpdateProject({ ...project, tasks: updatedTasks });
              }
            }}
          >
            <h3 style={{ color: getStatusColor(status) }}>
              {status.replace("_", " ").toUpperCase()}
            </h3>
            {project.tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div
                  key={task.id}
                  className="task-item"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", task.id);
                  }}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    padding: 8,
                    marginBottom: 8,
                    background: "#fff",
                    cursor: "grab",
                  }}
                >
                  {editingTask === task.id ? (
                    <form
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        const updatedTitle =
                          e.target.elements.editTitle.value.trim();
                        if (updatedTitle) {
                          const updatedTasks = project.tasks.map((t) =>
                            t.id === task.id ? { ...t, title: updatedTitle } : t
                          );
                          onUpdateProject({ ...project, tasks: updatedTasks });
                        }
                        setEditingTask(null);
                      }}
                    >
                      <input
                        name="editTitle"
                        defaultValue={task.title}
                        autoFocus
                        style={{ flex: 1, padding: 4 }}
                        onBlur={(e) => {
                          
                          const updatedTitle = e.target.value.trim();
                          if (updatedTitle && updatedTitle !== task.title) {
                            const updatedTasks = project.tasks.map((t) =>
                              t.id === task.id
                                ? { ...t, title: updatedTitle }
                                : t
                            );
                            onUpdateProject({
                              ...project,
                              tasks: updatedTasks,
                            });
                          }
                          setEditingTask(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Escape") setEditingTask(null);
                        }}
                      />
                      <button type="submit">Save</button>
                    </form>
                  ) : (
                    <>
                      <span>{task.title}</span>
                      <div className="task-actions">
                        <button onClick={() => setEditingTask(task.id)}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(task.id)}>
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            {project.tasks.filter((task) => task.status === status).length ===
              0 && <p>No tasks in this category.</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
