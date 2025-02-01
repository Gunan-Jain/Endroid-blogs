// BlogList.jsx
import React, { useEffect, useState } from "react";
import "./Adminblog.css";

function Adminblog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/blog");
        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Received data:", data); // Add this
        setBlogs(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <div className="loading">Loading blogs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="blog-list-container">
      <h1>Latest Blogs</h1>
      <div className="blog-grid">
        {blogs.map((blog, index) => (
          <div key={index} className="blog-card">
            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="blog-image"
                loading="lazy"
              />
            )}
            <div className="blog-content">
              <h2>{blog.title}</h2>
              <div
                className="blog-body"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Adminblog;
