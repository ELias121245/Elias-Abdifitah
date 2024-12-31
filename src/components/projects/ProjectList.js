import React from 'react';

const ProjectList = ({ projects, onSelectProject }) => {
  return (
    <div className="project-list">
      <h2>Projects</h2>
      <div className="project-grid">
        {projects.map(project => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => onSelectProject(project.id)}
          >
            <h3>{project.name}</h3>
            <div className="project-info">
              <span className="project-status" style={{ backgroundColor: getStatusColor(project.status) }}>
                {project.status}
              </span>
              <span className="project-tasks">
                {project.tasks.length} Tasks
              </span>
            </div>
            <div className="project-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${calculateProgress(project.tasks)}%`,
                    backgroundColor: getProgressColor(calculateProgress(project.tasks))
                  }}
                />
              </div>
              <span>{calculateProgress(project.tasks)}%</span>
            </div>
            <div className="project-footer">
              <div className="project-team">
                {project.team.slice(0, 3).map((member, index) => (
                  <img
                    key={index}
                    src={member.avatar}
                    alt={member.name}
                    className="team-avatar"
                    title={member.name}
                  />
                ))}
                {project.team.length > 3 && (
                  <span className="team-more">+{project.team.length - 3}</span>
                )}
              </div>
              <span className="project-deadline">
                Due: {new Date(project.deadline).toLocaleDateString()}
              </span>
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

const getProgressColor = (progress) => {
  if (progress < 30) return '#dc3545';
  if (progress < 70) return '#ffc107';
  return '#28a745';
};

const calculateProgress = (tasks) => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(task => task.completed).length;
  return Math.round((completed / tasks.length) * 100);
};

export default ProjectList;
