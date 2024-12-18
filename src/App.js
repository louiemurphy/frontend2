import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import RequesterDashboard from './Components/RequesterDashboard';
import AdminDashboard from './Components/AdminDashboard';
import EvaluatorDashboard from './Components/EvaluatorDashboard';
import AllProfiles from './Components/AllProfiles';
import Dashboard from './Components/Dashboard';
import AllRequests from './Components/AllRequests';
import Supplier from './Components/Supplier';
import List from './Components/List';
import Pi from './Components/Pi';
import MonitoringTables from './Components/MonitoringTables';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  // Define email lists (consider moving these to a separate config file in production)
  const evaluatorEmails = {
    'charles.coscos@greenergy.com': 'charles',
    'caryl.apa@greenergy.com': 'caryl',
    'patrick.paclibar@greenergy.com': 'patrick',
    'vincent.go@greenergy.com': 'vincent',
    'jayr@greenergy.com': 'jayr',
    'rodel.bartolata@greenergy.com': 'rodel',
    'tristan@greenergy.com': 'tristan',
  };
  const adminEmails = ['admin@greenergy.ph'];
  const requesterEmails = ['requester@greenergy.ph'];

  // Combined emails for routes that multiple roles can access
  const allAuthorizedEmails = [...adminEmails, ...Object.keys(evaluatorEmails), ...requesterEmails];

  return (
    <Router>
      <div>
        <Routes>
          {/* Public route - Login page */}
          <Route path="/" element={<Login />} />

          {/* Protected main dashboard route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedEmails={allAuthorizedEmails}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Requester Dashboard */}
          <Route
            path="/dashboard/requester"
            element={
              <ProtectedRoute allowedEmails={requesterEmails}>
                <RequesterDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Dashboard */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedEmails={adminEmails}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Evaluator Dashboard */}
          <Route
            path="/dashboard/evaluator/:evaluatorId"
            element={
              <ProtectedRoute allowedEmails={Object.keys(evaluatorEmails)}>
                <EvaluatorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected All Profiles Page */}
          <Route
            path="/profiles"
            element={
              <ProtectedRoute allowedEmails={[...adminEmails, ...Object.keys(evaluatorEmails)]}>
                <AllProfiles />
              </ProtectedRoute>
            }
          />

          {/* Protected All Requests Page */}
          <Route
            path="/all-requests"
            element={
              <ProtectedRoute allowedEmails={allAuthorizedEmails}>
                <AllRequests />
              </ProtectedRoute>
            }
          />

          {/* Protected Supplier Master List */}
          <Route
            path="/supplier-master-list"
            element={
              <ProtectedRoute allowedEmails={allAuthorizedEmails}>
                <Supplier />
              </ProtectedRoute>
            }
          />

          {/* Protected Supplier List */}
          <Route
            path="/list"
            element={
              <ProtectedRoute allowedEmails={allAuthorizedEmails}>
                <List />
              </ProtectedRoute>
            }
          />

          {/* Protected PI Monitoring */}
          <Route
            path="/pi-monitoring"
            element={
              <ProtectedRoute allowedEmails={allAuthorizedEmails}>
                <Pi />
              </ProtectedRoute>
            }
          />

          {/* Protected Monitoring Tables */}
          <Route
            path="/monitoring-tables"
            element={
              <ProtectedRoute allowedEmails={allAuthorizedEmails}>
                <MonitoringTables />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;