import React, { useState, useEffect } from 'react';
import ProjectList from './components/projects/ProjectList';
import ProjectBoard from './components/projects/ProjectBoard';
import ProjectForm from './components/projects/ProjectForm';
import './App.css';

function App() {
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const handleCreateProject = (newProject) => {
    setProjects([...projects, newProject]);
    setIsFormOpen(false);
  };

  const handleUpdateProject = (updatedProject) => {
    setProjects(projects.map(project =>
      project.id === updatedProject.id ? updatedProject : project
    ));
    setSelectedProject(updatedProject);
    setIsFormOpen(false);
  };

  const handleUpdateTask = (projectId, taskId, updates) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map(task =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        };
      }
      return project;
    }));
  };

  const handleDeleteTask = (projectId, taskId) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.filter(task => task.id !== taskId)
        };
      }
      return project;
    }));
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Project Management App</h1>
        <button
          onClick={() => {
            setSelectedProject(null);
            setIsFormOpen(true);
          }}
          className="create-project-button"
        >
          Create New Project
        </button>
      </header>

      <main className="app-main">
        {isFormOpen ? (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{selectedProject ? 'Edit Project' : 'Create New Project'}</h2>
                <button onClick={() => setIsFormOpen(false)} className="close-button">
                  ×
                </button>
              </div>
              <ProjectForm
                onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
                initialData={selectedProject}
              />
            </div>
          </div>
        ) : selectedProject ? (
          <div className="project-view">
            <button
              onClick={() => setSelectedProject(null)}
              className="back-button"
            >
              Back to Projects
            </button>
            <ProjectBoard
              project={selectedProject}
              onUpdateTask={(taskId, updates) => handleUpdateTask(selectedProject.id, taskId, updates)}
              onDeleteTask={(taskId) => handleDeleteTask(selectedProject.id, taskId)}
            />
          </div>
        ) : (
          <ProjectList
            projects={projects}
            onSelectProject={(id) => setSelectedProject(projects.find(p => p.id === id))}
          />
        )}
      </main>
    </div>
  );
}

export default App;
