import React, { useEffect, useState } from 'react';
import './Dashboard.css'; // Importing the CSS for styling

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(''); // State for selected month

  useEffect(() => {
    // Fetch the requests data
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/requests', { mode: 'cors' });
        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }
        const data = await response.json();
        setRequests(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

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

  // Filter requests by selected month
  const filteredRequests = React.useMemo(() => {
    if (selectedMonth === '') {
      return requests; // Show all data when no month is selected
    }

    const selectedMonthNumber = getMonthNumber(selectedMonth);
    return requests.filter((request) => {
      const requestDate = new Date(request.timestamp);
      return requestDate.getMonth() + 1 === selectedMonthNumber; // +1 because getMonth() returns 0-based month index
    });
  }, [requests, selectedMonth]);

  // Calculate the statistics based on the filtered requests data
  const calculateStats = () => {
    const total = filteredRequests.length;
    const completed = filteredRequests.filter((request) => request.status === 2).length;
    const canceled = filteredRequests.filter((request) => request.status === 3).length; // Cancellation logic

    const efficiencyRate = total > 0 ? ((completed / total) * 100).toFixed(2) : '0.00';

    // Delayed Rate Logic: If `completedAt` is after `dateNeeded`
    const delayed = filteredRequests.filter((request) => {
      const dateNeeded = new Date(request.dateNeeded);
      const completedAt = new Date(request.completedAt);
      return completedAt > dateNeeded; // Delayed if completedAt is after dateNeeded
    }).length;

    const delayedRate = total > 0 ? ((delayed / total) * 100).toFixed(2) : '0.00';

    const canceledRate = total > 0 ? ((canceled / total) * 100).toFixed(2) : '0.00';
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(2) : '0.00';

    return { total, completionRate, efficiencyRate, delayedRate, canceledRate };
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const { total, completionRate, efficiencyRate, delayedRate, canceledRate } = calculateStats();

  return (
    <div className="dashboard-container">
      {/* Month Filter */}
      <div className="month-filter">
        <label>Filter by Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">All Months</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>

      {/* Stats Section */}
      <div className="stats-container">
        <div className="stat-box">
          <h2>Total Requests</h2>
          <p className="stat-value">{total}</p>
        </div>
        <div className="stat-box">
          <h2>Completion Rate</h2>
          <p className="stat-value">{completionRate}%</p>
        </div>
        <div className="stat-box">
          <h2>Efficiency Rate</h2>
          <p className="stat-value">{efficiencyRate}%</p>
        </div>
        <div className="stat-box">
          <h2>Delayed Rate</h2>
          <p className="stat-value">{delayedRate}%</p>
        </div>
        <div className="stat-box">
          <h2>Canceled Rate</h2>
          <p className="stat-value">{canceledRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
