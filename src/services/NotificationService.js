import { API_BASE } from "../config";

export const NotificationService = {
  // Save device token to backend for push notifications
  async registerDevice(token, userId, role) {
    try {
      const authToken = localStorage.getItem("token");
      await fetch(`${API_BASE}/profile/save_device_token.php`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Role": role,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ device_token: token, user_id: userId })
      });
    } catch (error) {
      console.error("Failed to register device token:", error);
    }
  },

  // Fetch in-app notifications
  async getNotifications() {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const res = await fetch(`${API_BASE}/profile/get_notifications.php`, {
        headers: { "Authorization": `Bearer ${token}`, "Role": role }
      });
      return await res.json();
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return { status: false, data: [] };
    }
  },

  // Mark a notification as read
  async markAsRead(notificationId) {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      await fetch(`${API_BASE}/profile/mark_notification_read.php`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Role": role,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ notification_id: notificationId })
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }
};
