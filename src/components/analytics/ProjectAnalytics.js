import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ProjectAnalytics = ({ project, allProjects }) => {
  // Task Progress Over Time Chart
  const getProgressData = () => {
    const dates = project.tasks
      .filter(task => task.completed)
      .map(task => new Date(task.completedAt))
      .sort((a, b) => a - b);

    const progressData = dates.map((date, index) => ({
      x: date,
      y: ((index + 1) / project.tasks.length) * 100
    }));

    return {
      labels: progressData.map(d => new Date(d.x).toLocaleDateString()),
      datasets: [
        {
          label: 'Task Completion Progress',
          data: progressData.map(d => d.y),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        }
      ]
    };
  };

  // Task Distribution by Status
  const getStatusDistribution = () => {
    const statusCounts = project.tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderWidth: 1,
        }
      ]
    };
  };

  // Team Member Workload
  const getTeamWorkload = () => {
    const workload = project.team.map(member => ({
      name: member.name,
      tasks: project.tasks.filter(task => 
        task.assignees.some(assignee => assignee.id === member.id)
      ).length
    }));

    return {
      labels: workload.map(w => w.name),
      datasets: [
        {
          label: 'Assigned Tasks',
          data: workload.map(w => w.tasks),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }
      ]
    };
  };

  // Project Comparison
  const getProjectComparison = () => {
    const projectProgress = allProjects.map(p => ({
      name: p.name,
      progress: (p.tasks.filter(t => t.completed).length / p.tasks.length) * 100 || 0
    }));

    return {
      labels: projectProgress.map(p => p.name),
      datasets: [
        {
          label: 'Project Progress (%)',
          data: projectProgress.map(p => p.progress),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }
      ]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="analytics-container">
      <h2>Project Analytics</h2>
      
      <div className="analytics-grid">
        <div className="chart-container">
          <h3>Progress Over Time</h3>
          <Line data={getProgressData()} options={options} />
        </div>

        <div className="chart-container">
          <h3>Task Status Distribution</h3>
          <Pie data={getStatusDistribution()} options={options} />
        </div>

        <div className="chart-container">
          <h3>Team Workload</h3>
          <Bar data={getTeamWorkload()} options={options} />
        </div>

        <div className="chart-container">
          <h3>Project Comparison</h3>
          <Bar data={getProjectComparison()} options={options} />
        </div>
      </div>

      <div className="analytics-summary">
        <div className="summary-card">
          <h3>Key Metrics</h3>
          <div className="metric">
            <span>Completion Rate:</span>
            <span>{((project.tasks.filter(t => t.completed).length / project.tasks.length) * 100).toFixed(1)}%</span>
          </div>
          <div className="metric">
            <span>Average Task Duration:</span>
            <span>{calculateAverageTaskDuration(project.tasks)} days</span>
          </div>
          <div className="metric">
            <span>Overdue Tasks:</span>
            <span>{project.tasks.filter(t => new Date(t.dueDate) < new Date() && !t.completed).length}</span>
          </div>
        </div>

        <div className="summary-card">
          <h3>Team Performance</h3>
          <div className="metric">
            <span>Most Active Member:</span>
            <span>{getMostActiveMember(project)}</span>
          </div>
          <div className="metric">
            <span>Tasks per Member:</span>
            <span>{(project.tasks.length / project.team.length).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const calculateAverageTaskDuration = (tasks) => {
  const completedTasks = tasks.filter(t => t.completed && t.completedAt);
  if (completedTasks.length === 0) return 0;

  const durations = completedTasks.map(task => {
    const start = new Date(task.createdAt);
    const end = new Date(task.completedAt);
    return (end - start) / (1000 * 60 * 60 * 24); // Convert to days
  });

  return (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(1);
};

const getMostActiveMember = (project) => {
  const memberActivity = project.team.map(member => ({
    name: member.name,
    tasks: project.tasks.filter(task => 
      task.assignees.some(assignee => assignee.id === member.id) && task.completed
    ).length
  }));

  return memberActivity.sort((a, b) => b.tasks - a.tasks)[0]?.name || 'N/A';
};

export default ProjectAnalytics;
