import React, { useState, useEffect } from "react";
import "../styles/AdminPage.css";
import "./Dashboard.css";
import Widget from "../Components/widget";
import BlogManager from "../Components/BlogManager";
import VideoManager from "../Components/VideoManager";
import ThemeToggle from "../Components/Theme";
import { useNavigate } from "react-router-dom";

import axios from "axios";

function Dashboard() {
  const [approvedParagraphs, setApprovedParagraphs] = useState([]);
  const [totalParagraphs, setTotalParagraphs] = useState(0);
  const navigate = useNavigate();

  // Fetch approved paragraphs
  const fetchApprovedParagraphs = async () => {
    try {
      const response = await axios.get("http://localhost:4010/paragraphs", {
        params: { status: "approved" },
      });
      setApprovedParagraphs(response.data);
    } catch (error) {
      console.error("Error fetching approved paragraphs:", error);
    }
  };

  // Fetch total paragraphs
  const fetchTotalParagraphs = async () => {
    try {
      const response = await axios.get("http://localhost:4010/paragraphs");
      setTotalParagraphs(response.data.length);
    } catch (error) {
      console.error("Error fetching total paragraphs:", error);
    }
  };

  useEffect(() => {
    fetchApprovedParagraphs();
    fetchTotalParagraphs();
  }, []);

  const progress =
    totalParagraphs > 0
      ? (approvedParagraphs.length / totalParagraphs) * 100
      : 0;

  const handleNavigateToBlog = () => {
    console.log("Navigating to Blog Page");
    navigate("/blog");
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <ThemeToggle />
      </header>
      <main className="admin-content">
        <section className="stats">
          <div
            onClick={handleNavigateToBlog}
            style={{
              cursor: "pointer",
              maxWidth: "50vw",
              position: "relative",
            }}
          >
            {/* "Blogs" widget */}
            <Widget title="Blogs" />

            {/* Circular progress bar displayed over the "Blogs" widget */}
            <div className="progress-bar-overlay">
              <div className="circle-progress-bar">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="#444"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="#4caf50" // Green color for progress
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${progress}, 100`}
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div className="progress-text">{`${Math.round(
                  progress
                )}%`}</div>
              </div>
              <p>{`${approvedParagraphs.length} of ${totalParagraphs} blogs approved`}</p>
            </div>
          </div>

          <Widget title="Videos" className="VideoButton" />
        </section>
        <section className="management">
          <BlogManager />
          <VideoManager />
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
