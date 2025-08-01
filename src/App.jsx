import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
import ProjectList from "./components/ProjectList";
import ProjectForm from "./components/ProjectForm";
import TaskBoard from "./components/TaskBoard";
import "./styles/App.css";

function App() {
  const [projects, setProjects] = useLocalStorage("projects", []);

  const addProject = (project) => {
    setProjects([...projects, project]);
  };

  const updateProject = (updatedProject) => {
    setProjects(
      projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  };

  const deleteProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <Router>
      <div className="app">
        <h1 style={{ marginBottom: "1px" }}>Orkanis</h1>
        <h2 style={{ marginTop: "0px" }}>Organize your tasks efficiently</h2>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ProjectForm onAdd={addProject} />
                <ProjectList
                  projects={projects}
                  onUpdate={updateProject}
                  onDelete={deleteProject}
                />
              </>
            }
          />
          <Route
            path="/project/:id"
            element={
              <ProjectTaskPage
                projects={projects}
                onUpdateProject={updateProject}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function ProjectTaskPage({ projects, onUpdateProject }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);

  if (!project) return <div>Projet not found.</div>;

  return (
    <div>
      <button onClick={() => navigate("/")}>Back</button>
      <h2>{project.name}</h2>
      <TaskBoard project={project} onUpdateProject={onUpdateProject} />
    </div>
  );
}

export default App;
