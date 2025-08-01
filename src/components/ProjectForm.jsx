import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "../styles/ProjectForm.css";

function ProjectForm({ onAdd }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      const newProject = {
        id: uuidv4(),
        name,
        createdAt: new Date().toISOString(),
        tasks: [],
      };
      onAdd(newProject);
      setName("");
    }
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button  type="submit">Add Project</button>
    </form>
  );
}

export default ProjectForm;
