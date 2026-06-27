import { useEffect, useState } from "react";
import api from "./services/api";
import ResumeUpload from "./components/ResumeUpload";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await api.get("/candidates");
      console.log("API Response:", response.data);
      setCandidates(response.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-primary mb-4">
        AI Resume Screening Dashboard
      </h1>

      {/* Resume Upload */}
      <ResumeUpload refreshCandidates={fetchCandidates} />

      {/* Total Candidates */}
      <div className="alert alert-primary text-center mt-4">
        <h4>Total Candidates: {candidates.length}</h4>
      </div>

      {/* Candidate Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>ATS Score</th>
              <th>Skills</th>
            </tr>
          </thead>

          <tbody>
            {candidates.length > 0 ? (
              candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.id}</td>
                  <td>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone}</td>
                  <td>
                    <span className="badge bg-success">
                      {candidate.ats_score}
                    </span>
                  </td>
                  <td>
                    {candidate.skills.join(", ")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No candidates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;