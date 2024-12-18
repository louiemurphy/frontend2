import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FaCheckCircle, FaClock, FaExclamationCircle, FaBan, FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const navigate = useNavigate(); // Create navigate object for navigation

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://193.203.162.228:5000/api/requests', { mode: 'cors' });
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
      January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
      July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
    };
    return months[month] || 0;
  };

  const filteredRequests = React.useMemo(() => {
    if (selectedMonth === '') {
      return requests;
    }

    const selectedMonthNumber = getMonthNumber(selectedMonth);
    return requests.filter((request) => {
      const requestDate = new Date(request.timestamp);
      return requestDate.getMonth() + 1 === selectedMonthNumber;
    });
  }, [requests, selectedMonth]);

  const processChartData = () => {
    const chartData = [];

    filteredRequests.forEach((request) => {
      const requestDate = new Date(request.timestamp);
      const month = requestDate.toLocaleString('default', { month: 'short' });

      let monthData = chartData.find(data => data.month === month);
      if (!monthData) {
        monthData = { month, delayed: 0, onTime: 0, total: 0, completed: 0 };
        chartData.push(monthData);
      }

      monthData.total += 1;
      if (request.status === 2) {
        monthData.completed += 1;
      }

      const dateNeeded = new Date(request.dateNeeded);
      const completedAt = new Date(request.completedAt);

      if (completedAt > dateNeeded) {
        monthData.delayed += 1;
      } else {
        monthData.onTime += 1;
      }
    });

    return chartData;
  };

  const chartData = processChartData();

  const calculateStats = () => {
    const total = filteredRequests.length;
    const completed = filteredRequests.filter((request) => request.status === 2).length;
    const canceled = filteredRequests.filter((request) => request.status === 3).length;

    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(2) : '0.00';
    const efficiencyRate = total > 0 ? ((completed / total) * 100).toFixed(2) : '0.00';

    const delayed = filteredRequests.filter((request) => {
      const dateNeeded = new Date(request.dateNeeded);
      const completedAt = new Date(request.completedAt);
      return completedAt > dateNeeded;
    }).length;

    const delayedRate = total > 0 ? ((delayed / total) * 100).toFixed(2) : '0.00';
    const canceledRate = total > 0 ? ((canceled / total) * 100).toFixed(2) : '0.00';

    return { total, completionRate, efficiencyRate, delayedRate, canceledRate };
  };

  const handleBackToHome = () => {
    navigate('/dashboard/admin'); // Use navigate to go back to home page
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
      {/* Back button */}
      <button 
        className="sidebar-back-to-home-button" 
        onClick={handleBackToHome}
      >
        ← Back to Home
      </button>

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

      <div className="stats-container">
        <div className="stat-box">
          <h2>Total Requests</h2>
          <FaQuestionCircle className="stat-icon" />
          <p className="stat-value">{total}</p>
          <div className="stat-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="total" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="stat-box">
          <h2>Completion Rate</h2>
          <FaCheckCircle className="stat-icon" />
          <p className="stat-value">{completionRate}%</p>
          <div className="stat-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="completed" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="stat-box">
          <h2>Efficiency Rate</h2>
          <FaClock className="stat-icon" />
          <p className="stat-value">{efficiencyRate}%</p>
          <div className="stat-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="onTime" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="stat-box">
          <h2>Delayed Rate</h2>
          <FaExclamationCircle className="stat-icon" />
          <p className="stat-value">{delayedRate}%</p>
          <div className="stat-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="delayed" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="stat-box">
          <h2>Canceled Rate</h2>
          <FaBan className="stat-icon" />
          <p className="stat-value">{canceledRate}%</p>
          <div className="stat-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Bar dataKey="canceled" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h2>Delayed vs On Time Requests</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="delayed" stroke="#FF9800" />
              <Line type="monotone" dataKey="onTime" stroke="#4CAF50" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h2>Total Requests vs Completed Requests</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#2196F3" />
              <Line type="monotone" dataKey="completed" stroke="#4CAF50" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
