import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import RequesterDashboard from './Components/RequesterDashboard';
import AdminDashboard from './Components/AdminDashboard';
import EvaluatorDashboard from './Components/EvaluatorDashboard';
import AllProfiles from './Components/AllProfiles';
import Dashboard from './Components/Dashboard';
import AllRequests from './Components/AllRequests'; // Import the AllRequests component
import Supplier from './Components/Supplier'; // Import the Supplier component
import List from './Components/List'; // Import the List component (for the supplier master list)
import Pi from './Components/Pi'; // Import the Pi component for PI Monitoring

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

          {/* New route for SUPPLIER MASTER LIST */}
          <Route path="/supplier-master-list" element={<Supplier />} /> 

          {/* Route for the Supplier List (this will display the supplier master list) */}
          <Route path="/list" element={<List />} />  

          {/* Route for PI Monitoring */}
          <Route path="/pi-monitoring" element={<Pi />} /> {/* Add this line */}

          {/* Consolidated route for all evaluators */}
          <Route path="/dashboard/evaluator/:evaluatorId" element={<EvaluatorDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
