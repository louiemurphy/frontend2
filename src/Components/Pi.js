import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './PiMonitoringForm.css';

const DEPARTMENTS = [
  'Purchasing',
  'Logistics',
  'Finance',
  'Operations',
  'Procurement',
  'Supply Chain',
  'Inventory Management',
  'Vendor Relations'
];

// FormField Component
const FormField = ({ label, type, name, required, options, placeholder }) => {
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <div className="relative">
            <select name={name} required={required} className="form-input">
              <option value="">{placeholder || 'Select an option'}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="chevron-icon" size={20} />
          </div>
        );
      case 'textarea':
        return <textarea name={name} required={required} className="form-input" rows={2} placeholder={placeholder} />;
      default:
        return <input type={type} name={name} required={required} className="form-input" placeholder={placeholder} />;
    }
  };

  return (
    <div className="form-field">
      <label className="form-label">
        {label}{required && <span className="required-marker">*</span>}
      </label>
      {renderInput()}
    </div>
  );
};

function PiMonitoringForm() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleForm = () => setShowForm(!showForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
  
    try {
      // Construct form data
      const formDataObject = {};
      const formElements = event.target.elements;
      
      for (let element of formElements) {
        if (element.name && element.type !== 'file') {
          formDataObject[element.name] = element.value;
        }
      }
  
      // DEBUGGING: Log the full URL and data
      const FULL_URL = 'http://193.203.162.228:5000/api/pi-monitoring';
      console.log('Full URL:', FULL_URL);
      console.log('Submitting data:', JSON.stringify(formDataObject, null, 2));
  
      const response = await fetch(FULL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataObject),
      });
  
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Full server response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Success:', result);
      alert('Form submitted successfully!');
  
      event.target.reset();
      setShowForm(false);
    } catch (error) {
      console.error('Detailed error:', error);
      alert(`Error submitting form: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fields for Deposit Title section
  const depositFields = [
    { 
      label: 'Supplier Info', 
      type: 'text', 
      name: 'supplierInfo', 
      required: true, 
      placeholder: 'Enter supplier info' 
    },
    { 
      label: 'Department', 
      type: 'select', 
      name: 'department', 
      options: DEPARTMENTS,
      required: true, 
      placeholder: 'Select department'
    },
    { 
      label: 'Project Name', 
      type: 'text', 
      name: 'projectName', 
      placeholder: 'Enter project name' 
    },
    { 
      label: 'Product Description', 
      type: 'text', 
      name: 'productDescription', 
      placeholder: 'Describe the product' 
    },
    { 
      label: 'NTP', 
      type: 'text', 
      name: 'ntp', 
      placeholder: 'Enter NTP details' 
    },
    { 
      label: 'CD', 
      type: 'text', 
      name: 'cd', 
      placeholder: 'Enter CD details' 
    },
    { 
      label: 'P.I', 
      type: 'text', 
      name: 'pi', 
      placeholder: 'Enter P.I details' 
    },
    { 
      label: 'Invoice Number', 
      type: 'text', 
      name: 'invoiceNumber', 
      required: true, 
      placeholder: 'Enter invoice number' 
    },
    { 
      label: 'Production Leadtime', 
      type: 'text', 
      name: 'productionLeadtime', 
      placeholder: 'Enter production leadtime' 
    },
    { 
      label: 'Total Amount', 
      type: 'number', 
      name: 'totalAmount', 
      required: true, 
      placeholder: 'Enter total amount' 
    },
    { 
      label: 'Amount', 
      type: 'number', 
      name: 'amount', 
      required: true, 
      placeholder: 'Enter amount' 
    },
    { 
      label: 'Bank', 
      type: 'text', 
      name: 'bank', 
      required: true, 
      placeholder: 'Enter bank name' 
    },
    { 
      label: 'Bank Slip', 
      type: 'text', 
      name: 'bankSlip', 
      required: true 
    },
    { 
      label: 'Acknowledgment of Supplier', 
      type: 'text', 
      name: 'acknowledgmentSupplier', 
      required: true 
    },
  ];

  // Fields for Balance Title section
  const balanceFields = [
    { label: 'Amount', type: 'number', name: 'balanceAmount', required: true, placeholder: 'Enter amount' },
    { label: 'Bank', type: 'text', name: 'balanceBank', required: true, placeholder: 'Enter bank name' },
    { label: 'Balance Bank Slip', type: 'text', name: 'balanceBankSlip', required: true },
    { 
      label: 'Acknowledgment of Supplier', 
      type: 'text', 
      name: 'balanceAcknowledgmentSupplier', 
      required: true
    },
    { label: 'Loading Date', type: 'date', name: 'loadingDate', placeholder: 'Select loading date' },
    { label: 'Container Type', type: 'text', name: 'containerType', placeholder: 'Enter container type' },
    { label: 'BL Number', type: 'text', name: 'blNumber', placeholder: 'Enter BL number' },
    { label: 'Departure Date', type: 'date', name: 'departureDate', placeholder: 'Select departure date' },
    { label: 'Date of Arrival', type: 'date', name: 'arrivalDate', placeholder: 'Select arrival date' },
    { label: 'Delivery Date at Warehouse', type: 'date', name: 'deliveryDate', placeholder: 'Select delivery date' },
    { 
      label: 'Photos of Unloading', 
      type: 'text', 
      name: 'photosUnloading', 
      placeholder: 'Enter photo URLs or descriptions' 
    },
  ];

  return (
    <div className="form-container">
      {/* Create New PI Entry Button */}
      {!showForm && (
        <div className="button-container1">
          <button onClick={toggleForm} className="toggle-button1">
            Create New PI Entry
          </button>
        </div>
      )}

      {/* Close Form Button */}
      {showForm && (
        <div className="button-container3">
          <button onClick={toggleForm} className="toggle-button3">
            Close
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="form">
          <div className="form-section">
            <h2 className="form-section-title">Deposit</h2>
            <div className="form-grid">
              {depositFields.map((field) => (
                <FormField key={field.name} {...field} />
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">Balance</h2>
            <div className="form-grid">
              {balanceFields.map((field) => (
                <FormField key={field.name} {...field} />
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      )}
    </div>
  );
}

export default PiMonitoringForm;
