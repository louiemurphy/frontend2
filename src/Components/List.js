import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Using axios for HTTP requests
import moment from 'moment'; // To format timestamps
import './List.css'; // Import your styles

function List() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch supplier data when the component mounts
  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true); // Set loading to true
      try {
        const response = await axios.get('https://backend2-production-2011.up.railway.app/api/suppliers');
        
        // Log to debug and inspect the structure of the data
        console.log(response.data); // This will help you check if contactPerson exists
        
        // Format timestamps for display and sort by timestamp (newest first)
        const formattedData = response.data
          .map((supplier) => ({
            ...supplier,
            timestamp: moment(supplier.timestamp).local().format('MM/DD/YYYY, h:mm:ss A'), // Format timestamp
          }))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort in descending order by timestamp
        
        setSuppliers(formattedData); // Set suppliers data
      } catch (err) {
        setError('Failed to load suppliers data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers(); // Trigger data fetch when component mounts
  }, []);

  // Columns definition with actual field names
  const columns = [
    { label: 'Timestamp', field: 'timestamp' },
    { label: 'Email Address', field: 'email' },
    { label: 'Category', field: 'category' },
    { label: 'Classification', field: 'classification' },
    { label: 'Company Name', field: 'companyName' },
    { label: 'Address', field: 'address' },
    { label: 'Location', field: 'location' },
    { label: 'Contact Person', field: 'contactPerson' },
    { label: 'Contact Number', field: 'contactNumber' },
    { label: 'Website', field: 'website' },
  ];

  // Render loading, error, or the table with supplier data
  if (loading) {
    return <div className="loading-message">Loading suppliers...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="supplier-list-fullscreen">
      <div className="supplier-list-page">
        <h2 className="supplier-list-title">Supplier Master List</h2>

        <div className="supplier-table-wrapper">
          <div className="supplier-table">
            {/* Render table headers dynamically */}
            <div className="supplier-table-header">
              {columns.map((column, index) => (
                <div key={index} className="supplier-table-header-cell">
                  {column.label}
                </div>
              ))}
            </div>

            {/* Render supplier data */}
            <div className="supplier-table-body">
              {suppliers.length > 0 ? (
                suppliers.map((supplier, index) => (
                  <div key={index} className="supplier-table-row">
                    {columns.map((column, colIndex) => (
                      <div key={colIndex} className="supplier-table-cell">
                        {/* Check if the field value exists, else show 'N/A' */}
                        {supplier[column.field] ? supplier[column.field] : 'N/A'}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="supplier-table-row">
                  <div className="supplier-table-cell" colSpan={columns.length}>
                    No suppliers available.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default List;
