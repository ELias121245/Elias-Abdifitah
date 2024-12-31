import React, { useState } from 'react';

const TaskCard = ({ task, onDragStart, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    onUpdate(task.id, editedTask);
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#dc3545',
      medium: '#ffc107',
      low: '#28a745'
    };
    return colors[priority] || '#6c757d';
  };

  return (
    <div
      className="task-card"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      {isEditing ? (
        <div className="task-edit-form">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="task-edit-input"
          />
          <textarea
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            className="task-edit-description"
          />
          <div className="task-edit-options">
            <select
              value={editedTask.priority}
              onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
              className="task-priority-select"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              value={editedTask.dueDate}
              onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
              className="task-date-input"
            />
          </div>
          <div className="task-edit-actions">
            <button onClick={handleSave} className="save-button">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-header">
            <h4>{task.title}</h4>
            <div className="task-actions">
              <button onClick={() => setIsEditing(true)} className="edit-button">
                Edit
              </button>
              <button onClick={() => onDelete(task.id)} className="delete-button">
                Delete
              </button>
            </div>
          </div>
          <p className="task-description">{task.description}</p>
          <div className="task-footer">
            <span
              className="task-priority"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              {task.priority}
            </span>
            <span className="task-due-date">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
          <div className="task-assignees">
            {task.assignees.map((assignee, index) => (
              <img
                key={index}
                src={assignee.avatar}
                alt={assignee.name}
                className="assignee-avatar"
                title={assignee.name}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
