import React from 'react';

const ProjectMetrics = ({ project }) => {
  const calculateMetrics = () => {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.completed).length;
    const overdueTasks = project.tasks.filter(t => 
      new Date(t.dueDate) < new Date() && !t.completed
    ).length;

    const tasksByPriority = project.tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});

    const avgCompletionTime = calculateAverageCompletionTime(project.tasks);
    const teamEfficiency = calculateTeamEfficiency(project);
    const taskDistribution = calculateTaskDistribution(project);
    const projectHealth = calculateProjectHealth(project);

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      tasksByPriority,
      avgCompletionTime,
      teamEfficiency,
      taskDistribution,
      projectHealth
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="metrics-container">
      <h2>Project Metrics & Analysis</h2>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Task Overview</h3>
          <div className="metric-content">
            <div className="metric-item">
              <span>Total Tasks:</span>
              <span>{metrics.totalTasks}</span>
            </div>
            <div className="metric-item">
              <span>Completed:</span>
              <span>{metrics.completedTasks}</span>
            </div>
            <div className="metric-item">
              <span>Completion Rate:</span>
              <span>{((metrics.completedTasks / metrics.totalTasks) * 100).toFixed(1)}%</span>
            </div>
            <div className="metric-item warning">
              <span>Overdue Tasks:</span>
              <span>{metrics.overdueTasks}</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <h3>Priority Distribution</h3>
          <div className="metric-content">
            {Object.entries(metrics.tasksByPriority).map(([priority, count]) => (
              <div key={priority} className="metric-item">
                <span>{priority}:</span>
                <span>{count} ({((count / metrics.totalTasks) * 100).toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="metric-card">
          <h3>Team Performance</h3>
          <div className="metric-content">
            <div className="metric-item">
              <span>Team Efficiency:</span>
              <span>{metrics.teamEfficiency.score.toFixed(1)}%</span>
            </div>
            <div className="metric-item">
              <span>Most Productive Member:</span>
              <span>{metrics.teamEfficiency.topPerformer}</span>
            </div>
            <div className="metric-item">
              <span>Tasks per Member:</span>
              <span>{(metrics.totalTasks / project.team.length).toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <h3>Time Analysis</h3>
          <div className="metric-content">
            <div className="metric-item">
              <span>Avg. Completion Time:</span>
              <span>{metrics.avgCompletionTime} days</span>
            </div>
            <div className="metric-item">
              <span>Tasks Completed Early:</span>
              <span>{metrics.taskDistribution.earlyCompletions}</span>
            </div>
            <div className="metric-item">
              <span>Tasks Completed Late:</span>
              <span>{metrics.taskDistribution.lateCompletions}</span>
            </div>
          </div>
        </div>

        <div className="metric-card full-width">
          <h3>Project Health Score</h3>
          <div className="health-indicator">
            <div className="health-bar">
              <div 
                className="health-fill"
                style={{
                  width: `${metrics.projectHealth.score}%`,
                  backgroundColor: getHealthColor(metrics.projectHealth.score)
                }}
              />
            </div>
            <span className="health-score">{metrics.projectHealth.score}%</span>
          </div>
          <div className="health-factors">
            {metrics.projectHealth.factors.map((factor, index) => (
              <div key={index} className="health-factor">
                <span>{factor.name}:</span>
                <span className={factor.status}>{factor.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const calculateAverageCompletionTime = (tasks) => {
  const completedTasks = tasks.filter(t => t.completed && t.completedAt);
  if (completedTasks.length === 0) return 0;

  const times = completedTasks.map(task => {
    const start = new Date(task.createdAt);
    const end = new Date(task.completedAt);
    return (end - start) / (1000 * 60 * 60 * 24);
  });

  return (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);
};

const calculateTeamEfficiency = (project) => {
  const memberPerformance = project.team.map(member => {
    const assignedTasks = project.tasks.filter(task =>
      task.assignees.some(a => a.id === member.id)
    );
    const completedTasks = assignedTasks.filter(t => t.completed);
    const completionRate = assignedTasks.length ? completedTasks.length / assignedTasks.length : 0;
    return { member, completionRate };
  });

  const topPerformer = memberPerformance.sort((a, b) => b.completionRate - a.completionRate)[0];
  const averageEfficiency = memberPerformance.reduce((acc, curr) => acc + curr.completionRate, 0) / memberPerformance.length;

  return {
    score: averageEfficiency * 100,
    topPerformer: topPerformer?.member.name || 'N/A'
  };
};

const calculateTaskDistribution = (project) => {
  const completedTasks = project.tasks.filter(t => t.completed && t.completedAt);
  
  const distribution = completedTasks.reduce((acc, task) => {
    const completionDate = new Date(task.completedAt);
    const dueDate = new Date(task.dueDate);
    
    if (completionDate <= dueDate) {
      acc.earlyCompletions++;
    } else {
      acc.lateCompletions++;
    }
    
    return acc;
  }, { earlyCompletions: 0, lateCompletions: 0 });

  return distribution;
};

const calculateProjectHealth = (project) => {
  const factors = [];
  let totalScore = 0;

  // Task Completion Rate
  const completionRate = project.tasks.length ?
    (project.tasks.filter(t => t.completed).length / project.tasks.length) * 100 : 0;
  factors.push({
    name: 'Task Completion',
    status: getHealthStatus(completionRate)
  });
  totalScore += completionRate;

  // Overdue Tasks
  const overdueRate = project.tasks.length ?
    (project.tasks.filter(t => new Date(t.dueDate) < new Date() && !t.completed).length / project.tasks.length) * 100 : 0;
  factors.push({
    name: 'Timeline',
    status: getHealthStatus(100 - overdueRate)
  });
  totalScore += (100 - overdueRate);

  // Team Workload Distribution
  const workloadDistribution = calculateWorkloadDistribution(project);
  factors.push({
    name: 'Workload Balance',
    status: getHealthStatus(workloadDistribution)
  });
  totalScore += workloadDistribution;

  return {
    score: Math.round(totalScore / 3),
    factors
  };
};

const calculateWorkloadDistribution = (project) => {
  if (!project.team.length) return 0;

  const workloads = project.team.map(member =>
    project.tasks.filter(task =>
      task.assignees.some(a => a.id === member.id)
    ).length
  );

  const avg = workloads.reduce((a, b) => a + b, 0) / workloads.length;
  const maxDeviation = Math.max(...workloads.map(w => Math.abs(w - avg)));
  const maxPossibleDeviation = project.tasks.length;

  return 100 - ((maxDeviation / maxPossibleDeviation) * 100);
};

const getHealthStatus = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
};

const getHealthColor = (score) => {
  if (score >= 80) return '#28a745';
  if (score >= 60) return '#ffc107';
  if (score >= 40) return '#fd7e14';
  return '#dc3545';
};

export default ProjectMetrics;
