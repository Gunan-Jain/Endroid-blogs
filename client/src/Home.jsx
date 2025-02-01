import React, { useState, useEffect } from "react";
import "./Home.css";
import EnLogo from "./assets/EnLogo.jpg";
import Video from "./assets/video.mp4";
import { Link } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import Comment from "./comment"; // Import the Comment component

// Modal Component
const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={closeModal} className="close-modal">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", content: "" });
  const [showForm, setShowForm] = useState(false); // Toggles the form
  const [selectedBlog, setSelectedBlog] = useState(null); // To store selected blog for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false); // State to toggle comment section visibility

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:4010/paragraphs", {
        params: { status: "approved" },
      });

      const formattedBlogs = response.data.map((item) => {
        const [title, content] = item.content.split(": ");
        return {
          title: title || "Untitled",
          content: content || "",
          _id: item._id,
        };
      });
      setBlogs(formattedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleBlogChange = (e) => {
    const { name, value } = e.target;
    setNewBlog((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddBlog = async () => {
    if (newBlog.title.trim() && newBlog.content.trim()) {
      try {
        const newBlogContent = `${newBlog.title}: ${newBlog.content}`;
        await axios.post("http://localhost:4010/paragraphs", {
          content: newBlogContent,
        });
        fetchBlogs();
        setNewBlog({ title: "", content: "" });
        setShowForm(false);
      } catch (error) {
        console.error("Error adding blog:", error);
      }
    } else {
      alert("Please fill in both title and content.");
    }
  };

  const openModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
    setIsCommentSectionOpen(false); // Ensure comments section is closed initially when modal opens
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
    setIsCommentSectionOpen(false); // Ensure comments section is closed when modal is closed
  };

  // Toggle the comment section visibility
  const toggleCommentSection = () => {
    setIsCommentSectionOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className="top-navbar-extra">
        <span>Email: sales@dbsindia.in</span>
        <span>Phone: 9136533301</span>
        <a
          href="https://www.facebook.com/dbs.india.9"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
        <a
          href="https://www.facebook.com/dbs.india.9"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
        <a
          href="https://www.instagram.com/endroid.usa/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://www.linkedin.com/company/endroid-usa-630b76217/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          href="https://www.youtube.com/@vipinpahwa4815"
          target="_blank"
          rel="noopener noreferrer"
        >
          YouTube
        </a>
        <Link to="/login" className="home">
          <button className="home-button">Login</button>
        </Link>
      </div>

      <div className="navbar">
        <div className="logo">
          <img src={EnLogo} alt="Endroid USA Logo" />
        </div>
        <nav>
          <a
            href="https://endroidusa.com/index.php"
            target="_blank"
            rel="noopener noreferrer"
          >
            Home
          </a>
          <a href="#about">About Us</a>
          <a href="#features">Products</a>
          <a href="#marketing">Marketing</a>
          <a href="#contact">Contact Us</a>
        </nav>
      </div>
      {/* Main Content */}
      <div className="main-content">
        <section className="video-section">
          <video autoPlay muted loop>
            <source src={Video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="overlay">Welcome to Endroid USA</div>
        </section>

        {/* Blog Section */}
        <section className="blog" id="blog">
          <h3>Latest Blog Posts</h3>
          <div className="blog-posts">
            {blogs.map((blog, index) => (
              <div className="blog-post" key={index}>
                <h4>{blog.title}</h4>
                <div className="blog-content">
                  <p>{blog.content}</p>
                </div>
                <button onClick={() => openModal(blog)}>
                  Read More and Comment
                </button>
              </div>
            ))}

            {/* Add Blog Icon */}
            <div
              className="blog-post add-blog"
              onClick={() => setShowForm(!showForm)}
            >
              <FaPlusCircle size={50} color="#fff" />
              <p>Add New Blog</p>
            </div>

            {/* Blog Form */}
            {showForm && (
              <div className="blog-post">
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Blog Title"
                  value={newBlog.title}
                  onChange={handleBlogChange}
                  className="blog-input"
                />
                <textarea
                  name="content"
                  placeholder="Enter Blog Content"
                  value={newBlog.content}
                  onChange={handleBlogChange}
                  className="blog-textarea"
                />
                <button onClick={handleAddBlog} className="submit-button">
                  Post Blog
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Modal for Viewing Full Blog and Adding Comments */}
        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          {selectedBlog && (
            <>
              <h2>{selectedBlog.title}</h2>
              <p>{selectedBlog.content}</p>
              {/* Toggle button for comments section */}
              <button onClick={toggleCommentSection}>
                {isCommentSectionOpen ? "Hide Comments" : "Show Comments"}
              </button>
              {/* Render Comment Section when it's open */}
              {isCommentSectionOpen && <Comment blogId={selectedBlog._id} />}
            </>
          )}
        </Modal>

        <section className="contact" id="contact">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <div>
              <p>
                <strong>Email:</strong> sales@endroidusa.com
              </p>
            </div>
            <div>
              <p>
                <strong>Phone:</strong> +1 913-653-3301
              </p>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="about" id="about">
          <h3>About Us</h3>
          <p>
            Endroid USA is dedicated to providing cutting-edge security
            solutions to homes and businesses. Our products are designed with
            reliability, efficiency, and ease of use in mind, ensuring that your
            safety is never compromised.
          </p>
        </section>

        {/* Footer Section */}
        <footer>
          <p>&copy; 2025 Endroid USA. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default Home;
