import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import Sidebar from './Sidebar';




// Header Component
function HeaderSection({ requests }) {
  return (
    <header className="header-section2">
      <div className="header-content2">
        <div className="header-left2">
          <h1>ADMIN DASHBOARD</h1>
        </div>
        <div className="header-right2">
          <p>Last Request Added: {requests[requests.length - 1]?.timestamp || 'N/A'}</p>
        </div>
      </div>
    </header>
  );
}

// Status Summary Component - Updates based on filtered requests
function StatusSummary({ requests }) {
  const total = requests.length;
  const newRequests = requests.filter((request) => request.status === 0).length;
  const unassigned = requests.filter((request) => !request.assignedTo).length;
  const open = requests.filter((request) => request.status === 1).length;
  const closed = requests.filter((request) => request.status === 2).length;

  return (
    <div className="stat-container2">
      <div className="stat-box2">
        <span className="label">TOTAL</span>
        <span className="value">{total}</span>
      </div>
      <div className="stat-box2">
        <span className="label">NEW</span>
        <span className="value">{newRequests}</span>
      </div>
      <div className="stat-box2">
        <span className="label">UNASSIGNED</span>
        <span className="value">{unassigned}</span>
      </div>
      <div className="stat-box2">
        <span className="label">OPEN</span>
        <span className="value">{open}</span>
      </div>
      <div className="stat-box2">
        <span className="label">CLOSED</span>
        <span className="value">{closed}</span>
      </div>
    </div>
  );
}

// Request List Component with Pagination, Search Functionality, and Month Filter
function RequestList({
  requests,
  handleStatusChange,
  openOverlay,
  openModal,
  currentPage,
  paginate,
  requestsPerPage,
  searchQuery,
  setSearchQuery,
  selectedMonth,
  handleMonthChange,
}) {
  const totalRequests = requests.length;
  const totalPages = Math.ceil(totalRequests / requestsPerPage);
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;

  const filteredRequests = React.useMemo(() => {
    return requests.filter((request) =>
      request.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [requests, searchQuery]);

  const currentRequests = React.useMemo(() => {
    return filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  }, [filteredRequests, indexOfFirstRequest, indexOfLastRequest]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  return (
    <div className="request-list-container">
      <div className="search-and-pagination-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="month-filter-pagination">
          <select value={selectedMonth} onChange={handleMonthChange}>
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
          <div className="pagination-controls">
  <span className="pagination-info">
    {currentPage}-{totalPages}
  </span>
  <div className="pagination-buttons">
    <button
      className="pagination-btn"
      onClick={handlePreviousPage}
      disabled={currentPage === 1}
    >
      &lt;
    </button>
    <button
      className="pagination-btn"
      onClick={handleNextPage}
      disabled={currentPage === totalPages}
    >
      &gt;
    </button>
  </div>
</div>
        </div>
      </div>
      

      <div className="table-container3">
  <table className="request-table2">
      <thead>
        <tr>
          <th>REQID</th>
          <th>TIMESTAMP</th>
          <th>PROJECT TITLE</th>
          <th>ASSIGNED TO</th>
          <th className='stat'>STATUS</th>
          <th>ACTION</th>
          <th>DATE COMPLETED</th>
        </tr>
      </thead>
      <tbody>
        {currentRequests.map((request) => (
          <tr key={request._id} onClick={() => openModal(request)}>
            <td>{request.referenceNumber}</td>
            <td>{request.timestamp}</td>
            <td>{request.projectTitle}</td>
            <td>{request.assignedTo || 'Unassigned'}</td>
            <td>
              <select
                value={request.status}
                onChange={(e) => handleStatusChange(request._id, Number(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                disabled={request.status === 2}
              >
                <option value={0}>Pending</option>
                <option value={1}>Ongoing</option>
                <option value={2}>Completed</option>
                <option value={3}>Cancelled</option>
              </select>
            </td>
            <td>
              <button
                className="assign-button2"
                onClick={(e) => {
                  e.stopPropagation();
                  openOverlay(request);
                }}
              >
                Assign
              </button>
            </td>
            <td>{request.completedAt ? new Date(request.completedAt).toLocaleString() : 'N/A'}</td>

          </tr>
        ))}
      </tbody>
    </table>
</div>

    </div>
  );
}

// Main AdminDashboard Component
function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const requestsPerPage = 5;

  const teamMembers = ['Charles Coscos', 'Patrick Paclibar', 'Caryl Apa', 'Vincent Go', 'Rodel Bartolata', 'Tristan Chua', 'Jay-R'];

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
    return months[month];
  };

  useEffect(() => {
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

    // Retrieve the saved page number from localStorage
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
      setCurrentPage(Number(savedPage)); // Set the current page to the saved value
    }

    fetchRequests();
  }, []);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    localStorage.setItem('currentPage', pageNumber); // Save the current page to localStorage
  };

  const openOverlay = (request) => {
    setSelectedRequest(request);
    setOverlayVisible(true);
  };

  const closeOverlay = () => {
    setOverlayVisible(false);
    setSelectedRequest(null);
    setSelectedTeamMember('');
  };

  const handleSave = async () => {
    if (selectedTeamMember) {
      const updatedRequests = requests.map((request) =>
        request._id === selectedRequest._id ? { ...request, assignedTo: selectedTeamMember } : request
      );
      setRequests(updatedRequests);

      try {
        const response = await fetch(`http://localhost:5000/api/requests/${selectedRequest._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ assignedTo: selectedTeamMember }),
        });

        if (!response.ok) {
          throw new Error('Failed to update request on the server');
        }

        closeOverlay();
      } catch (err) {
        console.error('Error updating request:', err);
      }
    } else {
      alert('Please select a team member!');
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    const completedAt = newStatus === 2 ? new Date().toISOString() : null;
    const cancelledAt = newStatus === 3 ? new Date().toISOString() : null; // Handle the cancelled timestamp
  
    try {
      const updatedRequests = requests.map((request) =>
        request._id === requestId ? { ...request, status: newStatus, completedAt, cancelledAt } : request
      );
      setRequests(updatedRequests);
  
      const response = await fetch(`http://localhost:5000/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, completedAt, cancelledAt }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update request status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };
  

  const openModal = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRequest(null);
  };

  const downloadFile = async (fileUrl, fileName) => {
    try {
      const response = await fetch(`http://localhost:5000${fileUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Filter requests by selected month and search query
  // Filter requests by selected month and search query, and sort by newest first
const filteredRequests = requests.filter((request) => {
  const requestDate = new Date(request.timestamp);
  const requestMonth = requestDate.getMonth() + 1;
  const selectedMonthNumber = getMonthNumber(selectedMonth);

  const matchesSearchQuery =
    request.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.name.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesMonth = selectedMonth === '' || requestMonth === selectedMonthNumber;

  return matchesSearchQuery && matchesMonth;
}).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by timestamp in descending order


  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  if (loading) {
    return <div>Loading requests...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="header-wrapper">
        <HeaderSection requests={requests} />
      </div>

      <div className="status-summary-wrapper">
        <StatusSummary requests={filteredRequests} /> {/* Pass filtered requests */}
      </div>

      <div className="dashboard-container2">
      <div className="sidebar-wrapper">
          <Sidebar />
        </div>

        <div className="main-content2">
          <div className="content-section2">
            <RequestList
              requests={filteredRequests}
              handleStatusChange={handleStatusChange}
              openOverlay={openOverlay}
              openModal={openModal}
              currentPage={currentPage}
              paginate={paginate}
              requestsPerPage={requestsPerPage}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedMonth={selectedMonth} // Pass the selected month
              handleMonthChange={handleMonthChange} // Month change handler
            />
          </div>

          
        </div>
      </div>

      {modalVisible && selectedRequest && (
        <div className="modal2">
          <div className="modal-content2">
            <h3>Request Details</h3>
            <table className="modal-table2">
              <tbody>
                <tr><th>Email</th><td>{selectedRequest.email}</td></tr>
                <tr><th>Name</th><td>{selectedRequest.name}</td></tr>
                <tr><th>Type of Client</th><td>{selectedRequest.typeOfClient}</td></tr>
                <tr><th>Classification</th><td>{selectedRequest.classification}</td></tr>
                <tr><th>Project Title</th><td>{selectedRequest.projectTitle}</td></tr>
                <tr><th>Philgeps Reference Number</th><td>{selectedRequest.philgepsReferenceNumber}</td></tr>
                <tr><th>Product Type</th><td>{selectedRequest.productType}</td></tr>
                <tr><th>Request Type</th><td>{selectedRequest.requestType}</td></tr>
                <tr><th>Date Needed</th><td>{selectedRequest.dateNeeded}</td></tr>
                <tr><th>Special Instructions</th><td>{selectedRequest.specialInstructions}</td></tr>
                {selectedRequest.requesterFileUrl && (
                  <tr>
                    <th>From Requester:</th>
                    <td>
                      <button onClick={() => downloadFile(selectedRequest.requesterFileUrl, selectedRequest.requesterFileName)}>
                        Download {selectedRequest.requesterFileName || 'file'}
                      </button>
                    </td>
                  </tr>
                )}
                {selectedRequest.fileUrl && (
                  <tr>
                    <th>From Evaluator:</th>
                    <td>
                      <button onClick={() => downloadFile(selectedRequest.fileUrl, selectedRequest.fileName)}>
                        Download {selectedRequest.fileName || 'evaluator file'}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <button onClick={closeModal} className="close-modal-btn">Close</button>
          </div>
        </div>
      )}

      {overlayVisible && (
        <div className="overlay2">
          <div className="lightbox-content2">
            <h3>Assign Request</h3>
            <div className="select-team-member-wrapper">
  <label>Select Team Member:</label>
  <select
    value={selectedTeamMember}
    onChange={(e) => setSelectedTeamMember(e.target.value)}
  >
    <option value="" disabled>Select...</option>
    {teamMembers.map((member, index) => (
      <option key={index} value={member}>
        {member}
      </option>
    ))}
  </select>
</div>

            <div className="lightbox-actions2">
              <button onClick={handleSave} disabled={!selectedTeamMember}>
                Save
              </button>
              <button onClick={closeOverlay}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
