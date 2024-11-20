import React, { useEffect, useState } from 'react';
import './AllProfiles.css';
import { FaBullseye } from 'react-icons/fa';

function AllProfiles() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch team member data from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('https://193.203.162.228:5000/api/teamMembers/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch team members');
        }
        const data = await response.json();
        setTeamMembers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  if (loading) {
    return <div>Loading team members...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getMonthNumber = (month) => {
    const months = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    };
    return months[month] || 0;
  };

  return (
    <div className="all-profiles-container1">
      <h1>EVALUATORS</h1>
      <div className="profiles-grid1">
        {teamMembers.map((member) => {
          // Ensure member data exists
          const openTasks = member.openTasks || 0;
          const closedTasks = member.closedTasks || 0;
          const canceledTasks = member.canceledTasks || 0;
          const tasks = member.tasks || [];

          // Calculate totalRequests
          const total = openTasks + closedTasks + canceledTasks;

          // Efficiency calculation similar to Dashboard component
          const efficiencyRate = total > 0
            ? (
                tasks.filter((task) => {
                  const dateNeeded = task.dateNeeded ? new Date(task.dateNeeded) : new Date();
                  const completedAt = task.dateCompleted ? new Date(task.dateCompleted) : new Date();
                  return completedAt <= dateNeeded;
                }).length / total
              ) * 100
            : 0;  // Use 0 if no tasks

          return (
            <div key={member.name} className="card1">
              <div className="details">
                <h2 className="profile-name">{member.name}</h2>
                <p className="task-stats">
                  Open Tasks: <span>{openTasks}</span>
                </p>
                <p className="task-stats">
                  Closed Tasks: <span>{closedTasks}</span>
                </p>
                <p className="task-stats">
                  Canceled Tasks: <span>{canceledTasks}</span>
                </p>
                <p className="task-stats">
                  Total Requests: <span>{total}</span>
                </p>
                <p className="task-stats">
                  Efficiency: <span>{efficiencyRate.toFixed(2)}%</span>
                </p>
              </div>
              <div className="completion">
                <FaBullseye className="icon" />
                <span className="completion-label">Completion Rate: </span>
                <span className="completion-rate">{member.completionRate || 0}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AllProfiles;
