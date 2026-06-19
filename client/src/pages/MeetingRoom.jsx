import { Bot, Mic, MonitorUp, PhoneOff, Send, Video } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client.js";
import { useSocketStore } from "../store/socketStore.js";

export default function MeetingRoom() {
  const { id } = useParams();
  const { connect } = useSocketStore();
  const [meeting, setMeeting] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chat, setChat] = useState("");
  const [transcript, setTranscript] = useState("");
  const localVideo = useRef(null);

  const socket = useMemo(() => connect(), [connect]);

  useEffect(() => {
    api.get(`/meetings/${id}`).then(({ data }) => {
      setMeeting(data.meeting);
      setMessages(data.messages);
    });
  }, [id]);

  useEffect(() => {
    socket.emit("meeting:join", { meetingId: id });
    socket.on("chat:new", (message) => setMessages((items) => [...items, message]));
    socket.on("presence:joined", ({ user }) => setMessages((items) => [...items, { _id: crypto.randomUUID(), type: "system", text: `${user.name} joined`, sender: user }]));
    return () => {
      socket.emit("meeting:leave", { meetingId: id });
      socket.off("chat:new");
      socket.off("presence:joined");
    };
  }, [id, socket]);

  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.current.srcObject = stream;
  }

  async function sendChat(event) {
    event.preventDefault();
    if (!chat.trim()) return;
    socket.emit("chat:send", { meetingId: id, text: chat });
    setChat("");
  }

  async function addTranscript() {
    if (!transcript.trim()) return;
    const { data } = await api.post(`/meetings/${id}/transcript`, { text: transcript });
    setMeeting((current) => ({ ...current, transcript: [...(current?.transcript || []), data] }));
    setTranscript("");
  }

  async function generateAI() {
    const { data } = await api.post(`/meetings/${id}/intelligence`);
    setMeeting(data.meeting);
  }

  return (
    <section className="meeting-room">
      <div className="video-stage">
        <div className="room-heading">
          <div>
            <p>Room {meeting?.roomCode}</p>
            <h2>{meeting?.title}</h2>
          </div>
          <span className="status-dot">Live ready</span>
        </div>
        <video ref={localVideo} autoPlay muted playsInline className="video-tile" />
        <div className="control-bar">
          <button onClick={startCamera} title="Start camera">
            <Video size={18} />
          </button>
          <button title="Mute microphone">
            <Mic size={18} />
          </button>
          <button title="Share screen">
            <MonitorUp size={18} />
          </button>
          <button className="danger" title="Leave meeting">
            <PhoneOff size={18} />
          </button>
        </div>
      </div>
      <aside className="meeting-side">
        <div className="panel compact">
          <div className="section-title">
            <h3>Chat</h3>
          </div>
          <div className="chat-list">
            {messages.map((message) => (
              <div className="chat-item" key={message._id}>
                <strong>{message.sender?.name || "System"}</strong>
                <span>{message.text}</span>
              </div>
            ))}
          </div>
          <form className="chat-form" onSubmit={sendChat}>
            <input value={chat} onChange={(e) => setChat(e.target.value)} placeholder="Type message" />
            <button>
              <Send size={16} />
            </button>
          </form>
        </div>
        <div className="panel compact">
          <div className="section-title">
            <h3>AI intelligence</h3>
            <button onClick={generateAI} className="icon-button" title="Generate AI">
              <Bot size={18} />
            </button>
          </div>
          <p className="summary">{meeting?.summary || "Add transcript lines, then generate summary and action items."}</p>
          <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder="Paste live transcript or meeting notes" />
          <button className="primary-button" onClick={addTranscript}>Add transcript</button>
          <div className="actions">
            {meeting?.actionItems?.map((item) => (
              <span key={item._id}>{item.text}</span>
            ))}
          </div>
        </div>
      </aside>
    </section>
  );
}
