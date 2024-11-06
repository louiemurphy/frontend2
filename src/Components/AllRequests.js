import React, { useEffect, useState } from 'react';
import './AllRequests.css';

function AllRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/requests');
        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }
        const data = await response.json();
        console.log(data); // Log the response to verify structure
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadFile = (fileUrl, fileName) => {
    fetch(fileUrl, { method: 'GET' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'downloaded_file'; // Use provided file name or a generic name
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); // Clean up
      })
      .catch(err => console.error('File download failed:', err));
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
                    <td>
                      {request.requesterFileName ? (
                        <button onClick={() => downloadFile(request.requesterFileUrl, request.requesterFileName)}>
                          Download File
                        </button>
                      ) : 'N/A'}
                    </td>
                    <td>
                    {request.fileName? (
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
