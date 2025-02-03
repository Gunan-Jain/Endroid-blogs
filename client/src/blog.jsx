import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminPage.css";
import ThemeToggle from "../Components/Theme";

const Blog = () => {
  const [pendingParagraphs, setPendingParagraphs] = useState([]);

 
  const fetchPendingParagraphs = async () => {
    try {
      const response = await axios.get("http://localhost:4010/paragraphs", {
        params: { status: "pending" },
      });
      setPendingParagraphs(response.data);
    } catch (error) {
      console.error("Error fetching pending paragraphs:", error);
    }
  };


  const approveParagraph = async (id) => {
    try {
      await axios.put(`http://localhost:4010/paragraphs/${id}/approve`);
      fetchPendingParagraphs();
    } catch (error) {
      console.error("Error approving paragraph:", error);
    }
  };

 
  const deleteParagraph = async (id) => {
    try {
      await axios.delete(`http://localhost:4010/paragraphs/${id}`);
      setPendingParagraphs(
        pendingParagraphs.filter((paragraph) => paragraph._id !== id)
      );
    } catch (error) {
      console.error("Error deleting paragraph:", error);
    }
  };

  useEffect(() => {
    fetchPendingParagraphs();
  }, []);

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
       
      </header>
      <main className="admin-content">
        <h2>Pending Paragraphs</h2>
        {pendingParagraphs.length > 0 ? (
          pendingParagraphs.map((paragraph) => (
            <div key={paragraph._id} className="paragraph-item">
              <p>{paragraph.content}</p>
              <button onClick={() => approveParagraph(paragraph._id)}>
                Approve
              </button>
              <button
                onClick={() => deleteParagraph(paragraph._id)}
                style={{
                  marginLeft: "10px",
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No pending paragraphs</p>
        )}
      </main>
    </div>
  );
};

export default Blog;
