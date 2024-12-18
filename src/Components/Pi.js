import React, { useState } from 'react';
import { ChevronDown, Upload } from 'lucide-react';
import './PiMonitoringForm.css';

const DEPARTMENTS = [
  'Isd',
  'Warehouse',
  'Finance',
  'Operations',
  'logistics',
];

// FormField Component
const FormField = ({ label, type, name, options, placeholder, fileType, onFileChange }) => {
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <div className="relative">
            <select name={name}  className="form-input">
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
        return <textarea name={name}  className="form-input" rows={2} placeholder={placeholder} />;
      case 'file':
        return (
          <div className="file-input-wrapper">
            <input 
              type="file" 
              name={name} 
               
              className="file-input" 
              accept={fileType || '*'}
              onChange={onFileChange}
            />
            
          </div>
        );
      default:
        return <input type={type} name={name}  className="form-input" placeholder={placeholder} />;
    }
  };

  return (
    <div className="form-field">
      <label className="form-label">
        {label}
      </label>
      {renderInput()}
    </div>
  );
};

function PiMonitoringForm() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState({
    bankSlip: null,
    acknowledgmentSupplier: null,
    balanceBankSlip: null,
    balanceAcknowledgmentSupplier: null
  });

  const toggleForm = () => setShowForm(!showForm);

  const handleFileChange = (name) => (event) => {
    setFiles(prevFiles => ({
      ...prevFiles,
      [name]: event.target.files[0]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
  
    try {
      const formData = new FormData();
      
      // Collect form elements
      const formElements = event.target.elements;
      for (let element of formElements) {
        if (element.name) {
          // Add ALL form fields, even if they're empty
          // This allows partial submissions
          if (element.type !== 'file') {
            formData.append(element.name, element.value || '');
          }
        }
      }
  
      // Add file fields
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });
  
      const FULL_URL = 'http://localhost:5000/api/pi-monitoring';
      const response = await fetch(FULL_URL, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Full server response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Success:', result);
      alert('Form submitted successfully, even with partial data!');
  
      event.target.reset();
      setFiles({
        bankSlip: null,
        acknowledgmentSupplier: null,
        balanceBankSlip: null,
        balanceAcknowledgmentSupplier: null
      });
      setShowForm(false);
    } catch (error) {
      console.error('Detailed error:', error);
      alert(`Error submitting form: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update fields to include file upload for specific fields
  const depositFields = [
    { 
      label: 'Supplier Info', 
      type: 'text', 
      name: 'supplierInfo', 
      placeholder: 'Enter supplier info' 
    },
    { 
      label: 'Department', 
      type: 'select', 
      name: 'department', 
      options: DEPARTMENTS,
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
      placeholder: 'Enter total amount' 
    },
    { 
      label: 'Amount', 
      type: 'number', 
      name: 'amount',  
      placeholder: 'Enter amount' 
    },
    { 
      label: 'Bank', 
      type: 'text', 
      name: 'bank', 
      placeholder: 'Enter bank name' 
    },
    { 
      label: 'Bank Slip', 
      type: 'file', 
      name: 'bankSlip', 
      placeholder: 'Upload bank slip',
      fileType: '.pdf,.jpg,.jpeg,.png',
      onFileChange: handleFileChange('bankSlip')
    },
    { 
      label: 'Acknowledgment of Supplier', 
      type: 'file', 
      name: 'acknowledgmentSupplier', 
      placeholder: 'Upload supplier acknowledgment',
      fileType: '.pdf,.jpg,.jpeg,.png',
      onFileChange: handleFileChange('acknowledgmentSupplier')
    },
  ];

  // Fields for Balance Title section
  const balanceFields = [
    { label: 'Amount', type: 'number', name: 'balanceAmount',  placeholder: 'Enter amount' },
    { label: 'Bank', type: 'text', name: 'balanceBank',  placeholder: 'Enter bank name' },
    { 
      label: 'Balance Bank Slip', 
      type: 'file', 
      name: 'balanceBankSlip', 
      placeholder: 'Upload balance bank slip',
      fileType: '.pdf,.jpg,.jpeg,.png',
      onFileChange: handleFileChange('balanceBankSlip')
    },
    { 
      label: 'Acknowledgment of Supplier', 
      type: 'file', 
      name: 'balanceAcknowledgmentSupplier', 
      placeholder: 'Upload balance supplier acknowledgment',
      fileType: '.pdf,.jpg,.jpeg,.png',
      onFileChange: handleFileChange('balanceAcknowledgmentSupplier')
    },
    { label: 'Loading Date', type: 'date', name: 'loadingDate', placeholder: 'Select loading date' },
    { label: 'Container Type', type: 'text', name: 'containerType', placeholder: 'Enter container type' },
    { label: 'BL Number', type: 'text', name: 'blNumber', placeholder: 'Enter BL number' },
    { label: 'Departure Date', type: 'date', name: 'departureDate', placeholder: 'Select departure date' },
    { label: 'Date of Arrival', type: 'date', name: 'arrivalDate', placeholder: 'Select arrival date' },
    { label: 'Delivery Date at Warehouse', type: 'date', name: 'deliveryDate', placeholder: 'Select delivery date' },


    {
      label: 'Photos of Unloading',
      type: 'file',
      name: 'photosUnloading',
      placeholder: 'Enter photo URLs or descriptions', // Missing comma added here
      fileType: '.pdf,.jpg,.jpeg,.png',
      onFileChange: handleFileChange('photosUnloading')
    }    
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