const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5001;


app.use(cors());
app.use(bodyParser.json());


mongoose
  .connect("mongodb+srv://techno:techno12@blogstorage.lh2j9.mongodb.net/")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));


const replySchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now },
});

const commentSchema = new mongoose.Schema({
  text: String,
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
  replies: [replySchema],
  date: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);



app.get("/comments/:blogId", async (req, res) => {
  const { blogId } = req.params;
  try {
    const comments = await Comment.find({ blogId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post("/comments", async (req, res) => {
  const { text, blogId } = req.body;
  try {
    const comment = new Comment({ text, blogId });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post("/comments/:id/replies", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const reply = { text };
    comment.replies.push(reply);
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.delete("/comments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Comment.findByIdAndDelete(id);
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/comments/:commentId/replies/:replyId", async (req, res) => {
  const { commentId, replyId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies = comment.replies.filter((reply) => reply._id.toString() !== replyId);
    await comment.save();
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
