import React, { useEffect, useState } from 'react';
import { FaBullseye } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link for routing
import './AllProfiles.css';

function AllProfiles() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch team member data from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('http://193.203.162.228:5000/api/teamMembers/stats');
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

  return (
    <div className="all-profiles-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-content">
          <h2>Sidebar</h2>
          <ul>
            <li>
              <Link to="/dashboard/admin">Back to Home</Link> {/* Link to AdminDashboard */}
            </li>
          </ul>
        </div>
      </div>

      {/* Main content area */}
      <div className="profiles-container">
        <h1>EVALUATORS</h1>
        <div className="profiles-grid">
          {teamMembers.map((member) => {
            const openTasks = member.openTasks || 0;
            const closedTasks = member.closedTasks || 0;
            const canceledTasks = member.canceledTasks || 0;
            const tasks = member.tasks || [];

            const total = openTasks + closedTasks + canceledTasks;

            const efficiencyRate = total > 0
              ? (
                  tasks.filter((task) => {
                    const dateNeeded = task.dateNeeded ? new Date(task.dateNeeded) : new Date();
                    const completedAt = task.dateCompleted ? new Date(task.dateCompleted) : new Date();
                    return completedAt <= dateNeeded;
                  }).length / total
                ) * 100
              : 0;

            return (
              <div key={member.name} className="card">
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
    </div>
  );
}

export default AllProfiles;
