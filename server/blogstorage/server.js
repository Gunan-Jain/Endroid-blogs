require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb+srv://techno:techno12@blogstorage.lh2j9.mongodb.net/")
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Connection error:', err));

// Schema and Model
const paragraphSchema = new mongoose.Schema({
  content: { type: String, required: true },
  status: { type: String, default: "pending", enum: ["pending", "approved"] },
});

const Paragraph = mongoose.model('Paragraphs', paragraphSchema);

// Route to delete a paragraph by ID
app.delete('/paragraphs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedParagraph = await Paragraph.findByIdAndDelete(id);
    if (!deletedParagraph) {
      return res.status(404).json({ message: "Paragraph not found" });
    }
    res.status(200).json({ message: "Paragraph deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting paragraph" });
  }
});

// Route to add a new paragraph
app.post('/paragraphs', async (req, res) => {
  const { content } = req.body;
  const newParagraph = new Paragraph({ content });
  try {
    const savedParagraph = await newParagraph.save();
    res.status(201).json(savedParagraph);
  } catch (err) {
    res.status(500).json({ message: 'Error storing paragraph' });
  }
});

app.get('/paragraphs', async (req, res) => {
  const { status } = req.query; // Check query for filtering
  try {
    const filter = status ? { status } : {}; // Filter by status if provided
    const paragraphs = await Paragraph.find(filter);
    res.status(200).json(paragraphs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching paragraphs' });
  }
});

// Route to approve a paragraph by ID
app.put('/paragraphs/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedParagraph = await Paragraph.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );
    if (!updatedParagraph) {
      return res.status(404).json({ message: "Paragraph not found" });
    }
    res.status(200).json(updatedParagraph);
  } catch (err) {
    res.status(500).json({ message: "Error approving paragraph" });
  }
});

// Start the server
app.listen(4010, () => {
  console.log("Server is running on port 4003");
});
