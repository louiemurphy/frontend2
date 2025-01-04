import React, { useState, useEffect } from 'react';
import { Edit, Download, Trash2 } from 'lucide-react';
import './MonitoringTables.css';


const MonitoringTables = () => {
  const [piEntries, setPiEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});

  // Fields that can be file uploaded
  const fileUploadFields = [
    'bankSlip', 
    'acknowledgmentSupplier', 
    'balanceBankSlip', 
    'balanceAcknowledgmentSupplier', 
    'photosUnloading'
  ];

  useEffect(() => {
    fetchPiEntries();
  }, []);

  const fetchPiEntries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/pi-monitoring');
      if (!response.ok) {
        throw new Error('Failed to fetch PI monitoring entries');
      }
      const data = await response.json();
      setPiEntries(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching PI entries:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleDownloadFile = (filePath) => {
    if (filePath) {
      window.open(`http://localhost:5000/${filePath}`, '_blank');
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setSelectedFiles(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/pi-monitoring/${id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete PI entry');
        }
  
        setPiEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== id));
        alert('Entry deleted successfully');
      } catch (err) {
        console.error('Error deleting PI entry:', err);
        alert(`Failed to delete entry: ${err.message}`);
      }
    }
  };

  const handleEditEntry = (entry) => {
    setSelectedEntry({...entry}); // Create a copy of the entry to edit
    setSelectedFiles({}); // Reset selected files
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateEntry = async () => {
    try {
      const formData = new FormData();
      
      // Append all text fields
      Object.keys(selectedEntry).forEach(key => {
        if (!['_id', 'createdAt', 'timestamp'].includes(key)) {
          formData.append(key, selectedEntry[key] || '');
        }
      });

      // Append files
      fileUploadFields.forEach(field => {
        if (selectedFiles[field]) {
          formData.append(field, selectedFiles[field]);
        }
      });

      // Append _id for identification
      formData.append('_id', selectedEntry._id);

      const response = await fetch(`http://localhost:5000/api/pi-monitoring/${selectedEntry._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update PI entry');
      }

      const updatedData = await response.json();

      // Update the entries in the state
      setPiEntries(prevEntries => 
        prevEntries.map(entry => 
          entry._id === selectedEntry._id ? updatedData.data : entry
        )
      );

      alert('Entry updated successfully');
      setIsEditModalOpen(false);
      // Reset selected files
      setSelectedFiles({});
    } catch (err) {
      console.error('Error updating PI entry:', err);
      alert(`Failed to update entry: ${err.message}`);
    }
  };

  // Function to convert timestamp to Philippine time
  const formatPhilippineTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  if (isLoading) return <div className="loading">Loading PI monitoring entries...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="pi-monitoring-container">
      <h2 className="page-title">PI Monitoring List</h2>
      
      {piEntries.length === 0 ? (
        <p>No PI entries found.</p>
      ) : (
        <div className="table-container">
          <table className="pi-monitoring-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Supplier Info</th>
                <th>Department</th>
                <th>Project Name</th>
                <th>Product Description</th>
                <th>NTP</th>
                <th>CD</th>
                <th>P.I</th>
                <th>Invoice Number</th>
                <th>Production Leadtime</th>
                <th>Total Amount</th>
                <th>Amount</th>
                <th>Bank</th>
                <th>Bank Slip</th>
                <th>Acknowledgment of Supplier</th>
                <th>Balance Amount</th>
                <th>Balance Bank</th>
                <th>Balance Bank Slip</th>
                <th>Balance Acknowledgment of Supplier</th>
                <th>Loading Date</th>
                <th>Container Type</th>
                <th>BL Number</th>
                <th>Departure Date</th>
                <th>Date of Arrival</th>
                <th>Delivery Date at Warehouse</th>
                <th>Photos of Unloading</th>
                <th>Actions</th>
              </tr>
              </thead>
            <tbody>
              {piEntries.map((entry) => (
                <tr key={entry._id}>
                  <td>
  {formatPhilippineTime(entry.updatedAt || entry.createdAt || entry.timestamp)}
</td>
                  <td>{entry.supplierInfo}</td>
                  <td>{entry.department}</td>
                  <td>{entry.projectName}</td>
                  <td>{entry.productDescription}</td>
                  <td>{entry.ntp}</td>
                  <td>{entry.cd}</td>
                  <td>{entry.pi}</td>
                  <td>{entry.invoiceNumber}</td>
                  <td>{entry.productionLeadtime}</td>
                  <td>{entry.totalAmount?.toLocaleString()}</td>
                  <td>{entry.amount?.toLocaleString()}</td>
                  <td>{entry.bank}</td>
                  <td>
                    {entry.bankSlip ? (
                      <button 
                        onClick={() => handleDownloadFile(entry.bankSlip)}
                        className="download-btn"
                        title="Download Bank Slip"
                      >
                        <Download size={20} /> Download
                      </button>
                    ) : (
                      'No Slip'
                    )}
                  </td>
                  <td>
                    {entry.acknowledgmentSupplier ? (
                      <button 
                        onClick={() => handleDownloadFile(entry.acknowledgmentSupplier)}
                        className="download-btn"
                        title="Download Acknowledgment of Supplier"
                      >
                        <Download size={20} /> Download
                      </button>
                    ) : (
                      'No Document'
                    )}
                  </td>
                  <td>{entry.balanceAmount?.toLocaleString()}</td>
                  <td>{entry.balanceBank}</td>
                  <td>
                    {entry.balanceBankSlip ? (
                      <button 
                        onClick={() => handleDownloadFile(entry.balanceBankSlip)}
                        className="download-btn"
                        title="Download Balance Bank Slip"
                      >
                        <Download size={20} /> Download
                      </button>
                    ) : (
                      'No Slip'
                    )}
                  </td>
                  <td>
                    {entry.balanceAcknowledgmentSupplier ? (
                      <button 
                        onClick={() => handleDownloadFile(entry.balanceAcknowledgmentSupplier)}
                        className="download-btn"
                        title="Download Balance Acknowledgment of Supplier"
                      >
                        <Download size={20} /> Download
                      </button>
                    ) : (
                      'No Document'
                    )}
                  </td>
                  <td>{entry.loadingDate}</td>
                  <td>{entry.containerType}</td>
                  <td>{entry.blNumber}</td>
                  <td>{entry.departureDate}</td>
                  <td>{entry.arrivalDate}</td>
                  <td>{entry.deliveryDate}</td>
                  <td>
                    {entry.photosUnloading ? (
                      <button 
                        onClick={() => handleDownloadFile(entry.photosUnloading)}
                        className="download-btn"
                        title="Download Photos of Unloading"
                      >
                        <Download size={20} /> Download
                      </button>
                    ) : (
                      'No Photos'
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleEditEntry(entry)}
                        className="edit-btn"
                        title="Edit Entry"
                      >
                        <Edit size={20} />
                      </button>
                      <button 
                        onClick={() => handleDeleteEntry(entry._id)}
                        className="delete-btn"
                        title="Delete Entry"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

{/* Edit Modal */}
{isEditModalOpen && selectedEntry && (
  <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h2>Edit Entry</h2>
      <form className="edit-form">
        {Object.keys(selectedEntry).map((key) => {
          // Skip certain fields that shouldn't be edited
          if (['_id', 'createdAt', 'timestamp'].includes(key)) return null;

          // Check if it's a file upload field
          if (fileUploadFields.includes(key)) {
            return (
              <div key={key} className="form-group">
                <label htmlFor={key}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase() })}
                </label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    id={key}
                    name={key}
                    onChange={(e) => handleFileChange(e, key)}
                    className="file-input"
                  />
                  {selectedFiles[key] ? (
                    <span className="file-name">{selectedFiles[key].name}</span>
                  ) : (
                    <span className="file-name">
                      {selectedEntry[key] ? 'Existing file' : 'No file'}
                    </span>
                  )}
                </div>
              </div>
            );
          }

          // Specific handling for date fields
          if (['loadingDate', 'departureDate', 'arrivalDate', 'deliveryDate'].includes(key)) {
            return (
              <div key={key} className="form-group">
                <label htmlFor={key}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase() })}
                </label>
                <input
                  type="date"
                  id={key}
                  name={key}
                  value={selectedEntry[key] || ''}
                  onChange={handleInputChange}
                  className="date-input"
                />
              </div>
            );
          }

          // Regular text input for other fields
          return (
            <div key={key} className="form-group">
              <label htmlFor={key}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase() })}
              </label>
              <input
                type="text"
                id={key}
                name={key}
                value={selectedEntry[key] || ''}
                onChange={handleInputChange}
              />
            </div>
          );
        })}
        <div className="modal-actions">
          <button 
            type="button" 
            onClick={handleUpdateEntry} 
            className="update-btn"
          >
            Update Entry
          </button>
          <button 
            type="button" 
            onClick={() => setIsEditModalOpen(false)} 
            className="cancel-btn1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default MonitoringTables;