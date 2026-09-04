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

  const loadDiscussion = async () => {
    setLoading(true);
    setError("");
    try {
      const [courseData, messageResponse] = await Promise.all([getCourseById(id), getCourseMessages(id)]);
      setCourse(courseData);
      setMessages(messageResponse.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      } catch (error) {
        console.error("Unable to refresh course discussion:", error);
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
    <div>
      <h2>{course.title}</h2>

      <button type="button" onClick={() => navigate(-1)}>
        Back
      </button>

      <h3>Course Discussion</h3>
      {isArchived && <p>This course is archived. The discussion is read-only.</p>}

      <p>Auto-refresh: {chatAutoRefresh ? "On" : "Off"}</p>
      <button type="button" onClick={handleRefresh} disabled={refreshing}>
        {refreshing ? "Refreshing..." : "Refresh"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        {messages.length === 0 ? (
          <p>No messages yet. Start the discussion.</p>
        ) : (
          messages.map((chatMessage) => (
            <div key={chatMessage._id}>
              <p>
                <strong>
                  {chatMessage.sender.firstName} {chatMessage.sender.lastName}
                </strong>{" "}
                ({chatMessage.sender.typeOfUser})
              </p>
              <p>{new Date(chatMessage.createdAt).toLocaleString()}</p>
              <p>{chatMessage.message}</p>
              <hr />
            </div>
          ))
        )}
        {/* Scroll to the bottom of the messages */}
        <div ref={messagesEndRef} />
      </div>

      {!isArchived && (
        <form onSubmit={handleSubmit}>
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
          <p>{messageInput.length}/500</p>
          <button type="submit" disabled={!messageInput.trim() || sending}>
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      )}
    </div>
  );
}

export default CourseChat;
