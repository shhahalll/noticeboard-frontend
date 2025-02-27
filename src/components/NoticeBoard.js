import React, { useEffect, useState } from "react";
import axios from "axios";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch notices every 1 second
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get("http://apis.shahal.online/api/notices/");
        const visibleNotices = response.data.filter((notice) => notice.visible);

        // Only update if new data is different
        setNotices((prev) => (JSON.stringify(prev) !== JSON.stringify(visibleNotices) ? visibleNotices : prev));
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
    const interval = setInterval(fetchNotices, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cycle through notices every 5 seconds
  useEffect(() => {
    if (notices.length > 1) {
      const cycleInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % notices.length);
      }, 5000);

      return () => clearInterval(cycleInterval);
    }
  }, [notices]);

  // Prevent crash when no notices exist
  const currentNotice = notices[currentIndex] || null;

  if (!currentNotice) {
    return (
      <div className="notice-container">
        <h1 className="notice-title">No Notices Available</h1>
      </div>
    );
  }

  return (
    <div className="notice-container">
      <div className="notice-card">
        <h1 className="notice-title">{currentNotice.title}</h1>
        <p className="notice-content">{currentNotice.content}</p>

        {/* Show Image or Video */}
        {currentNotice.media && (
          currentNotice.media.endsWith(".mp4") || currentNotice.media.endsWith(".webm") ? (
            <video className="notice-media" src={currentNotice.media} autoPlay loop muted playsInline />
          ) : (
            <img className="notice-media" src={currentNotice.media} alt="Notice Media" />
          )
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;

/* CSS */
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  .notice-container {
    width: 100vw;
    height: 100vh;
    background: #003366;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 20px;
  }

  .notice-card {
    width: 90%;
    max-width: 900px;
    background: white;
    color: #003366;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
  }

  .notice-title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .notice-content {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .notice-media {
    width: 100%;
    max-height: 500px;
    object-fit: contain;
    border-radius: 8px;
  }

  video {
    max-height: 500px;
  }
`;

// Inject CSS into the page
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
