import React, { useState } from 'react';

const ProjectForm = ({ onSubmit, initialData = null }) => {
  const [project, setProject] = useState(initialData || {
    name: '',
    description: '',
    status: 'Not Started',
    deadline: '',
    team: []
  });

  const [teamMember, setTeamMember] = useState({
    name: '',
    email: '',
    role: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...project,
      id: project.id || Date.now(),
      tasks: project.tasks || [],
      createdAt: project.createdAt || new Date().toISOString()
    });
  };

  const addTeamMember = () => {
    if (teamMember.name && teamMember.email) {
      setProject({
        ...project,
        team: [...(project.team || []), {
          ...teamMember,
          id: Date.now(),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(teamMember.name)}`
        }]
      });
      setTeamMember({ name: '', email: '', role: '' });
    }
  };

  const removeTeamMember = (id) => {
    setProject({
      ...project,
      team: project.team.filter(member => member.id !== id)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <div className="form-group">
        <label>Project Name</label>
        <input
          type="text"
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.target.value })}
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={project.description}
          onChange={(e) => setProject({ ...project, description: e.target.value })}
          className="form-textarea"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Status</label>
          <select
            value={project.status}
            onChange={(e) => setProject({ ...project, status: e.target.value })}
            className="form-select"
          >
            <option value="Not Started">Not Started</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="On Hold">On Hold</option>
            <option value="Under Review">Under Review</option>
            <option value="Testing">Testing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="form-group">
          <label>Deadline</label>
          <input
            type="date"
            value={project.deadline}
            onChange={(e) => setProject({ ...project, deadline: e.target.value })}
            required
            className="form-input"
          />
        </div>
      </div>

      <div className="team-section">
        <h3>Team Members</h3>
        <div className="team-form">
          <input
            type="text"
            placeholder="Name"
            value={teamMember.name}
            onChange={(e) => setTeamMember({ ...teamMember, name: e.target.value })}
            className="form-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={teamMember.email}
            onChange={(e) => setTeamMember({ ...teamMember, email: e.target.value })}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Role"
            value={teamMember.role}
            onChange={(e) => setTeamMember({ ...teamMember, role: e.target.value })}
            className="form-input"
          />
          <button type="button" onClick={addTeamMember} className="add-member-button">
            Add Member
          </button>
        </div>

        <div className="team-list">
          {project.team && project.team.map(member => (
            <div key={member.id} className="team-member">
              <img src={member.avatar} alt={member.name} className="member-avatar" />
              <div className="member-info">
                <span className="member-name">{member.name}</span>
                <span className="member-role">{member.role}</span>
              </div>
              <button
                type="button"
                onClick={() => removeTeamMember(member.id)}
                className="remove-member-button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="submit-button">
        {initialData ? 'Update Project' : 'Create Project'}
      </button>
    </form>
  );
};

export default ProjectForm;
