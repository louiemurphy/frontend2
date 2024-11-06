import React, { useState, useEffect } from 'react';
import './RequesterDashboard.css'; // Custom CSS file for styling
import { FaUsers, FaShoppingCart, FaBox } from 'react-icons/fa'; // Icons for cards

function RequesterDashboard() {
  // States
  const [showRequestForm, setShowRequestForm] = useState(false); // Toggle form visibility
  const [requests, setRequests] = useState([]); // State to store requests
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [selectedRequest, setSelectedRequest] = useState(null); // State for selected request
  const [filterName, setFilterName] = useState(''); // State for filtering by name
  const [selectedFile, setSelectedFile] = useState(null); // File upload state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [selectedMonth, setSelectedMonth] = useState(''); // State for filtering by month
  const requestsPerPage = 5; // Number of requests per page
  const [modalVisible, setModalVisible] = useState(false); // Default is set to false

  const [requestForm, setRequestForm] = useState({
    email: '',
    name: '',
    typeOfClient: '',
    classification: '',
    projectTitle: '',
    philgepsReferenceNumber: '',
    productType: '',
    requestType: '',
    dateNeeded: '',
    specialInstructions: '',
    status: 0,
  });

  const [errors, setErrors] = useState({}); // To store form errors

  // Mock data for dropdowns (same as before)
  const names = ['Cerael Donggay', 'Andrew Donggay', 'Aries Paye', 'Melody Nazareno', 'Roy Junsay', 'Mark Sorreda', 'Zir Madridano', 'Rizaldy Baldemor', 'Giovanne Bongga', 'Joyaneil Lumampao', 'Michael Bughanoy', 'Anthony De Gracia', 'Alex Cabisada', 'Matt Caulin', 'Richard Cagalawan', 'William Jover', 'Paul Shane Marte', 'Marvin Oteda', 'Julius Tan', 'Joren Bangquiao', 'Diane Yumul', 'Kenneth Fabroa', 'Mylene Agurob', 'BIDDING TEAM - Kia', 'Novi Generalao', 'BIDDING TEAM - Cora', 'BIDDING TEAM - Jan', 'BIDDING TEAM - Kaye', 'Marketing', 'Freelance', 'Ronie Serna', 'Andy Bello', 'Simon Paul Molina', 'Ralph Reginald Hallera Yee', 'Cesar Samboy Sassan'];

  const productTypes = ['Solar Roof Top', 'Solar Lights', 'Solar Pump', 'AC Lights', 'Diesel Generator', 'Transformer', 'Electric Vehicle', 'Floating Solar', 'Micro Grid', 'Solar Road Stud', 'Georesistivity', 'Drilling', 'Prefab Container', 'Command Center', 'ICT Products', 'Energy Audit', 'Building Construction', 'Road Concreting', 'Drone', 'Agricultural Machinery', 'Ice Machine', 'Riprap', 'Retaining Wall', 'Industrial Pumps', 'Building Wiring Installation', 'Solar CCTV', 'Solar Farm', 'Solar Insect Traps', 'Solar Water Heater', 'Concrete Water Tank', 'Solar Waiting Shed', 'Solar Prefab Container', 'Structured Cabling', 'Water Desalination', 'Steel Water Tank', 'Hydroponics', 'HVAC', 'Piping System', 'Water System', 'Conveyor System', 'Solar Generator', 'Solar Water Purifier', 'Heavy Equipment', 'Traffic Light', 'AC CCTV', 'Solar Aerator', 'AC Aerator'];

  const requestTypes = ['Site Survey', 'Project Evaluation', 'Request for Quotation', 'Proposal Approval', 'Design and Estimates', 'Program of Works', 'Project Evaluation, Request for Quotation, Proposal Approval, Design and Estimates, Program of Works', 'Project Evaluation, Request for Quotation', 'Design and Estimates, Program of Works', 'Request for Quotation, Design and Estimates', 'Project Evaluation, Request for Quotation, Design and Estimates', 'Proposal Approval, Design and Estimates, Detailed Estimates of the Project', 'Request for Quotation, Design and Estimates, Product Presentation', 'Product Presentation', 'PVSYST Report', 'Electrical Diagram', 'Pricelist', 'Detailed Cost Estimates of the Project - total amount should match the selling price', 'Project Evaluation, Design and Estimates', 'Proposal Approval, Design and Estimates', 'Roofing Layout', 'Roofing Layout, Electrical Diagram', 'Schematic Diagram for Solar', 'Load Profiling', 'Data Sheet or Specification'];

  const typeOfClient = ['Private', 'Government'];

  // Fetch all requests when the component mounts
  useEffect(() => {
    fetchRequests();
    loadRequestsFromLocalStorage();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true); // Set loading state
      const response = await fetch('http://localhost:5000/api/requests');
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      const data = await response.json();
      setRequests(data); // Set fetched requests in the state
      saveRequestsToLocalStorage(data); // Save fetched requests to local storage
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      setError(error.message); // Set error if there's a problem with the fetch
      setLoading(false); // Stop loading on error
    }
  };

  const loadRequestsFromLocalStorage = () => {
    const storedRequests = JSON.parse(localStorage.getItem('requests')) || [];
    setRequests(storedRequests);
    setLoading(false); // Stop loading after loading from local storage
  };

  const saveRequestsToLocalStorage = (requestsToSave) => {
    localStorage.setItem('requests', JSON.stringify(requestsToSave));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle month change for filtering
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };
  

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
    return months[month] || '';
  };

  const filteredRequests = requests
  .filter((request) => {
    const requestDate = new Date(request.timestamp);
    const requestMonth = requestDate.getMonth() + 1;

    const selectedMonthNumber = getMonthNumber(selectedMonth);
    const matchesSearchQuery = filterName === '' || request.name === filterName;
    const matchesMonth = selectedMonth === '' || requestMonth === selectedMonthNumber;

    return matchesSearchQuery && matchesMonth;
  })
  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by timestamp in descending order

  // Calculate metrics for the selected user (filterName)
  const totalRequestsForUser = filteredRequests.length;
  const openRequestsForUser = filteredRequests.filter(req => req.status === 1).length;
  const closedRequestsForUser = filteredRequests.filter(req => req.status === 2).length;

  // Pagination logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  // Handle page changes
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!requestForm.email) newErrors.email = 'This is a required question';
    if (!requestForm.name) newErrors.name = 'Please select your name';
    if (!requestForm.typeOfClient) newErrors.typeOfClient = 'Please select the type of client';
    if (!requestForm.classification) newErrors.classification = 'Please select the classification';
    if (!requestForm.projectTitle) newErrors.projectTitle = 'Please enter the project title';
    if (!requestForm.philgepsReferenceNumber) newErrors.philgepsReferenceNumber = 'Please enter the Philgeps reference number or NA';
    if (!requestForm.productType) newErrors.productType = 'Please select the product type';
    if (!requestForm.requestType) newErrors.requestType = 'Please choose your request type';
    if (!requestForm.dateNeeded) newErrors.dateNeeded = 'Please select a date needed';
    if (!requestForm.specialInstructions) newErrors.specialInstructions = 'This is a required question';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
        try {
            // Step 1: Create the request first (without file data)
            const response = await fetch('http://localhost:5000/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestForm), // Pass only the form data without file-related fields
            });

            if (!response.ok) {
                throw new Error('Failed to create request');
            }

            const newRequest = await response.json(); // Get the newly created request

            // Step 2: Upload the file if a file is selected
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile); // Attach the selected file
                formData.append('requestId', newRequest._id); // Attach the newly created request ID

                const uploadResponse = await fetch('http://localhost:5000/api/requester/upload', {
                    method: 'POST',
                    body: formData, // Send the file and requestId as FormData
                });

                if (!uploadResponse.ok) {
                    throw new Error('File upload failed');
                }

                // Fetch the updated request data after file upload
                const updatedRequest = await uploadResponse.json();

                // Manually update the request in the state
                setRequests((prevRequests) =>
                    [updatedRequest, ...prevRequests] // Prepend the updated request to the top
                );
            } else {
                // No file upload, add the new request to the state
                setRequests((prevRequests) =>
                    [newRequest, ...prevRequests] // Prepend the new request to the top
                );
            }

            // Step 3: Sort requests by timestamp (descending) after adding
            setRequests((prevRequests) =>
                prevRequests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            );

            // Step 4: Save the updated requests to localStorage
            saveRequestsToLocalStorage([...requests, newRequest]);

            // Step 5: Reset the form after successful submission
            resetForm();
            setSelectedFile(null); // Clear selected file
            alert('Request submitted successfully.');
        } catch (error) {
            console.error('Error submitting the request:', error);
        }
    }
};
  const resetForm = () => {
    setRequestForm({
      email: '',
      name: '',
      typeOfClient: '',
      classification: '',
      projectTitle: '',
      philgepsReferenceNumber: '',
      productType: '',
      requestType: '',
      dateNeeded: '',
      specialInstructions: '',
      status: 0,
    });
    setSelectedFile(null); // Clear selected file
  };

  const handleRowClick = (request) => {
    setSelectedRequest(request); // Set the selected request to be shown in the modal
  };

  const closeModal = () => {
    setSelectedRequest(null); // Deselect the request
  };
  const closeModal1 = () => {
    setShowRequestForm(false); // Hide the form
    setSelectedRequest(null); // Deselect any selected request (if needed)
  };
  
  const downloadFile = async (fileUrl, fileName) => {
    try {
      const response = await fetch(`http://localhost:5000${fileUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf', // Adjust this according to your file type
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob(); // Get the response as a Blob
      const downloadUrl = window.URL.createObjectURL(blob); // Create a temporary URL

      // Create an anchor element to trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileName); // Set the download attribute with the file name
      document.body.appendChild(link);
      link.click(); // Programmatically click the link to download the file
      link.remove(); // Clean up the link

      window.URL.revokeObjectURL(downloadUrl); // Free up memory after download
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Show loading state
  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  // Show error state if there is any error
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`dashboard-container ${showRequestForm ? 'full-screen-form' : ''}`}>
      {!showRequestForm ? (
        <>
          <div className="sidebar3">
            
          </div>

          <div className="main-content">
            <div className="top-metrics">
              <div className="card">
                <FaUsers className="card-icon" />
                <h3>{totalRequestsForUser}</h3>
                <p>TOTAL REQUEST</p>
              </div>
              <div className="card">
                <FaShoppingCart className="card-icon" />
                <h3>{openRequestsForUser}</h3>
                <p>OPEN</p>
              </div>
              <div className="card">
                <FaBox className="card-icon" />
                <h3>{closedRequestsForUser}</h3>
                <p>CLOSED</p>
              </div>
            </div>
            <div className="table-container">
  <div className="table-header">
    <h3 className="table2">Requester Table</h3>
    <button className="create-request-btn1" onClick={() => setShowRequestForm(!showRequestForm)}>
    {showRequestForm ? 'Cancel Request' : 'Create New Request'}
  </button>
  </div>
  {/* Filters and Button Section */}
  <div className="table-header">
    <div className="filter-container">
      <select className="name-filter" value={filterName} onChange={(e) => setFilterName(e.target.value)}>
        <option value="">All Users</option>
        {names.map((name, index) => (
          <option key={index} value={name}>
            {name}
          </option>
        ))}
      </select>

      <select className="month-filter" value={selectedMonth} onChange={handleMonthChange}>
        <option value="">All Months</option>
        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
    </div>
    {/* Pagination Controls */}
    <div className="pagination-controls1">
    <button className="pagination-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
      &lt;
    </button>
    <span className="pagination-info">
      Page {currentPage} of {totalPages}
    </span>
    <button className="pagination-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
      &gt;
    </button>
  </div>
  </div>
  {/* Request Table */}
  <table className="request-table">
    <thead>
      <tr>
        <th>REQID</th>
        <th>Name</th>
        <th>TIMESTAMP</th>
        <th>PROJECT TITLE</th>
        <th>ASSIGNED TO</th>
        <th>STATUS</th>
        <th>DATE COMPLETED</th>
      </tr>
    </thead>
    <tbody>
      {currentRequests.map((request) => (
        <tr key={request._id} onClick={() => handleRowClick(request)}>
          <td>{request.referenceNumber}</td>
          <td>{request.name}</td>
          <td>{request.timestamp}</td>
          <td>{request.projectTitle}</td>
          <td>{request.assignedTo || 'Unassigned'}</td>
          <td>{request.status === 1 ? 'Ongoing' : request.status === 2 ? 'Complete' : 'Pending'}</td>
          <td>{request.status === 2 ? new Date(request.completedAt).toLocaleString() : 'N/A'}</td>

        </tr>
      ))}
    </tbody>
  </table>
</div>
            </div>
            {selectedRequest && (
              <div className="modal">
                <div className="modal-content">
                  <h3 className="modal-header">Request Details</h3>
                  <table className="modal-table">
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
                            <button onClick={() => downloadFile(selectedRequest.fileUrl, selectedRequest.fileName)}>
                              Download {selectedRequest.fileName || 'evaluator file'}
                            </button>
                          </td>
                        </tr>
                      )}
                      <tr>
                        <th>Status</th>
                        <td>{selectedRequest.status === 1 ? 'Ongoing' : selectedRequest.status === 2 ? 'Complete' : 'Pending'}</td>
                      </tr>
                      <tr>
                        <th>Date Completed</th> 
                        <td>{selectedRequest.status === 2 ? new Date(selectedRequest.completedAt).toLocaleString() : 'N/A'}</td>

                      </tr>
                    </tbody>
                  </table>
                  <button onClick={closeModal} className="close-modal-btn">Close</button>
                </div>
              </div>
            )}
          </>
        ) : (
        <section className="fullscreen-section">
  <div className="fullscreen-content">
  <button onClick={closeModal1} className="close-modal-btn">Close</button>

    <form onSubmit={handleSubmit} className="request-form">
      <div className="form-row">
        <div className="form-group">
          <label>Email <span className="required">*</span></label>
          <input
            type="email"
            name="email"
            value={requestForm.email}
            onChange={handleInputChange}
            placeholder="Your email"
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Your Name <span className="required">*</span></label>
          <select
            name="name"
            value={requestForm.name}
            onChange={handleInputChange}
            className={errors.name ? 'input-error' : ''}
          >
            <option value="">Select your name</option>
            {names.map((name, index) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>
      </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type of Client <span className="required">*</span></label>
                  <select
                    name="typeOfClient"
                    value={requestForm.typeOfClient}
                    onChange={handleInputChange}
                    className={errors.typeOfClient ? 'input-error' : ''}
                  >
                    <option value="">Select Type of Client</option>
                    {typeOfClient.map((clientType, index) => (
                      <option key={index} value={clientType}>
                        {clientType}
                      </option>
                    ))}
                  </select>
                  {errors.typeOfClient && <p className="error-text">{errors.typeOfClient}</p>}
                </div>

                <div className="form-group">
                  <label>Classification <span className="required">*</span></label>
                  <select
                    name="classification"
                    value={requestForm.classification}
                    onChange={handleInputChange}
                    className={errors.classification ? 'input-error' : ''}
                  >
                    <option value="">Select classification</option>
                    <option value="Negotiable">Negotiable</option>
                    <option value="Competitive">Competitive</option>
                  </select>
                  {errors.classification && <p className="error-text">{errors.classification}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Project Title or Client Name if private
                    <span className="required">*</span></label>
                  <input
                    type="text"
                    name="projectTitle"
                    value={requestForm.projectTitle}
                    onChange={handleInputChange}
                    placeholder="Project title"
                    className={errors.projectTitle ? 'input-error' : ''}
                  />
                  {errors.projectTitle && <p className="error-text">{errors.projectTitle}</p>}
                </div>

                <div className="form-group">
                  <label>Philgeps Reference Number <span className="required">*</span></label>
                  <input
                    type="text"
                    name="philgepsReferenceNumber"
                    value={requestForm.philgepsReferenceNumber}
                    onChange={handleInputChange}
                    placeholder="Philgeps reference number or NA"
                    className={errors.philgepsReferenceNumber ? 'input-error' : ''}
                  />
                  {errors.philgepsReferenceNumber && <p className="error-text">{errors.philgepsReferenceNumber}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Product Type <span className="required">*</span></label>
                  <select
                    name="productType"
                    value={requestForm.productType}
                    onChange={handleInputChange}
                    className={errors.productType ? 'input-error' : ''}
                  >
                    <option value="">Select product type</option>
                    {productTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.productType && <p className="error-text">{errors.productType}</p>}
                </div>

                <div className="form-group">
                  <label>Request Type <span className="required">*</span></label>
                  <select
                    name="requestType"
                    value={requestForm.requestType}
                    onChange={handleInputChange}
                    className={errors.requestType ? 'input-error' : ''}
                  >
                    <option value="">Select request type</option>
                    {requestTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.requestType && <p className="error-text">{errors.requestType}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date Needed <span className="required">*</span></label>
                  <input
                    type="date"
                    name="dateNeeded"
                    value={requestForm.dateNeeded}
                    onChange={handleInputChange}
                    className={errors.dateNeeded ? 'input-error' : ''}
                  />
                  {errors.dateNeeded && <p className="error-text">{errors.dateNeeded}</p>}
                </div>

                <div className="form-group">
                  <label>Special Instructions <span className="required">*</span></label>
                  <textarea
                    name="specialInstructions"
                    value={requestForm.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="Special instructions"
                    className={errors.specialInstructions ? 'input-error' : ''}
                  />
                  {errors.specialInstructions && <p className="error-text">{errors.specialInstructions}</p>}
                </div>
              </div>

              {/* File upload input */}
              <div className="form-row">
                <div className="form-group">
                  <label>Please upload useful files such as Drawing, Specs, Bid Docs, etc. (any files that would help in the assessment or any files related to the project)</label>
                  <input type="file" onChange={handleFileChange} />
                </div>
              </div>

              <button type="submit" className="submit-btn">Submit Request</button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}

export default RequesterDashboard;
