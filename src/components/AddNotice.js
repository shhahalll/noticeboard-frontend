// src/components/AddNotice.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./dstyles.css";

const AddNotice = ({ setShowAddNotice }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null); // To store media file
  const [error, setError] = useState("");
  const [existingNotices, setExistingNotices] = useState([]);

  // Fetch existing notices when the component mounts
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get("http://api.nihalez.in/api/notices/");
        setExistingNotices(response.data);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there are already 4 visible notices, show an error
    const visibleNoticesCount = existingNotices.filter((notice) => notice.visible).length;
    if (visibleNoticesCount >= 4) {
      setError("Only 4 notices can be visible at a time.");
      return;
    }

    // Prepare the form data to send with the POST request
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (mediaFile) {
      formData.append("media", mediaFile); // Add media file if it's provided
    }

    try {
      const response = await axios.post("http://api.nihalez.in/api/notices/", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the proper content type for file upload
        },
      });

      if (response.status === 201) {
        setShowAddNotice(false); // Close the add notice form after successful submission
      }
    } catch (error) {
      setError("Error adding notice. Please try again.");
    }
  };

  return (
    <div className="add-notice-modal">
      <div className="modal-content">
        <span
          className="close-btn"
          onClick={() => setShowAddNotice(false)}
        >
          &times;
        </span>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>

          <label>Media File (optional)</label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setMediaFile(e.target.files[0])} // Handle file input change
          />

          <button type="submit">Add Notice</button>
          <button type="button" onClick={() => setShowAddNotice(false)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNotice;
