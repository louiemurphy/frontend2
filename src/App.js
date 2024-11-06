import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import RequesterDashboard from './Components/RequesterDashboard';
import AdminDashboard from './Components/AdminDashboard';
import EvaluatorDashboard from './Components/EvaluatorDashboard';
import AllProfiles from './Components/AllProfiles';
import Dashboard from './Components/Dashboard';
import AllRequests from './Components/AllRequests'; // Import the AllRequests component

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Main login route */}
          <Route path="/" element={<Login />} />

          {/* Main dashboard route */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Requester dashboard */}
          <Route path="/dashboard/requester" element={<RequesterDashboard />} />

          {/* Admin dashboard */}
          <Route path="/dashboard/admin" element={<AdminDashboard />} />

          {/* All profiles page */}
          <Route path="/profiles" element={<AllProfiles />} /> 

          {/* All requests page */}
          <Route path="/all-requests" element={<AllRequests />} />

          {/* Consolidated route for all evaluators */}
          <Route path="/dashboard/evaluator/:evaluatorId" element={<EvaluatorDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
