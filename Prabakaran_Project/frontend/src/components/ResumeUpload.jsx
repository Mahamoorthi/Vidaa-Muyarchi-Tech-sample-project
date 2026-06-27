import { useState } from "react";
import api from "../services/api";

function ResumeUpload({ refreshCandidates }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message);
      setFile(null);

      if (refreshCandidates) {
        refreshCandidates();
      }
    } catch (error) {
      console.error(error);
      setMessage("Upload Failed");
    }
  };

  return (
    <div className="card mb-4 shadow">
      <div className="card-body">
        <h3>Upload Resume</h3>

        <form onSubmit={handleUpload}>
          <input
            type="file"
            className="form-control mb-3"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="btn btn-primary">
            Upload Resume
          </button>
        </form>

        {message && (
          <div className="alert alert-success mt-3">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeUpload;