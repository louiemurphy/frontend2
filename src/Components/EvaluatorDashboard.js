import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';  // <-- Add Link here
import './EvaluatorDashboard.css';
import { useNavigate } from 'react-router-dom';

function EvaluatorDashboard() {
  const { evaluatorId } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;

  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150");
  const [profileFile, setProfileFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to track if in editing mode
  const [isLoading, setIsLoading] = useState(false);


  const teamMembers = {
    charles: "Charles Coscos",
    caryl: "Caryl Apa",
    patrick: "Patrick Paclibar",
    vincent: "Vincent Go",
    jayr: "Jay-R",
    tristan: "Tristan Chua",
    rodel: "Rodel Bartolata"
  };

  
  const teamMember = teamMembers[evaluatorId] || "Unknown Evaluator";
  const navigate = useNavigate();

// Add this helper function to get the status class
const getStatusClass = (status) => {
switch (status) {
  case 0:
    return 'status-pending';
  case 1:
    return 'status-ongoing';
  case 2:
    return 'status-completed';
  case 3:
    return 'status-canceled';
  default:
    return 'status-pending'; // Default to pending style
}
};

const getLastRequestForEvaluator = () => {
if (requests.length > 0) {
  // Sort requests by timestamp in descending order
  const sortedRequests = [...requests].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return new Date(sortedRequests[0].timestamp).toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // 12-hour format
  });
}
return "N/A";
};


/// First, update the status handling functions
const getDetailedStatusClass = (detailedStatus) => {
if (!detailedStatus || detailedStatus === 'pending') {
  return 'detailed-status-pending';
}
if (detailedStatus === 'ongoing') {
  return 'detailed-status-ongoing';
}
if (detailedStatus.startsWith('done-')) {
  return 'detailed-status-done';
}
if (detailedStatus.startsWith('cancelled-')) {
  return 'detailed-status-cancelled';
}
return 'detailed-status-pending';
};

const getMainStatus = (detailedStatus) => {
if (!detailedStatus || detailedStatus === 'pending') return 0; // Changed to check for empty string

// Map detailed statuses to main statuses
if (detailedStatus === 'ongoing') {
return 1; // Ongoing
} else if (detailedStatus.startsWith('cancelled-')) {
return 3; // Canceled
} else if (detailedStatus.startsWith('done-')) {
return 2; // Completed
} else {
return 0; // Default to Pending
}
};


// Update the handleStatusChanged function
const handleStatusChanged = async (event) => {
const newDetailedStatus = event.target.value;
console.log('Selected detailed status:', newDetailedStatus);

if (!selectedRequest || !selectedRequest._id) {
  alert('No valid request selected');
  return;
}

setIsLoading(true); // Add loading state
try {
  // Update detailed status
  const detailedUpdateResponse = await fetch(
    `http://localhost:5000/api/requests/${selectedRequest._id}/updateDetailedStatus`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        detailedStatus: newDetailedStatus,
        statusChangedAt: new Date().toISOString(),
      }),
    }
  );

  if (!detailedUpdateResponse.ok) {
    const errorData = await detailedUpdateResponse.json();
    console.error('Backend error:', errorData);
    throw new Error(errorData.message || 'Failed to update detailed status');
  }

  const updatedDetailedStatus = await detailedUpdateResponse.json();

  // Update main status
  const newMainStatus = getMainStatus(newDetailedStatus);
  const mainUpdateResponse = await fetch(
    `http://localhost:5000/api/requests/${selectedRequest._id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newMainStatus,
        completedAt: newMainStatus === 2 ? new Date().toISOString() : null,
        canceledAt: newMainStatus === 3 ? new Date().toISOString() : null,
        lastStatusUpdate: new Date().toISOString(),
        previousStatus: selectedRequest.status,
      }),
    }
  );

  if (!mainUpdateResponse.ok) {
    throw new Error('Failed to update main status');
  }

  const finalUpdatedRequest = await mainUpdateResponse.json();

  // Update state
  setRequests((prevRequests) =>
    prevRequests.map((req) =>
      req._id === finalUpdatedRequest._id ? finalUpdatedRequest : req
    )
  );
  setSelectedRequest(finalUpdatedRequest);

  alert('Status updated successfully');
} catch (error) {
  console.error('Error updating status:', error);
  alert(`Failed to update status: ${error.message}`);
} finally {
  setIsLoading(false); // Reset loading state
}
};


  // Add this at the top of your component, right after your state declarations
useEffect(() => {
  setRequests([]); // Clear requests when switching profiles
  setLoading(true); // Reset loading state
  setError(null); // Clear any existing errors
}, [evaluatorId]);

// Replace your existing fetchRequests useEffect with this one
useEffect(() => {
  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/requests');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Get the current evaluator's full name
      const currentEvaluator = teamMembers[evaluatorId];
      if (!currentEvaluator) {
        throw new Error('Invalid evaluator ID');
      }

      // Filter requests strictly by the current evaluator's name
      const filteredRequests = data.filter(request => {
        const assignedTo = request.assignedTo ? request.assignedTo.trim() : '';
        return assignedTo.toLowerCase() === currentEvaluator.toLowerCase();
      });
      
      console.log(`Filtered requests for ${currentEvaluator}:`, filteredRequests);
      
      setRequests(filteredRequests);
      setError(null);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError(err.message);
      setRequests([]); // Clear requests on error
    } finally {
      setLoading(false);
    }
  };

  if (evaluatorId) {
    fetchRequests();
  }
}, [evaluatorId, teamMembers]); // Added teamMembers as dependency

// Add this cleanup effect
useEffect(() => {
  return () => {
    localStorage.removeItem('selectedRequestId');
  };
}, []);
  


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teamMembers/${evaluatorId}`);
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json();
        if (data.profileImage) setProfileImage(`http://localhost:5000${data.profileImage}`);
      } catch (err) {
        console.error(err.message);
      }
    };
  
    const fetchRequests = async () => {
      setLoading(true); // Ensure loading state is set before fetching
      try {
        const response = await fetch('http://localhost:5000/api/requests');
        if (!response.ok) throw new Error('Failed to fetch requests');
        const data = await response.json();
        
        // Debugging: log all requests and current team member
        console.log('All Requests:', data);
        console.log('Current Team Member:', teamMembers[evaluatorId]);
        console.log('Evaluator ID:', evaluatorId);
  
        // Ensure we use the full name from teamMembers object
        const currentTeamMember = teamMembers[evaluatorId] || "Unknown Evaluator";
        
        // More robust filtering with case-insensitive and trim comparison
        const filteredRequests = data.filter(request => {
          const assignedTo = request.assignedTo ? request.assignedTo.trim().toLowerCase() : '';
          const teamMemberLower = currentTeamMember.trim().toLowerCase();
          return assignedTo === teamMemberLower;
        });
  
        console.log('Filtered Requests:', filteredRequests);
        
        setRequests(filteredRequests);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Fetch Requests Error:', err);
        setError(err.message);
        setRequests([]); // Ensure requests are cleared on error
      } finally {
        setLoading(false);
      }
    };
  
    // Call both functions
    fetchProfile();
    fetchRequests();
  }, [evaluatorId]); 
  // Dependency on evaluatorId ensures re-fetch when profile changes

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      setProfileFile(file);
    }
  };

  const handleProfileUpload = async () => {
    if (profileFile) {
      const formData = new FormData();
      formData.append('profileImage', profileFile);
      formData.append('evaluatorId', evaluatorId);

      try {
        const response = await fetch('http://localhost:5000/api/uploadProfile', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload profile image');
        const result = await response.json();
        setProfileImage(`http://localhost:5000${result.filePath}`);
        alert('Profile image updated successfully!');
      } catch (error) {
        alert(`Profile upload failed: ${error.message}`);
      }
    } else {
      alert('Please select a profile image to upload.');
    }
  };

  

  const openModal = (request) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRequest(null);
    setUploadedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedFile(file);
  };

  const handleFileUpload = async () => {
    if (uploadedFile && selectedRequest) {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('requestId', selectedRequest._id);

      try {
        const response = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload file');

        const updatedRequest = await response.json();
        setRequests(prevRequests =>
          prevRequests.map(req => req._id === updatedRequest._id ? updatedRequest : req)
        );

        alert('File uploaded successfully!');
        closeModal();
      } catch (error) {
        alert(`File upload failed: ${error.message}`);
      }
    } else {
      alert('Please select a file to upload.');
    }
  };

  const downloadFile = async (fileUrl, fileName) => {
    try {
      const response = await fetch(`http://localhost:5000${fileUrl}`, {
        method: 'GET',
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
      alert(`Download failed: ${error.message}`);
    }
  };

  const getMonthNumber = (monthName) => {
    const months = {
      January: 0, February: 1, March: 2, April: 3,
      May: 4, June: 5, July: 6, August: 7,
      September: 8, October: 9, November: 10, December: 11
    };
    return months[monthName];
  };

  const filteredRequests = requests
    .filter(req => {
      if (!selectedMonth) return true;
      const requestDate = new Date(req.timestamp);
      const requestMonth = requestDate.getMonth();
      return requestMonth === getMonthNumber(selectedMonth);
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  if (loading) return <div className="loading">Loading requests...</div>;
  if (error) return <div className="error">Error: {error} <button onClick={() => window.location.reload()}>Retry</button></div>;

  return (
    <div className="dashboard-container4">
      <div className="profile-sidebar4">
<div
  className="profile-image-container4"
  onClick={() => isEditing && document.getElementById('fileInput').click()}
>
  <img className="profile-image4" src={profileImage} alt={teamMember} />
  {isEditing && (
    <div className="camera-icon-container">
      <i className="fas fa-camera camera-icon"></i>
    </div>
  )}
</div>
<div className="profile-details4">
  <h3>{teamMember}</h3>

  {isEditing ? (
    <>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleProfileImageChange}
        style={{ display: 'none' }}
      />
      <button
        onClick={handleProfileUpload}
        style={{ display: 'block', marginTop: '10px' }}
      >
        Save Profile Image
      </button>
      <button
        onClick={() => setIsEditing(false)}
        style={{ display: 'block', marginTop: '10px' }}
      >
        Cancel
      </button>
    </>
  ) : (
    <>
      <button
        onClick={() => setIsEditing(true)}
        style={{ display: 'block', marginTop: '10px' }}
      >
        Edit Profile
      </button>
    </>
  )}

  {/* Logout Button */}
  <button
    onClick={() => (window.location.href = '/')} // Redirects to "/"
    style={{
      display: 'block',
      marginTop: '20px',
      padding: '10px 15px',
      backgroundColor: '#1d2d50',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    }}
  >
    Logout
  </button>
</div>
</div>



      {/* Main Content Section */}
      <div className="main-content4">
        {/* Status summary */}
        <div className="status-summary4">
          <div className="status-box4">
            <span className="status-value4">{filteredRequests.length}</span>
            <h3>Total Requests</h3>
          </div>
          <div className="status-box4">
            <span className="status-value4">{filteredRequests.filter(req => req.status === 1).length}</span>
            <h3>Open Requests</h3>
          </div>
          <div className="status-box4">
            <span className="status-value4">{filteredRequests.filter(req => req.status === 2).length}</span>
            <h3>Closed Requests</h3>
          </div>
          <div className="status-box4">
          <h3>Last Request Added</h3>
          <p>{getLastRequestForEvaluator()}</p>
          </div>

        </div>

        {/* Table displaying the list of requests */}
        <div className="table-container4">
          <h3>List of Requests
            {totalPages > 1 && (
              <div className="pagination3">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
              </div>
            )}
          </h3>
          
          <div className="month-filter-container">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
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
              {/* Add other months */}
            </select>
          </div>

          <table className="request-table4">
            <thead>
              <tr>
                <th>REQID</th>
                <th>TIMESTAMP</th>
                <th>PROJECT TITLE</th>
                <th>STATUS</th>
                <th>DATE COMPLETED</th> 
              </tr>
            </thead>
            <tbody>
              {currentRequests.length > 0 ? (
                currentRequests.map(req => (
                  <tr key={req._id} onClick={() => openModal(req)}>
                    <td>{req.referenceNumber}</td>
                    <td>{new Date(req.timestamp).toLocaleString()}</td>

                    <td>{req.projectTitle}</td>
                    <td>
                    <select
value={req.status}
disabled
onClick={(e) => e.stopPropagation()}
className={`status-select ${getStatusClass(req.status)}`}
>
<option value={0}>Pending</option>
<option value={1}>Ongoing</option>
<option value={2}>Completed</option>
<option value={3}>Canceled</option>
</select>
                    </td>
                    <td>
  {req.status === 2 && req.completedAt // Show completedAt if status is "Completed"
    ? new Date(req.completedAt).toLocaleString()
    : req.status === 3 && req.canceledAt // Show canceledAt if status is "Canceled"
    ? new Date(req.canceledAt).toLocaleString()
    : 'N/A'}
</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No requests assigned to you</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for viewing and uploading files */}
      {modalVisible && selectedRequest && (
  <div className="modal4">
    <div className="modal-content4">
      <h3 className="modal-header4">Request Details</h3>
      <table className="modal-table4">
        <tbody>
          <tr>
            <th>Email</th>
            <td>{selectedRequest.email}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{selectedRequest.name}</td>
          </tr>
          <tr>
            <th>Type of Client</th>
            <td>{selectedRequest.typeOfClient}</td>
          </tr>
          <tr>
            <th>Classification</th>
            <td>{selectedRequest.classification}</td>
          </tr>
          <tr>
            <th>Project Title</th>
            <td>{selectedRequest.projectTitle}</td>
          </tr>
          <tr>
            <th>Philgeps Reference Number</th>
            <td>{selectedRequest.philgepsReferenceNumber}</td>
          </tr>
          <tr>
            <th>Product Type</th>
            <td>{selectedRequest.productType}</td>
          </tr>
          <tr>
            <th>Request Type</th>
            <td>{selectedRequest.requestType}</td>
          </tr>
          <tr>
            <th>Date Needed</th>
            <td>{selectedRequest.dateNeeded}</td>
          </tr>
          <tr>
            <th>Special Instructions</th>
            <td>{selectedRequest.specialInstructions}</td>
          </tr>
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
                <a href={selectedRequest.fileUrl} download={selectedRequest.fileName || 'evaluation'}>
                  Download {selectedRequest.fileName}
                </a>
              </td>
            </tr>
          )}
          <tr>
            <th>Upload Evaluation</th>
            <td>
              <input type="file" onChange={handleFileChange} />
              <button onClick={handleFileUpload}>Upload</button>
              {uploadedFile && <p>File: {uploadedFile.name}</p>}
            </td>
          </tr>

          
          <tr>
  <th>Status Update</th>
  <td>
  <select
value={selectedRequest?.detailedStatus || 'pending'} // Changed to use empty string as default
onChange={handleStatusChanged}
className={`detailed-status-select ${getDetailedStatusClass(selectedRequest?.detailedStatus)}`}
>
<option value="pending">Pending</option>
<option value="ongoing">On Going</option>

<optgroup label="Done - Approved">
    <option value="done-system-sizing">Done - System Sizing</option>
    <option value="done-request-approved">Done - Request Approved. For Schedule</option>
    <option value="done-quotation-submitted">Done - Quotation submitted</option>
    <option value="done-technical-docs-turnover">Done - Technical documents turnover done</option>
    <option value="done-proposal-approved">Done - Proposal Approved! Proceed for submission</option>
    <option value="done-survey-request-approved">Done - Survey request approved! arrangement done</option>
    <option value="done-go-proceed-bidding">Done - Go, Proceed to bidding!</option>
    <option value="done-go-suggest-negotiate">Done - Go, Suggest to Negotiate!</option>
  </optgroup>
  <optgroup label="Done - No Go">
    <option value="done-no-go-supplier-acquisition">Done - No Go - Supplier Acquisition Problem</option>
    <option value="done-no-go-bidding-team-directives">Done - No Go, Bidding Team Directives!</option>
    <option value="done-no-go-certificate">Done - No Go, Unable to provide certificates!</option>
    <option value="done-no-go-specifications">Done - No Go, Unable to meet specifications!</option>
    <option value="done-no-go-short-lead-time">Done - No Go, Short Delivery Lead Time!</option>
    <option value="done-no-go-breakeven">Done - No Go, Breakeven!</option>
    <option value="done-no-go-profitability">Done - No Go, Below 20% Profitabilty!</option>
    <option value="done-no-go-negative-profit">Done - No Go, Negative Profit!</option>
  </optgroup>
  <optgroup label="Done - Other">
    <option value="done-suggest-buy-bid-docs">Done - Suggest to buy bid docs for further evaluation</option>
    <option value="done-proposal-disapproved">Done - Proposal disapproved! Need further assessment</option>
    <option value="done-unable-evaluate-late-request">Done - Unable to evaluate, late request!</option>
    <option value="done-unable-evaluate-multiple-requests">Done - Unable to evaluate, multiple requests!</option>
    <option value="done-unable-evaluate-insufficient-data">Done - Unable to evaluate, insufficient data!</option>
  </optgroup>
  <optgroup label="Cancelled">
    <option value="cancelled-survey-request-denied">Cancelled - Survey Request Denied</option>
    <option value="cancelled-not-our-expertise">Cancelled - Not Our Expertise</option>
    <option value="cancelled-double-entry">Cancelled - Double Entry!</option>
    <option value="cancelled-requester-cancelled">Cancelled - Requester cancelled the request!</option>
  </optgroup>
</select>

  </td>
</tr>
{/* Remarks Section */}
<tr>
  <th>Remarks</th>
  <td>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Display previous remarks if they exist */}
      {selectedRequest?.previousRemarks && selectedRequest.previousRemarks.length > 0 && (
        <div style={{
          marginBottom: '12px',
          padding: '8px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          maxHeight: '150px',
          overflowY: 'auto'
        }}>
          {selectedRequest.previousRemarks.map((remark, index) => (
            <div key={index} style={{
              padding: '8px',
              borderBottom: index < selectedRequest.previousRemarks.length - 1 ? '1px solid #ddd' : 'none',
              fontSize: '14px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                {new Date(remark.timestamp).toLocaleString()}
              </div>
              <div>{remark.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* New remarks textarea */}
      <textarea
        value={selectedRequest?.remarks || ''}
        onChange={(e) =>
          setSelectedRequest((prev) => ({
            ...prev,
            remarks: e.target.value,
          }))
        }
        placeholder="Add your comments or remarks here..."
        rows={4}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          resize: 'vertical',
          minHeight: '80px',
          fontFamily: 'inherit',
          backgroundColor: '#f9f9f9',
          color: '#333',
          fontSize: '14px',
          lineHeight: '1.5'
        }}
      />

      {/* Character count */}
      <div style={{
        fontSize: '12px',
        color: '#666',
        alignSelf: 'flex-end',
        marginTop: '-4px'
      }}>
        {selectedRequest?.remarks?.length || 0}/1000 characters
      </div>

      {/* Submit button */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px'
      }}>
        <button
          onClick={() => {
            setSelectedRequest(prev => ({
              ...prev,
              remarks: ''
            }));
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
        >
          Clear
        </button>

        <button
          onClick={async () => {
            try {
              if (!selectedRequest || !selectedRequest._id) {
                throw new Error('No request selected');
              }

              const trimmedRemarks = selectedRequest.remarks ? selectedRequest.remarks.trim() : '';

              if (trimmedRemarks.length === 0) {
                alert('Please enter remarks before sending.');
                return;
              }

              if (trimmedRemarks.length > 1000) {
                alert('Remarks cannot exceed 1000 characters.');
                return;
              }

              const response = await fetch(`http://193.203.162.228:5000/api/requests/${selectedRequest._id}/updateRemarks`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  remarks: trimmedRemarks,
                  timestamp: new Date().toISOString()
                }),
              });

              if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
              }

              const updatedRequest = await response.json();
              
              // Update state with new remarks history
              setSelectedRequest(prevRequest => ({
                ...prevRequest,
                remarks: '',
                previousRemarks: [
                  ...(prevRequest.previousRemarks || []),
                  { text: trimmedRemarks, timestamp: new Date().toISOString() }
                ]
              }));
              
              setRequests((prevRequests) =>
                prevRequests.map((req) =>
                  req._id === updatedRequest._id ? {
                    ...updatedRequest,
                    previousRemarks: [
                      ...(req.previousRemarks || []),
                      { text: trimmedRemarks, timestamp: new Date().toISOString() }
                    ]
                  } : req
                )
              );
              
              // Show success message
              const successMessage = document.createElement('div');
              successMessage.textContent = 'Remarks saved successfully!';
              successMessage.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: #28a745;
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                z-index: 1000;
                animation: fadeOut 3s forwards;
              `;
              document.body.appendChild(successMessage);
              setTimeout(() => successMessage.remove(), 3000);

            } catch (error) {
              console.error('Failed to update remarks:', error);
              
              if (error.message.includes('network')) {
                alert('Network error. Please check your internet connection.');
              } else {
                alert(`Failed to save remarks: ${error.message}`);
              }
            }
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            opacity: (!selectedRequest?.remarks || selectedRequest.remarks.trim().length === 0) ? '0.6' : '1',
          }}
          disabled={!selectedRequest?.remarks || selectedRequest.remarks.trim().length === 0}
        >
          Send Remarks
        </button>
      </div>

      {/* Add styles for the fadeOut animation */}
      <style>
        {`
          @keyframes fadeOut {
            0% { opacity: 1; }
            70% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
      </style>
    </div>
  </td>
</tr>

        </tbody>
      </table>
      <button onClick={closeModal} className="close-modal-btn">Close</button>
    </div>
  </div>
)}


    </div>
  );
}

export default EvaluatorDashboard;