import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ComplaintSubmissionForm = ({ onComplaintSubmitted }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    complaintText: '',
    category: 'Academic',
    priority: 'Medium',
    isAnonymous: false,
    attachment: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 1000;

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        attachment: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    if (name === 'complaintText') {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!formData.complaintText.trim()) {
      toast.error('Please enter your complaint');
      return;
    }

    if (formData.complaintText.length > MAX_CHARS) {
      toast.error(`Complaint text cannot exceed ${MAX_CHARS} characters`);
      return;
    }

    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('complaintText', formData.complaintText.trim());
      formPayload.append('category', formData.category);
      formPayload.append('priority', formData.priority);
      formPayload.append('isAnonymous', formData.isAnonymous);
      
      if (formData.attachment) {
        formPayload.append('attachment', formData.attachment);
      }

      const response = await axios.post('/api/complaints/submit', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      });

      toast.success('Complaint submitted successfully');
      
      // Reset form
      setFormData({
        complaintText: '',
        category: 'Academic',
        priority: 'Medium',
        isAnonymous: false,
        attachment: null
      });
      setCharCount(0);

      // Notify parent component
      if (onComplaintSubmitted) {
        onComplaintSubmitted(response.data);
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit complaint';
      toast.error(errorMessage);
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Submit a Complaint</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="Academic">Academic</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Hostel">Hostel</option>
            <option value="Mess">Mess</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Priority Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        {/* Complaint Text Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Complaint
          </label>
          <textarea
            name="complaintText"
            value={formData.complaintText}
            onChange={handleInputChange}
            rows={4}
            placeholder="Please describe your complaint in detail..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 
              ${charCount > MAX_CHARS 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-indigo-500'}`}
          />
          <div className="flex justify-between text-sm mt-1">
            <span className={`${charCount > MAX_CHARS ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount}/{MAX_CHARS} characters
            </span>
          </div>
        </div>

        {/* File Attachment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Attachment (optional)
          </label>
          <input
            type="file"
            name="attachment"
            onChange={handleInputChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
              file:rounded-md file:border-0 file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: PDF, DOC, DOCX, JPG, PNG (max 5MB)
          </p>
        </div>

        {/* Anonymous Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isAnonymous"
            id="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isAnonymous" className="ml-2 text-sm text-gray-600">
            Submit Anonymously
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || charCount > MAX_CHARS}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${isSubmitting || charCount > MAX_CHARS
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'} 
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Complaint'
          )}
        </button>
      </form>
    </div>
  );
};

export default ComplaintSubmissionForm; 