import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './EvaluatorDashboard.css';

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
      try {
        const response = await fetch(`http://localhost:5000/api/requests?assignedTo=${teamMember}`);
        if (!response.ok) throw new Error('Failed to fetch requests');
        const data = await response.json();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchRequests();
  }, [teamMember, evaluatorId]);

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

  const handleStatusChange = async (requestId, newStatus, fileUrl) => {
    if (newStatus === 2 && !fileUrl) {
      alert('You cannot mark this request as completed without an evaluator file.');
      return;
    }
    const completedAt = newStatus === 2 ? new Date().toISOString() : null;

    try {
      const response = await fetch(`http://localhost:5000/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          completedAt: completedAt,
        }),
      });
      if (!response.ok) throw new Error('Failed to update status');

      const updatedRequest = await response.json();
      setRequests(prevRequests =>
        prevRequests.map(req => req._id === updatedRequest._id ? updatedRequest : req)
      );
    } catch (error) {
      alert('Status update failed. Please try again.');
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
  <div className="profile-image-container4" onClick={() => isEditing && document.getElementById('fileInput').click()}>
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
          style={{ display: 'none' }} // Hide the file input
        />
        <button onClick={handleProfileUpload} style={{ display: 'block', marginTop: '10px' }}>
          Save Profile Image
        </button>
        <button onClick={() => setIsEditing(false)} style={{ display: 'block', marginTop: '10px' }}>
          Cancel
        </button>
      </>
    ) : (
      <button onClick={() => setIsEditing(true)} style={{ display: 'block', marginTop: '10px' }}>
        Edit Profile
      </button>
    )}
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
                        onChange={(e) => handleStatusChange(req._id, Number(e.target.value), req.fileUrl)} 
                        onClick={(e) => e.stopPropagation()}  
                      >
                        <option value={0}>Pending</option>
                        <option value={1}>Ongoing</option>
                        <option value={2} disabled={!req.fileUrl}>Completed</option>
                        <option value={3}>Canceled</option> 
                      </select>
                    </td>
                    <td>{req.completedAt ? new Date(req.completedAt).toLocaleString() : 'N/A'}</td>
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
