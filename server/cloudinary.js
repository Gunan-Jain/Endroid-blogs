const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// Initialize Express app
const app = express();

// Temporary in-memory storage for blogs
let blogs = [];

// Enable CORS for all routes
app.use(cors({ origin: "http://localhost:5173" }));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Parse incoming JSON
app.use(express.json());

// Multer setup for Cloudinary storage
const storage = require("multer-storage-cloudinary").CloudinaryStorage;
const upload = multer({
  storage: new storage({
    cloudinary: cloudinary,
    params: {
      folder: "blog-images",
      allowed_formats: ["jpg", "png", "jpeg"],
    },
  }),
});

// Image upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
  try {
    res.status(200).json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ error: "Error uploading image to Cloudinary" });
  }
});

// Blog endpoints
app.get("/blog", (req, res) => {
  res.status(200).json(blogs);
});

app.post("/blog", (req, res) => {
  const { title, content, imageUrl } = req.body;
  
  if (!title || !content || !imageUrl) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newBlog = { title, content, imageUrl };
  blogs.push(newBlog);
  console.log("Blog Created:", newBlog);
  
  res.status(200).json({ message: "Blog created successfully!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});