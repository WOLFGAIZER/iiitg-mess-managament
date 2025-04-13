import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComplaintPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [complaintText, setComplaintText] = useState('');
  const [image, setImage] = useState(null);
  const [priority, setPriority] = useState('Medium');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const backendURL = 'http://localhost:5000'; // Update if hosted elsewhere

  // Fetch complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/complaints`);
        console.log('✅ Fetched complaints:', res.data.complaints);
        setComplaints(res.data.complaints);
      } catch (err) {
        console.error('❌ Error fetching complaints:', err);
      }
    };

    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Submit complaint
      const res = await axios.post(`${backendURL}/api/complaints/create`, {
        userID: 'mock-user-id',
        tokenID: 'mock-token-id',
        complaintText,
        priority,
        isAnonymous,
      });

      const { complaintNo } = res.data.complaint;

      // Step 2: Upload image
      if (image) {
        const formData = new FormData();
        formData.append('complaintImage', image);
        formData.append('complaintNo', complaintNo);

        await axios.post(`${backendURL}/api/complaints/upload-image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // Reset form
      setComplaintText('');
      setImage(null);
      setPriority('Medium');
      setIsAnonymous(false);

      // Refetch complaints
      const updated = await axios.get(`${backendURL}/api/complaints`);
      setComplaints(updated.data.complaints);
    } catch (err) {
      console.error('❌ Error submitting complaint:', err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
        IIITG Mess Feedback & Complaints
      </h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow mb-8">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Complaint</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
            required
            minLength={10}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="mb-4 flex items-center gap-4">
          <label className="font-semibold">Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>

          <label className="flex items-center gap-2 ml-6">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            Submit as Anonymous
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Submit Complaint
        </button>
      </form>

      {/* 🧾 Complaint Table */}
      <div className="overflow-x-auto">
        {complaints?.length > 0 ? (
          <table className="w-full border border-collapse text-sm text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">User / Complaint No</th>
                <th className="border p-2">Complaint</th>
                <th className="border p-2">Image</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, i) => (
                <tr key={i}>
                  <td className="border p-2">
                    {c.isAnonymous ? 'Anonymous' : c.userID}
                    <br />
                    {c.complaintNo}
                  </td>
                  <td className="border p-2">{c.complaintText}</td>
                  <td className="border p-2">
                    {c.imageAttachments?.length > 0 ? (
                      <img
                        src={`${backendURL}/${c.imageAttachments[0].fileUrl}`}
                        alt="attachment"
                        className="h-16 object-cover mx-auto"
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td className="border p-2">
                    {new Date(c.timestamp).toLocaleDateString()}
                  </td>
                  <td className="border p-2">{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 mt-6">No complaints to display.</p>
        )}
      </div>
    </div>
  );
};

export default ComplaintPage;
