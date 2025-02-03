import React, { useState, useEffect } from "react";
import "./Home.css";
import EnLogo from "./assets/EnLogo.jpg";
import Video from "./assets/video.mp4";
import { Link } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import Comment from "./comment"; 

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
  const [showForm, setShowForm] = useState(false); 
  const [selectedBlog, setSelectedBlog] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false); 

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

      
      <div className="main-content">
        <section className="video-section">
          <video autoPlay muted loop>
            <source src={Video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="overlay">Welcome to Endroid USA</div>
        </section>

  
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
                Share Your Thoughts   </button>
              </div>
            ))}

            
            <div
              className="blog-post add-blog"
              onClick={() => setShowForm(!showForm)}
            >
              <FaPlusCircle size={70} color="#fff" />
              <p>Add New Blog</p>
            </div>

            
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

      
        <section className="admin-blog">
          <h2>Admin Blogs</h2>
          <Adminblog />
        </section>

        
        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          {selectedBlog && (
            <>
              <h2>{selectedBlog.title}</h2>
              <div className="blog-content">
                <p>{selectedBlog.content}</p>
              </div>
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

        <section className="about-us">
          <h2>About Us</h2>
          <div className="about-container">
            <div className="about-box" id="vision">
              <h3>Our Vision</h3>
              <p>
                We strive to become the most trusted partner in terms of quality,
                consistency, and up-gradation for the security services in this
                industry. For that, we tend to improve our expertise in technology
                and market. We strive to set the standards of encryption and safety
                for this rising industry in the near future and make the trust of
                our clients our foundation.
              </p>
            </div>
            <div className="about-box" id="company">
              <h3>Our Company</h3>
              <p>
                Established in 2008, DBS has been working for over 14 years as a
                one-stop solution provider for commercial security systems. From
                project consultation to post-sale services, our expert solutions
                have helped numerous businesses protect their assets and premises.
              </p>
            </div>
            <div className="about-box" id="client">
              <h3>Our Clients</h3>
              <p>
                We cater to numerous industries and businesses, helping them
                achieve high-quality, innovative, and reliable solutions. Our
                clients include commercial businesses, educational institutions,
                residential complexes, and government bodies.
              </p>
            </div>
          </div>
        </section>
    
    {/* Footer Section */}
        <div class ="footer">
        <footer>
          <p>&copy; 2025 Endroid USA. All rights reserved.</p>
        </footer>
        </div>

      </div>
    </>
  );
};

const Adminblog = () => {
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
            key={blog.id}
            className="blog-card"
            onClick={() => openModal(blog)}
          >
            <div class text>
            <img src={blog.imageUrl} alt={blog.title} />
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
          </div>
          </div>
        ))}
      </div>

      {selectedBlog && (
        <Modal isOpen={isModalOpen} closeModal={closeModal}>
          <h2>{selectedBlog.title}</h2>
          <p>{selectedBlog.content}</p>
          <button onClick={toggleCommentSection}>
            {isCommentSectionOpen ? "Hide Comments" : "Show Comments"}
          </button>
          {isCommentSectionOpen && <Comment blogId={selectedBlog.id} />}
        </Modal>
      )}
    </div>
  );
};

export default Home;
