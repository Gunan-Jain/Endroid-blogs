const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();


const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model("Blog", blogSchema);


app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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


app.post("/upload", upload.single("image"), (req, res) => {
  try {
    res.status(200).json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ error: "Error uploading image to Cloudinary" });
  }
});


app.get("/blog", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching blogs" });
  }
});

app.post("/blog", async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    
    if (!title || !content || !imageUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newBlog = new Blog({ title, content, imageUrl });
    await newBlog.save();
    
    res.status(201).json({ message: "Blog created successfully!", blog: newBlog });
  } catch (error) {
    res.status(500).json({ error: "Error creating blog" });
  }
});

app.delete('/blog/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    
    if (blog.imageUrl) {
      
      const urlParts = blog.imageUrl.split('/');
      const uploadIndex = urlParts.indexOf('upload') + 1;
      const publicIdParts = urlParts.slice(uploadIndex);
      
      
      const publicId = publicIdParts.join('/').replace(/\.[^/.]+$/, "");
      
      
      await cloudinary.uploader.destroy(publicId);
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ 
      error: "Error deleting blog",
      details: error.message 
    });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});