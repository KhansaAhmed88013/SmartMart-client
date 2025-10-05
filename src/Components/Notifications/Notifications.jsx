import React, { useState, useEffect } from "react";
import "./Notifications.css";
import { notifications as fetchNotifications, clearNotification } from "../../UserService";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchData();
  }, []);

  const handleClearAll = async () => {
    try {
      // Extract IDs of all displayed notifications
      const ids = notifications.map((note) => note.id);

      // Send IDs to UserService clearNotification function
      await clearNotification(ids);

      // Clear local state
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <button className="clear-btn" onClick={handleClearAll}>
          Clear All
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="no-notifications">You have no new notifications.</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((note) => (
            <li key={note.id} className="notification-item">
              <span className="notification-dot"></span>
              <div>
                <div>{note.message}</div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  Role: {note.User.role}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
