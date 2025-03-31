import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ComplaintSubmissionForm from '../components/ComplaintSubmissionForm';

const ComplaintPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    timeFrame: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch complaints on mount and when filters change
  useEffect(() => {
    fetchComplaints();
  }, [filters, sortBy]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/complaints/all', {
        headers: { Authorization: `Bearer ${user.token}` },
        params: {
          status: filters.status,
          category: filters.category,
          timeFrame: filters.timeFrame,
          sort: sortBy
        }
      });
      setComplaints(response.data);
    } catch (error) {
      toast.error('Failed to fetch complaints');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter complaints based on search query
  const filteredComplaints = complaints.filter(complaint => 
    complaint.complaintText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.complaintNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const handleComplaintSubmitted = (newComplaint) => {
    // Refresh complaints list
    fetchComplaints();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Complaint Submission Form */}
      <ComplaintSubmissionForm onComplaintSubmitted={handleComplaintSubmitted} />

      {/* Filters and Search Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">All Complaints</h2>
          
          <div className="flex flex-wrap gap-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="Academic">Academic</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Hostel">Hostel</option>
              <option value="Mess">Mess</option>
              <option value="Other">Other</option>
            </select>

            {/* Time Frame Filter */}
            <select
              value={filters.timeFrame}
              onChange={(e) => setFilters(prev => ({ ...prev, timeFrame: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        {/* Complaints List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No complaints found matching your criteria
          </div>
        ) : (
          <div className="space-y-6">
            {filteredComplaints.map((complaint) => (
              <div 
                key={complaint._id} 
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Complaint Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gray-900">
                        {complaint.isAnonymous ? 'Anonymous' : complaint.username}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-500">
                        {new Date(complaint.timestamp).toLocaleString()}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className={`px-2 py-1 rounded-full text-sm ${getStatusBadgeStyle(complaint.status)}`}>
                        {complaint.status}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        #{complaint.complaintNo}
                      </span>
                    </div>

                    {/* Complaint Category */}
                    <div className="mb-2">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                        {complaint.category}
                      </span>
                    </div>

                    {/* Complaint Text */}
                    <p className="text-gray-700 mb-4">{complaint.complaintText}</p>

                    {/* Attachments */}
                    {complaint.attachments && complaint.attachments.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments:</h4>
                        <div className="flex gap-2">
                          {complaint.attachments.map((attachment, index) => (
                            <a
                              key={index}
                              href={attachment.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                              {attachment.fileName}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Responses */}
                    {complaint.responses && complaint.responses.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Responses ({complaint.responses.length}):
                        </h4>
                        {complaint.responses.map((response, index) => (
                          <div key={index} className="mb-3">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-gray-900">
                                {response.responderName}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500">
                                {new Date(response.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-700 mt-1">{response.responseText}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination (if needed) */}
        {filteredComplaints.length > 0 && (
          <div className="mt-6 flex justify-center">
            {/* Add pagination component here if needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintPage; 