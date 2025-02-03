import React, { useEffect, useState } from "react";
import "./Adminblog.css";
import CommentSection from "./comment"; 
import Modal from "./Modal"; 

function Adminblog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/blog");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBlogs(data);
        setError("");
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const openModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
    setIsCommentSectionOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
    setIsCommentSectionOpen(false);
  };

  const toggleCommentSection = () => {
    setIsCommentSectionOpen((prevState) => !prevState);
  };

  if (loading) return <div className="loading">Loading blogs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="blog-list-container">
      <h1>Latest Blogs</h1>
      <div className="blog-grid">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="blog-card"
            onClick={() => openModal(blog)}
          >
            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="blog-image"
                loading="lazy"
              />
            )}
            <div className="blog-content">
              <h2 dangerouslySetInnerHTML={{ __html: blog.title }} />
              <div
                className="blog-body"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
              <div className="blog-meta">
                <span>
                  Posted on: {new Date(blog.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        {selectedBlog && (
          <div className="blog-modal-content">
            <h2 dangerouslySetInnerHTML={{ __html: selectedBlog.title }} />
            <div className="modal-body">
              <div
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
                className="modal-content"
              />
              {selectedBlog.imageUrl && (
                <img
                  src={selectedBlog.imageUrl}
                  alt={selectedBlog.title}
                  className="modal-image"
                  style={{ width: "500px", height: "500px" }}
                />
              )}
            </div>
            <button
              onClick={toggleCommentSection}
              className="toggle-comments-btn"
            >
              {isCommentSectionOpen ? "Hide Comments" : "Show Comments"}
            </button>

            {isCommentSectionOpen && (
              <CommentSection blogId={selectedBlog._id} />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Adminblog;
