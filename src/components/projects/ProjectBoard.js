import React, { useState } from 'react';
import TaskCard from './TaskCard';
import ProjectAnalytics from '../analytics/ProjectAnalytics';
import ProjectMetrics from '../analytics/ProjectMetrics';
import '../analytics/Analytics.css';

const ProjectBoard = ({ project, allProjects, onUpdateTask, onDeleteTask }) => {
  const columns = ['To Do', 'In Progress', 'In Review', 'Done'];
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    const taskId = e.dataTransfer.getData('taskId');
    onUpdateTask(taskId, { status });
  };

  return (
    <div className="project-board">
      <div className="board-header">
        <h2>{project.name}</h2>
        <div className="board-info">
          <span className="project-status" style={{ backgroundColor: getStatusColor(project.status) }}>
            {project.status}
          </span>
          <span className="project-deadline">
            Deadline: {new Date(project.deadline).toLocaleDateString()}
          </span>
        </div>
        <div className="board-actions">
          <button onClick={() => setShowAnalytics(!showAnalytics)}>
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
        </div>
      </div>

      {showAnalytics && (
        <div className="analytics-section">
          <ProjectAnalytics project={project} allProjects={allProjects} />
          <ProjectMetrics project={project} />
        </div>
      )}

      <div className="board-columns">
        {columns.map(status => (
          <div
            key={status}
            className="board-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="column-header">
              <h3>{status}</h3>
              <span className="task-count">
                {project.tasks.filter(task => task.status === status).length}
              </span>
            </div>
            <div className="column-content">
              {project.tasks
                .filter(task => task.status === status)
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={handleDragStart}
                    onUpdate={onUpdateTask}
                    onDelete={onDeleteTask}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    'In Progress': '#ffc107',
    'Completed': '#28a745',
    'On Hold': '#dc3545',
    'Planning': '#17a2b8'
  };
  return colors[status] || '#6c757d';
};

export default ProjectBoard;
