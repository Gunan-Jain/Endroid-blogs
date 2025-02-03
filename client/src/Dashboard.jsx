import React, { useState, useEffect } from "react";
import "../styles/AdminPage.css";
import "./Dashboard.css";
import Widget from "../Components/widget";
import BlogManager from "../Components/BlogManager";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [approvedBlogs, setApprovedBlogs] = useState(0);
  const navigate = useNavigate();

  
  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:4010/paragraphs");
      setBlogs(response.data);
      
      const approvedCount = response.data.filter(blog => blog.approved).length;
      setApprovedBlogs(approvedCount);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleNavigateToBlog = () => {
    console.log("Navigating to Blog Page");
    navigate("/blog");
  };

  
  const progress = blogs.length > 0 ? (approvedBlogs / blogs.length) * 100 : 0;

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
      </header>
      <main className="admin-content">
        <section className="stats">
          <div className="widget-progress-container" onClick={handleNavigateToBlog}>
            <Widget title="Blogs" />
            <div className="circular-progress">
              <CircularProgressbar
                value={progress}
                text={`${approvedBlogs} / ${blogs.length}`}
                styles={buildStyles({
                  textSize: "17px",
                  pathColor: "#00FF00",
                  textColor:  "#FFFFFF",
                  trailColor: " #FFFF00",
                })}
              />
            </div>
          </div>
        </section>
        <section className="management">
          <BlogManager />
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
