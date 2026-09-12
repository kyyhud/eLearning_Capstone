import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../../services/courseApi.js";
import { getCourseMessages, sendCourseMessage } from "../../services/chatApi.js";

function CourseChat() {
  const { id } = useParams();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const chatAutoRefresh = user?.preferences?.chatAutoRefresh ?? true;
  const pollingRef = useRef(false);

  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const scrollToNewest = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const loadDiscussion = async () => {
      setLoading(true);
      setError("");
      try {
        const [courseResponse, messageResponse] = await Promise.all([getCourseById(id), getCourseMessages(id)]);
        setCourse(courseResponse.data);
        setMessages(messageResponse.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadDiscussion();
  }, [id]);

  useEffect(() => {
    if (!loading) {
      scrollToNewest();
    }
  }, [loading]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError("");
    try {
      const response = await getCourseMessages(id);
      setMessages(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage) {
      return;
    }
    setSending(true);
    setError("");
    try {
      await sendCourseMessage(id, trimmedMessage);
      setMessageInput("");
      const response = await getCourseMessages(id);
      setMessages(response.data);
      setTimeout(scrollToNewest, 0);
    } catch (error) {
      setError(error.message);
    } finally {
      setSending(false);
    }
  };

  // Set up polling for chat auto-refresh
  useEffect(() => {
    if (!chatAutoRefresh) {
      return;
    }
    const intervalId = setInterval(async () => {
      if (pollingRef.current) {
        return;
      }
      pollingRef.current = true;
      try {
        const response = await getCourseMessages(id);
        setMessages(response.data);
      } catch {
        // Keep the current messages and retry during the next refresh.
      } finally {
        pollingRef.current = false;
      }
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  }, [id, chatAutoRefresh]);

  if (loading) {
    return <p>Loading course discussion...</p>;
  }
  if (!course) {
    return <p>{error || "Unable to load course discussion."}</p>;
  }

  const isArchived = course.status === "archived";

  return (
    <div className="chat-page">
      <h2>{course.title}</h2>

      <button className="button-secondary" type="button" onClick={() => navigate(-1)}>
        Back
      </button>

      <h3>Course Discussion</h3>
      {isArchived && <p className="status-message">This course is archived. The discussion is read-only.</p>}

      <p className="chat-refresh-status">Auto-refresh: {chatAutoRefresh ? "On" : "Off"}</p>
      <button className="button-secondary" type="button" onClick={handleRefresh} disabled={refreshing}>
        {refreshing ? "Refreshing..." : "Refresh"}
      </button>

      {error && <p className="error-message">{error}</p>}

      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="empty-state">No messages yet. Start the discussion.</p>
        ) : (
          messages.map((chatMessage) => (
            <div className="chat-message" key={chatMessage._id}>
              <p className="chat-message-sender">
                <strong>{chatMessage.sender ? `${chatMessage.sender.firstName} ${chatMessage.sender.lastName}` : "Unknown User"}</strong>
                {chatMessage.sender?.typeOfUser && ` (${chatMessage.sender.typeOfUser})`}
              </p>
              <p className="chat-message-time">{new Date(chatMessage.createdAt).toLocaleString()}</p>
              <p className="chat-message-body">{chatMessage.message}</p>
            </div>
          ))
        )}
        {/* Scroll to the bottom of the messages */}
        <div ref={messagesEndRef} />
      </div>

      {!isArchived && (
        <form className="chat-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Write a message..."
            />
          </div>
          <p className="character-count">{messageInput.length}/500</p>
          <button type="submit" disabled={!messageInput.trim() || sending}>
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      )}
    </div>
  );
}

export default CourseChat;
