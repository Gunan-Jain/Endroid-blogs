import React, { useState, useEffect, useRef } from "react";
import "../Styles/BlogManager.css";
import {
  FaUpload,
  FaBold,
  FaItalic,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaTrash,
} from "react-icons/fa";

function BlogManager() {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  // Fetch existing blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/blog");
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError("Failed to fetch blogs");
      }
    };
    fetchBlogs();
  }, []);

  const handleSubmit = async () => {
    if (!blogTitle.trim() || !blogContent.trim() || !imageUrl) {
      setError("Please fill in all fields and upload an image");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: blogTitle,
          content: blogContent,
          imageUrl,
        }),
      });

      if (response.ok) {
        const newBlog = await response.json();
        setBlogs([newBlog.blog, ...blogs]);
        setBlogTitle("");
        setBlogContent("");
        setImageUrl("");
        setError("");
      } else {
        setError("Failed to add blog");
      }
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  const handleDeleteBlog = async (blogId, imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const response = await fetch(`http://localhost:5000/blog/${blogId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (response.ok) {
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
      } else {
        setError("Failed to delete blog");
      }
    } catch (err) {
      setError("Error deleting blog");
    }
  };

  const handleTextFormat = (formatType) => {
    const activeElement = document.activeElement;
    const isTitle = activeElement === titleRef.current;
    const isContent = activeElement === contentRef.current;

    if (!isTitle && !isContent) return;

    const selectionStart = activeElement.selectionStart;
    const selectionEnd = activeElement.selectionEnd;
    const value = activeElement.value;
    const selectedText = value.substring(selectionStart, selectionEnd);

    if (!selectedText) return;

    let formattedText;
    switch (formatType) {
      case "bold":
        formattedText = `<b>${selectedText}</b>`;
        break;
      case "italic":
        formattedText = `<i>${selectedText}</i>`;
        break;
      case "alignLeft":
        formattedText = `<div style="text-align: left;">${selectedText}</div>`;
        break;
      case "alignCenter":
        formattedText = `<div style="text-align: center;">${selectedText}</div>`;
        break;
      case "alignRight":
        formattedText = `<div style="text-align: right;">${selectedText}</div>`;
        break;
      default:
        return;
    }

    const newValue =
      value.substring(0, selectionStart) +
      formattedText +
      value.substring(selectionEnd);

    if (isTitle) setBlogTitle(newValue);
    if (isContent) setBlogContent(newValue);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        setError("");
      } else {
        setError("Image upload failed");
      }
    } catch (err) {
      setError("Error uploading image");
    }
  };

  return (
    <div className="blog-manager">
      <h2>Manage Blogs</h2>
      <div className="blog-form">
        <input
          ref={titleRef}
          type="text"
          placeholder="Blog Title"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
        />

        <div className="formatting-toolbar">
          <button onClick={() => handleTextFormat("bold")}>
            <FaBold />
          </button>
          <button onClick={() => handleTextFormat("italic")}>
            <FaItalic />
          </button>
          <button onClick={() => handleTextFormat("alignLeft")}>
            <FaAlignLeft />
          </button>
          <button onClick={() => handleTextFormat("alignCenter")}>
            <FaAlignCenter />
          </button>
          <button onClick={() => handleTextFormat("alignRight")}>
            <FaAlignRight />
          </button>
        </div>

        <textarea
          ref={contentRef}
          placeholder="Blog Content"
          value={blogContent}
          onChange={(e) => setBlogContent(e.target.value)}
        ></textarea>

        <div className="image-upload">
          <label>
            <FaUpload /> Upload Image
            <input type="file" onChange={handleImageUpload} hidden />
          </label>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Upload preview"
              className="image-preview"
            />
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <button className="submit-button" onClick={handleSubmit}>
          Publish Blog
        </button>
      </div>

      <div className="blog-list">
        <h3>Published Blogs</h3>
        {blogs.map((blog) => (
          <div key={blog._id} className="blog-item">
            <button
              className="delete-button"
              onClick={() => handleDeleteBlog(blog._id, blog.imageUrl)}
            >
              <FaTrash />
            </button>
            <h4 dangerouslySetInnerHTML={{ __html: blog.title }} />
            {blog.imageUrl && (
              <img
                src={blog.imageUrl}
                alt="Blog cover"
                className="blog-image"
              />
            )}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            <div className="blog-meta">
              {new Date(blog.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogManager;
