import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentSection = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replies, setReplies] = useState({}); 


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/comments/${blogId}`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [blogId]);


  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };


  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        await axios.post("http://localhost:5001/comments", {
          blogId,
          text: newComment,
        });
        setNewComment("");
    
        const response = await axios.get(
          `http://localhost:5001/comments/${blogId}`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };


  const handleReplyChange = (commentId, e) => {
    setReplies({
      ...replies,
      [commentId]: e.target.value, 
    });
  };

  const handleAddReply = async (commentId) => {
    const replyText = replies[commentId];
    if (replyText.trim()) {
      try {
        const response = await axios.post(
          `http://localhost:5001/comments/${commentId}/replies`,
          { text: replyText }
        );
        setComments(
          comments.map((c) => (c._id === commentId ? response.data : c))
        );
        setReplies({ ...replies, [commentId]: "" }); 
      } catch (error) {
        console.error("Error adding reply:", error);
      }
    }
  };

  
  const handleShowReplies = (commentId) => {
    setComments(
      comments.map((comment) =>
        comment._id === commentId
          ? { ...comment, showReplies: !comment.showReplies }
          : comment
      )
    );
  };


  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5001/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

 
  const handleDeleteReply = async (commentId, replyId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/comments/${commentId}/replies/${replyId}`
      );
      setComments(
        comments.map((c) =>
          c._id === commentId
            ? {
                ...c,
                replies: c.replies.filter((r) => r._id !== replyId), // Keep other replies, exclude the deleted one
              }
            : c
        )
      );
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      <div>
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Add a comment"
          className="comment-input"
        />
        <button onClick={handleAddComment}>Post Comment</button>
      </div>
      {comments.map((comment) => (
        <div key={comment._id} className="comment">
          <p>{comment.text}</p>
          <button onClick={() => handleShowReplies(comment._id)}>
            {comment.showReplies ? "Hide Replies" : "Show Replies"}
          </button>
          <button
            onClick={() => handleDeleteComment(comment._id)}
            style={{ color: "red" }}
          >
            Delete Comment
          </button>
          <div>
            <input
              type="text"
              value={replies[comment._id] || ""} 
              onChange={(e) => handleReplyChange(comment._id, e)}
              placeholder="Write a reply..."
            />
            <button onClick={() => handleAddReply(comment._id)}>Reply</button>
          </div>
          {comment.showReplies &&
            comment.replies &&
            comment.replies.length > 0 && (
              <ul>
                {comment.replies.map((reply) => (
                  <li key={reply._id}>
                    {reply.text}
                    <button
                      onClick={() => handleDeleteReply(comment._id, reply._id)}
                    >
                      Delete Reply
                    </button>
                  </li>
                ))}
              </ul>
            )}
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
