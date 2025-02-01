import React, { useState } from "react";
import "../Styles/BlogManager.css";
import {
  FaUpload,
  FaBold,
  FaItalic,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
} from "react-icons/fa";

function BlogManager() {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async () => {
    // Check if any of the fields are empty or if the image URL is not set
    if (blogTitle.trim() === "" || blogContent.trim() === "" || !imageUrl) {
      alert(
        "Please fill in all fields if field are empty or click add blog again one time more if image is shown."
      );
    } else {
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
          alert("Blog added successfully!");
          setBlogTitle("");
          setBlogContent("");
          setImage(null);
          setImageUrl("");
        } else {
          alert("Failed to add blog.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleTextFormat = (formatType) => {
    const activeElement = document.activeElement;
    const selectionStart = activeElement.selectionStart;
    const selectionEnd = activeElement.selectionEnd;
    const selectedText = activeElement.value.substring(
      selectionStart,
      selectionEnd
    );

    if (selectedText) {
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

      const newText =
        activeElement.value.substring(0, selectionStart) +
        formattedText +
        activeElement.value.substring(selectionEnd);
      if (activeElement === document.getElementById("blogTitle")) {
        setBlogTitle(newText);
      } else if (activeElement === document.getElementById("blogContent")) {
        setBlogContent(newText);
      }
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log(data); // Log the response for debugging
        if (data.imageUrl) {
          setImage(file);
          setImageUrl(data.imageUrl); // Set the image URL properly
        } else {
          alert("Failed to upload image.");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="blog-manager">
      <h2>Manage Blogs</h2>
      <div className="blog-form">
        <input
          id="blogTitle"
          type="text"
          placeholder="Blog Title"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
        />
        <textarea
          id="blogContent"
          placeholder="Blog Content"
          value={blogContent}
          onChange={(e) => setBlogContent(e.target.value)}
        ></textarea>
        <input type="file" onChange={handleImageUpload} />
        {imageUrl && <img src={imageUrl} alt="Uploaded" width="100" />}
        <button className="btn" onClick={handleSubmit}>
          Add Blog
        </button>
      </div>
    </div>
  );
}

export default BlogManager;
