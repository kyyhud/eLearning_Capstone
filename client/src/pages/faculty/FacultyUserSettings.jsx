import { useState } from "react";
import { changePassword, updateFaculty } from "../../services/userApi.js";

function FacultyUserSettings() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    chatAutoRefresh: user?.preferences?.chatAutoRefresh ?? true,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    try {
      const response = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setMessage(response.message);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle updating user settings/preferences
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await updateFaculty(user._id, {
        preferences: {
          chatAutoRefresh: preferences.chatAutoRefresh,
        },
      });
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          chatAutoRefresh: preferences.chatAutoRefresh,
        },
      };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      setMessage("Settings updated successfully.");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h3>User Settings for {user?.email}</h3>

      <section>
        <h2>Discussion Settings</h2>
        <form onSubmit={handleSettingsSubmit}>
          <div>
            <label>
              <input
                type="checkbox"
                checked={preferences.chatAutoRefresh}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    chatAutoRefresh: e.target.checked,
                  })
                }
              />
              Automatically refresh course discussions
            </label>
          </div>

          <button type="submit">Save Settings</button>
        </form>
      </section>

      <section>
        <h2>Update Password</h2>
        <form onSubmit={handleChangePassword}>
          <div>
            <label htmlFor="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" name="currentPassword" value={formData.currentPassword} onChange={handlePasswordChange} required />
          </div>
          <div>
            <label htmlFor="newPassword">New Password</label>
            <input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handlePasswordChange} required />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handlePasswordChange} required />
          </div>
          <small>Password must be 12 to 64 characters and include an uppercase letter, lowercase letter, number, and special character.</small>
          <br />
          <button type="submit">Change Password</button>
        </form>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </section>
    </div>
  );
}

export default FacultyUserSettings;
