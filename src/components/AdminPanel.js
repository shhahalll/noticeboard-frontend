import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddNotice from "./AddNotice";  // Import the AddNotice component
import "./astyles.css"

const AdminPanel = ({ setAuth }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddNotice, setShowAddNotice] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch notices on component mount and set interval to refresh notices every second
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/notices/");
        setNotices(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices(); // Fetch notices initially

    // Set interval to refresh notices every second (1000 ms)
    const intervalId = setInterval(() => {
      fetchNotices();
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(false); // Update authentication state
    navigate("/login");
  };

  // Toggle visibility of a notice
  const toggleVisibility = async (noticeId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/notices/${noticeId}/toggle-visibility/`);
      // Update the notices list after toggling visibility
      setNotices((prevNotices) =>
        prevNotices.map((notice) =>
          notice.id === noticeId ? { ...notice, visible: !notice.visible } : notice
        )
      );
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  // Delete a notice
  const deleteNotice = async (noticeId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/notices/${noticeId}/`);
      // Remove the deleted notice from the list
      setNotices((prevNotices) => prevNotices.filter((notice) => notice.id !== noticeId));
    } catch (error) {
      console.error("Error deleting notice:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-container">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <h1>Admin Panel</h1>
      <p>Welcome, you are logged in!</p>

      {/* Notice Box with Add Button */}
      <div className="notice-box-container">
        <div className="notice-box">
          <div className="notice-list-container">
            {notices.length === 0 ? (
              <p>No notices available.</p>
            ) : (
              <ul className="notice-list">
                {notices.map((notice) => (
                  <li key={notice.id} className="notice-item">
                    <div className="notice-title">{notice.title}</div>
                    <div className="notice-actions">
                      <button
                        className="toggle-btn"
                        onClick={() => toggleVisibility(notice.id)}
                      >
                        {notice.visible ? "Hide" : "Show"}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteNotice(notice.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Button for Add Notice */}
        <div className="sub-buttons">
          <button
            className="add-notice-btn"
            onClick={() => setShowAddNotice(true)}
          >
            Add Notice
          </button>
        </div>
      </div>

      {/* Conditional rendering for Add Notice Component */}
      {showAddNotice && <AddNotice setShowAddNotice={setShowAddNotice} />}
    </div>
  );
};

export default AdminPanel;
