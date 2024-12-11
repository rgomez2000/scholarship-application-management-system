import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch notifications from the API
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not logged in");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/notifications/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setNotifications(response.data); 
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        setError("Failed to fetch notifications.");
      });
  }, []);

  const clearNotifications = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not logged in");
      return;
    }

    axios
      .post(
        "http://127.0.0.1:8000/api/notifications/clear/",
        {}, 
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then(() => {
        setNotifications([]);
        alert("Notifications cleared!"); 
      })
      .catch((err) => {
        console.error("Error clearing notifications:", err);
        setError("Failed to clear notifications.");
      });
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>Notifications:</h3>
      <button onClick={clearNotifications}>Clear All Notifications</button>
      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id}>{notification.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
