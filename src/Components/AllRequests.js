import React, { useEffect, useState } from 'react';
import './AllRequests.css';
import { useNavigate } from 'react-router-dom';

function AllRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://193.203.162.228:5000/api/requests');
        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }
        const data = await response.json();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const handleBackToHome = () => {
    navigate('/dashboard/admin');
  };

  const downloadFile = async (fileUrl, fileName) => {
    try {
      const response = await fetch(`http://193.203.162.228:5000${fileUrl}`, {
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
      link.setAttribute('download', fileName || 'downloaded_file');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading requests...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="all-requests-fullscreen">
      <div className="all-requests-page">
        <h2 className="all-requests-title">All Requests</h2>
        <button 
          className="sidebar-back-to-home-button" 
          onClick={handleBackToHome}
        >
          ← Back to Home
        </button>
        <div className="all-requests-table-wrapper">
          <table className="all-requests-table">
            <thead>
              <tr className="all-requests-header-row">
                <th>REQID</th>
                <th>EMAIL</th>
                <th>NAME</th>
                <th>TYPE OF CLIENT</th>
                <th>CLASSIFICATION</th>
                <th>PROJECT TITLE</th>
                <th>Philgeps Reference Number</th>
                <th>Product Type</th>
                <th>Request Type</th>
                <th>Date Needed</th>
                <th>Special Instructions</th>
                <th>Status</th> {/* New Status Column */}
                <th>From Requester</th>
                <th>From Evaluator</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.referenceNumber} className="all-requests-row">
                    <td>{request.referenceNumber || 'N/A'}</td>
                    <td>{request.email}</td>
                    <td>{request.name}</td>
                    <td>{request.typeOfClient}</td>
                    <td>{request.classification}</td>
                    <td>{request.projectTitle}</td>
                    <td>{request.philgepsReferenceNumber}</td>
                    <td>{request.productType}</td>
                    <td>{request.requestType}</td>
                    <td>{request.dateNeeded}</td>
                    <td>{request.specialInstructions}</td>
                    <td>{request.detailedStatus || 'Pending'}</td> {/* Display the Status */}
                    <td>
                      {request.requesterFileUrl ? (
                        <button onClick={() => downloadFile(request.requesterFileUrl, request.requesterFileName)}>
                          Download File
                        </button>
                      ) : 'N/A'}
                    </td>
                    <td>
                      {request.fileUrl ? (
                        <button onClick={() => downloadFile(request.fileUrl, request.fileName)}>
                          Download File
                        </button>
                      ) : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14" style={{ textAlign: 'center' }}>No requests available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AllRequests;
