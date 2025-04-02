import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Voting = () => {
  const { api } = useAuth();
  const [electionId, setElectionId] = useState("");
  const [candidate, setCandidate] = useState("");
  const [message, setMessage] = useState("");

  const handleVote = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/voting/", { electionId, candidate });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error casting vote");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Voting</h1>
      <form onSubmit={handleVote} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label>Election ID</label>
          <input
            type="text"
            value={electionId}
            onChange={(e) => setElectionId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label>Candidate</label>
          <input
            type="text"
            value={candidate}
            onChange={(e) => setCandidate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-red-500 text-white p-2 rounded">Cast Vote</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Voting;