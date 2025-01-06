import React, { useEffect, useState, useMemo } from 'react';
import { FaBullseye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './AllProfiles.css';

const monthMap = {
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

const AllProfiles = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/teamMembers/stats');
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

  const filteredTeamMembers = useMemo(() => {
    if (!selectedMonth) return teamMembers;

    const selectedMonthNumber = monthMap[selectedMonth];
    return teamMembers.map((member) => {
      const filteredTasks = member.tasks.filter((task) => {
        const taskDate = new Date(task.timestamp);
        return taskDate.getMonth() + 1 === selectedMonthNumber;
      });

      const openTasks = filteredTasks.filter((task) => task.status === 1).length;
      const closedTasks = filteredTasks.filter((task) => task.status === 2).length;
      const canceledTasks = filteredTasks.filter((task) => task.status === 3).length;

      return { ...member, tasks: filteredTasks, openTasks, closedTasks, canceledTasks };
    });
  }, [teamMembers, selectedMonth]);

  if (loading) return <div>Loading team members...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="all-profiles-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="profiles-container">
        <Header selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
        <ProfileGrid teamMembers={filteredTeamMembers} />
      </main>
    </div>
  );
};

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-content">
      <h2>Evaluator</h2>
      <ul>
        <li>
          <Link to="/dashboard/admin">Back to Home</Link>
        </li>
      </ul>
    </div>
  </aside>
);

const Header = ({ selectedMonth, setSelectedMonth }) => (
  <header className="header-wrapper3">
    <div className="month-filter3">
      <label htmlFor="month">Filter by Month:</label>
      <select
        id="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        <option value="">All Months</option>
        {Object.keys(monthMap).map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
    </div>
  </header>
);

const ProfileGrid = ({ teamMembers }) => (
  <section className="profiles-grid">
    {teamMembers.map((member) => (
      <ProfileCard key={member.name} member={member} />
    ))}
  </section>
);

const ProfileCard = ({ member }) => {
  const totalTasks = member.tasks.length;
  const completedTasks = member.tasks.filter((task) => task.status === 2).length;

  const efficiencyRate =
  totalTasks > 0
    ? (member.tasks.filter((task) => {
        const dateNeeded = new Date(task.dateNeeded || Date.now());
        const dateCompleted = new Date(task.dateCompleted || Date.now());
        return task.status === 2 && dateCompleted <= dateNeeded; // Only include on-time completions
      }).length / totalTasks) *
      100
    : 0;


  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="card">
      <div className="details">
        <h2 className="profile-name">{member.name}</h2>
        <TaskStat label="Open Tasks" value={member.openTasks} />
        <TaskStat label="Closed Tasks" value={member.closedTasks} />
        <TaskStat label="Canceled Tasks" value={member.canceledTasks} />
        <TaskStat label="Total Requests" value={totalTasks} />
        <TaskStat label="Efficiency" value={`${efficiencyRate.toFixed(2)}%`} />
      </div>
      <div className="completion">
        <FaBullseye className="icon" />
        <span className="completion-label">Completion Rate: </span>
        <span className="completion-rate">{completionRate.toFixed(2)}%</span>
      </div>
    </div>
  );
};

const TaskStat = ({ label, value }) => (
  <p className="task-stats">
    {label}: <span>{value}</span>
  </p>
);

export default AllProfiles;
