import React, { useState, useEffect } from 'react';
import './Supplier.css'; // Ensure custom styles for dropdown
import axios from 'axios'; // For sending requests to your backend
import moment from 'moment'; // Import moment for date formatting

function Supplier() {
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [newSuppliers, setNewSuppliers] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [suppliersData, setSuppliersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const suppliersPerPage = 6; // Change this to the number of suppliers you want to display per page

    useEffect(() => {
      const fetchSuppliers = async () => {
        setLoading(true);
        try {
          const response = await axios.get('https://backend2-production-2011.up.railway.app/api/suppliers');
          const formattedData = response.data.map((supplier) => ({
            ...supplier,
            timestamp: moment(supplier.timestamp).local().format('MM/DD/YYYY, h:mm:ss A'),
          }));
    
          // Sort suppliers by timestamp in descending order (newest first)
          formattedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
          setSuppliersData(formattedData);
          setTotalSuppliers(formattedData.length);
          setNewSuppliers(formattedData.filter(supplier => new Date(supplier.timestamp) > Date.now() - 30 * 24 * 60 * 60 * 1000).length);
        } catch (error) {
          console.error('Error fetching suppliers:', error);
          setError('Failed to load suppliers data.');
        } finally {
          setLoading(false);
        }
      };
    
      fetchSuppliers();
    }, []);
     

  const handleCreateClick = () => {
    setIsFormVisible(true);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.target);
    const newSupplier = {
      timestamp: new Date().toISOString(),
      email: formData.get('email'),
      category: formData.get('category'),
      classification: formData.get('classification'),
      companyName: formData.get('companyName'),
      address: formData.get('address'),
      location: formData.get('location'),
      account: formData.get('account'),
      contactPerson: formData.get('contactPerson'),
      contactNumber: formData.get('contactNumber'),
      contactEmail: formData.get('contactEmail'),
      website: formData.get('website') || '',
    };

    setLoading(true);

    try {
      const response = await axios.post('https://backend2-production-2011.up.railway.app/api/suppliers', newSupplier);
      const formattedSupplier = {
        ...response.data,
        timestamp: moment(response.data.timestamp).local().format('MM/DD/YYYY, h:mm:ss A'),
      };

      setSuppliersData((prevSuppliers) => [...prevSuppliers, formattedSupplier]);
      setTotalSuppliers((prevTotal) => prevTotal + 1);
      setNewSuppliers((prevNew) => prevNew + 1);
      setIsFormVisible(false);

      event.target.reset();
    } catch (error) {
      console.error('Error submitting supplier:', error);
      setError('Failed to create supplier. Please try again.');
    } finally {
      setLoading(false);
    }
  };
    // Get the suppliers for the current page
    const indexOfLastSupplier = currentPage * suppliersPerPage;
    const indexOfFirstSupplier = indexOfLastSupplier - suppliersPerPage;
    const currentSuppliers = suppliersData.slice(indexOfFirstSupplier, indexOfLastSupplier);
  
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="supplier-master-list-wrapper1">
      <div className="supplier-sidebar1"></div>
      <div className="supplier-content1">
        <div className="supplier-dashboard-summary1">
          <div className="supplier-dashboard-box1">
            <h3>Total Suppliers</h3>
            <p>{totalSuppliers}</p>
          </div>
          <div className="supplier-dashboard-box1">
            <h3>New Suppliers</h3>
            <p>{newSuppliers}</p>
          </div>
        </div>

        <div className="supplier-table-container1">
          <div className="supplier-list-header1">
            <h2>SUPPLIER MASTER LIST</h2>
            <button className="supplier-create-button1" onClick={handleCreateClick}>
              Create New Supplier
            </button>
          </div>
          <div className="pagination-wrapper">
  <div className="pagination">
    <button
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
    >
      &lt;
    </button>
    <span className="pagination-info">
      Page {currentPage} of {Math.ceil(totalSuppliers / suppliersPerPage)}
    </span>
    <button
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === Math.ceil(totalSuppliers / suppliersPerPage)}
    >
      &gt;
    </button>
  </div>
</div>

          

{loading ? (
  <p>Loading suppliers...</p>
) : error ? (
  <p className="supplier-error-message1">{error}</p>
) : (
  <div className="supplier-table1">
    <div className="supplier-table-header1">
      <div>Timestamp</div>
      <div>Email Address</div>
      <div>Category</div>
      <div>Location</div>
    </div>
    {currentSuppliers.map((supplier, index) => (
      <div key={index} className="supplier-table-row1">
        <div>{supplier.timestamp}</div>
        <div>{supplier.email}</div>
        <div>{supplier.category}</div>
        <div>{supplier.location}</div>
      </div>
    ))}
  </div>
)}

        </div>

        {isFormVisible && (
          <div className="supplier-form-modal1">
            <div className="supplier-form-modal-content1">
              <h3>Create New Supplier</h3>
              <form onSubmit={handleFormSubmit}>
                <div className="supplier-form-grid1">
                  <div className="supplier-form-group1">
                    <label>Email:</label>
                    <input type="email" name="email" required />
                  </div>
                  <div className="supplier-form-group1">
                  <div className="supplier-form-group1">
                    <label>Classification:</label>
                    <select name="classification" required>
                      <option value="">Select Classification</option>
                      <option value="Import">Import</option>
                      <option value="Local">Local</option>
                    </select>
                  </div>
                  </div>
                  <div className="supplier-form-group1">
                  <label>Category:</label>
                    <select name="category" required>
    <option value="">Select Category</option>
    <option value="Solar Panels">Solar Panels</option>
    <option value="Inverters">Inverters</option>
    <option value="Mounting Structures">Mounting Structures</option>
    <option value="Batteries">Batteries</option>
    <option value="Solar Cables">Solar Cables</option>
    <option value="AC Cables">AC Cables</option>
    <option value="Circuit Breakers">Circuit Breakers</option>
    <option value="Distribution Boxes">Distribution Boxes</option>
    <option value="Diesel Generator">Diesel Generator</option>
    <option value="Transformer">Transformer</option>
    <option value="Trader - Multiple Solar Products">Trader - Multiple Solar Products</option>
    <option value="Trader - Multiple Electrical Products">Trader - Multiple Electrical Products</option>
    <option value="3D Printer">3D Printer</option>
    <option value="Silo">Silo</option>
    <option value="Air Purifier">Air Purifier</option>
    <option value="Automatic Gate Opener">Automatic Gate Opener</option>
    <option value="Drilling Machine">Drilling Machine</option>
    <option value="Garage & Door Remote Controller">Garage & Door Remote Controller</option>
    <option value="Dam Easy Door Barrier">Dam Easy Door Barrier</option>
    <option value="Home Alarm Systems">Home Alarm Systems</option>
    <option value="Power Bank">Power Bank</option>
    <option value="Smart Devices">Smart Devices</option>
    <option value="Fire Alarm System">Fire Alarm System</option>
    <option value="Portable Hand Wash Station">Portable Hand Wash Station</option>
    <option value="USB">USB</option>
    <option value="Pool LED Light">Pool LED Light</option>
    <option value="LED Lights">LED Lights</option>
    <option value="USB Flash Drive, Phone Charger Cable, Wireless Charger, Earbuds, Drinkware, Cultery">USB Flash Drive, Phone Charger Cable, Wireless Charger, Earbuds, Drinkware, Cultery</option>
    <option value="Weather Station, Wind Speed Sensor, Wind Direction Sensor, Air Temperature Humidity Sensor, Solar Radiation Sensor, Liquid Sensor, Soil Sensor, Water Quality Sensor">Weather Station, Wind Speed Sensor, Wind Direction Sensor, Air Temperature Humidity Sensor, Solar Radiation Sensor, Liquid Sensor, Soil Sensor, Water Quality Sensor</option>
    <option value="Vacuum Cleaner">Vacuum Cleaner</option>
    <option value="Coxial Cable, LAN Cable, CCTV Cable (Siamese cable), Security Cable, Alarm Cable, Fire Alarm Cable, Telephone Cable, Speaker Cable, Combo Cable, Control Cable">Coxial Cable, LAN Cable, CCTV Cable (Siamese cable), Security Cable, Alarm Cable, Fire Alarm Cable, Telephone Cable, Speaker Cable, Combo Cable, Control Cable</option>
    <option value="DTH Drilling rig, Water well Drilling rig, Drilling Bits, Drilling Rod, Mud Pump, Screw Air Compressor, Air Compressor for drilling rig, Mining Air Compressor, Piston Air Compressor, Oil Free Air Compressor">DTH Drilling rig, Water well Drilling rig, Drilling Bits, Drilling Rod, Mud Pump, Screw Air Compressor, Air Compressor for drilling rig, Mining Air Compressor, Piston Air Compressor, Oil Free Air Compressor</option>
    <option value="Handheld Megaphone, Drone Megaphone, IR Extender, Aroma Diffuser">Handheld Megaphone, Drone Megaphone, IR Extender, Aroma Diffuser</option>
    <option value="UVC Devices">UVC Devices</option>
    <option value="Smart Data Logger">Smart Data Logger</option>
    <option value="Solar Freezer">Solar Freezer</option>
    <option value="ICT Products">ICT Products</option>
    <option value="Digital Door Lock">Digital Door Lock</option>
    <option value="Festoon light (Decorative Lights)">Festoon light (Decorative Lights)</option>
    <option value="Foldable Container House, Portable Container Toilet">Foldable Container House, Portable Container Toilet</option>
    <option value="UTP Cables and others">UTP Cables and others</option>
    <option value="Warehouse Racks">Warehouse Racks</option>
    <option value="Metal Drilling Machine">Metal Drilling Machine</option>
    <option value="Steel Pool">Steel Pool</option>
    <option value="Wires (THHN)">Wires (THHN)</option>
    <option value="AVR">AVR</option>
    <option value="Terminal Lugs">Terminal Lugs</option>
    <option value="Steel Pipes">Steel Pipes</option>
    <option value="HDPE Pipes">HDPE Pipes</option>
    <option value="Wide Flange">Wide Flange</option>
    <option value="Laptop">Laptop</option>
    <option value="Transformer, Steel Poles, Diesel Generator, Wires (THHN),  AVR, Solar Streetlights, Circuit Breaker, Terminal Lugs, Lead Acid Battery">Transformer, Steel Poles, Diesel Generator, Wires (THHN), AVR, Solar Streetlights, Circuit Breaker, Terminal Lugs, Lead Acid Battery</option>
    <option value="Transformer, Diesel Generator, Wires (THHN), AVR, Solar Streetlights, Circuit Breaker, Lead Acid Battery">Transformer, Diesel Generator, Wires (THHN), AVR, Solar Streetlights, Circuit Breaker, Lead Acid Battery</option>
    <option value="Transformer, Steel Poles, Diesel Generator, Wires (THHN), Circuit Breaker, Terminal Lugs">Transformer, Steel Poles, Diesel Generator, Wires (THHN), Circuit Breaker, Terminal Lugs</option>
    <option value="AVR, Circuit Breaker">AVR, Circuit Breaker</option>
    <option value="Transformer, Steel Poles, Diesel Generator, Wires (THHN), Laptop, AVR, Solar Streetlights, Circuit Breaker, Terminal Lugs, Lead Acid Battery">Transformer, Steel Poles, Diesel Generator, Wires (THHN), Laptop, AVR, Solar Streetlights, Circuit Breaker, Terminal Lugs, Lead Acid Battery</option>
    <option value="Sugarcane Machine">Sugarcane Machine</option>
    <option value="Coxial Cable, UTP Cable, Fiber Optic Cable, Alarm Cable">Coxial Cable, UTP Cable, Fiber Optic Cable, Alarm Cable</option>
    <option value="Metal Cutting Machine">Metal Cutting Machine</option>
    <option value="Water Pump">Water Pump</option>
    <option value="LED Display">LED Display</option>
    <option value="SMART LED Bulb">SMART LED Bulb</option>
    <option value="SMART Plug">SMART Plug</option>
    <option value="Mobile Trailer">Mobile Trailer</option>
    <option value="Trucks and Equipment">Trucks and Equipment</option>
    <option value="Steel Structure">Steel Structure</option>
    <option value="Biogas">Biogas</option>
    <option value="Floating Solar">Floating Solar</option>
    <option value="Hydroponics">Hydroponics</option>
    <option value="Electric Vehicle">Electric Vehicle</option>
</select>
                  </div>
                  <div className="supplier-form-group1">
                    <label>Name of the Company:</label>
                    <input type="text" name="companyName" required />
                  </div>
                  <div className="supplier-form-group1">
                    <label>Contact Person:</label>
                    <input type="text" name="contactPerson" required />
                  </div>
                  <div className="supplier-form-group1">
                    <label>Address:</label>
                    <textarea name="address" required></textarea>
                  </div>
                  <div className="supplier-form-group1">
                    <label>Location:</label>
                    <select name="location" required>
                      <option value="">Select Location</option>
                      <option value="Luzon">Luzon</option>
                      <option value="Visayas">Visayas</option>
                      <option value="Mindanao">Mindanao</option>
                      <option value="China">China</option>
                      <option value="China">Taiwan</option>
                      <option value="China">India</option>
                      <option value="China">U.S</option>
                      <option value="China">Hongkong</option>
                      <option value="China">South Korea</option>
                      {/* Add more locations */}
                    </select>
                  </div>
                  <div className="supplier-form-group1">
                    <label>Account:</label>
                    <select name="account" required>
                      <option value="">Select Account</option>
                      <option value="Wechat">Wechat</option>
                      <option value="Whatsapp">Whatsapp</option>
                      <option value="Messenger">Messenger</option>
                      <option value="Viber">Viber</option>
                      <option value="Cellphone">Cellphone</option>
                      <option value="Telegram">Telegram</option>
                      <option value="Skype">Skype</option>
                      {/* Add more account types */}
                    </select>
                  </div>
                  <div className="supplier-form-group1">
                    <label>Contact Number:</label>
                    <input type="text" name="contactNumber" required />
                  </div>
                  <div className="supplier-form-group1">
                    <label>Contact Email:</label>
                    <input type="email" name="contactEmail" required />
                  </div>
                  <div className="supplier-form-group1">
                    <label>Website:</label>
                    <input type="url" name="website" />
                  </div>
                  <div className="supplier-form-buttons1">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={handleFormClose}>
                      Close
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Supplier;
