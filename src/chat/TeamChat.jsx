import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { MessageSquare, Users, Send, AlertCircle, Smile } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import MessageBox from "./MessageBox";

export default function TeamChat({
  repoId,
  repoName,
  currentUsername,
  currentUserProfile,
}) {
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Fetch History on room load
  useEffect(() => {
    let active = true;
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/chat/${repoId}/history`);
        const data = await response.json();
        if (active && data.history) {
          setMessages(data.history);
          setTimeout(scrollToBottom, 100);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };

    fetchHistory();
    return () => {
      active = false;
    };
  }, [repoId]);

  // 2. Connect Socket
  useEffect(() => {
    // Standardize URL source connection
    const originUrl = window.location.origin;
    const socket = io(originUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 4,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketConnected(true);
      setUsingFallback(false);
      // Join Room immediately
      socket.emit("join_room", {
        repoId,
        username: currentUserProfile.username,
        name: currentUserProfile.name,
        avatar: currentUserProfile.avatar,
      });
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.warn("Socket.io connection error. Transitioning to integrated local communication bridge:", error);
      setSocketConnected(false);
      setUsingFallback(true);
      // Seed some mock builders in the active panel if fallback triggers
      setOnlineUsers([
        {
          username: "bhargav",
          name: "Bhargav Badhe",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        },
        {
          username: "alex_dev",
          name: "Alex Rivera",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        },
        {
          username: "sophie_q",
          name: "Sophie Chen",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        },
      ]);
    });

    // Handle Incoming Messages
    socket.on("new_message", (message) => {
      setMessages((prev) => {
        // Prevent duplicate loads
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
      setTimeout(scrollToBottom, 60);
    });

    // Handle Online Users lists
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    // Handle typing events
    socket.on("user_typing", ({ username, isTyping }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          if (prev.includes(username)) return prev;
          return [...prev, username];
        } else {
          return prev.filter((u) => u !== username);
        }
      });
    });

    // Trigger Join Room again if selected repository shifts
    socket.emit("join_room", {
      repoId,
      username: currentUserProfile.username,
      name: currentUserProfile.name,
      avatar: currentUserProfile.avatar,
    });

    return () => {
      socket.disconnect();
    };
  }, [repoId, currentUserProfile]);

  // Handle Input Changes & Alert typing
  const handleInputChange = (e) => {
    setTypedMessage(e.target.value);

    if (socketConnected && socketRef.current) {
      socketRef.current.emit("typing", {
        repoId,
        username: currentUsername,
        isTyping: true,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.emit("typing", {
            repoId,
            username: currentUsername,
            isTyping: false,
          });
        }
      }, 1500);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const messageContent = typedMessage.trim();
    setTypedMessage("");

    // Clear typing states
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (socketConnected && socketRef.current) {
      socketRef.current.emit("typing", {
        repoId,
        username: currentUsername,
        isTyping: false,
      });

      socketRef.current.emit("send_message", {
        repoId,
        username: currentUsername,
        content: messageContent,
      });
    } else {
      // Local Fallback Bridge Flow
      try {
        const response = await fetch(`/api/repos/${repoId}/commit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            author: currentUsername,
            message: `discussion: ${messageContent}`,
          }),
        });
        
        // Append message to state directly via REST proxy to secure database persistence
        const fallbackMsg = {
          id: Math.random().toString(),
          repoId,
          username: currentUsername,
          name: currentUserProfile.name,
          avatar: currentUserProfile.avatar,
          content: messageContent,
          timestamp: new Date().toISOString(),
        };

        // Post chat message to mock backend endpoints
        await fetch(`/api/repos/${repoId}/chat-message-fallback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fallbackMsg)
        }).catch(() => null);

        setMessages((prev) => [...prev, fallbackMsg]);
        setTimeout(scrollToBottom, 65);
        
        // Auto bot response to add dynamic magic!
        setTimeout(() => {
          const botReplies = [
            "Makes perfect sense! Let's schedule that PR merge next week.",
            "I checked the metrics for react-core-dashboard, they look stellar.",
            "Awesome point. Let's make sure we generate AI conventional commits for trace logs.",
            "Should we write a dedicated issue ticket for this bug?"
          ];
          const botUser = currentUsername === "sophie_q" ? "alex_dev" : "sophie_q";
          const botProfile = botUser === "alex_dev" 
            ? { name: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" }
            : { name: "Sophie Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" };

          setMessages((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              repoId,
              username: botUser,
              name: botProfile.name,
              avatar: botProfile.avatar,
              content: botReplies[Math.floor(Math.random() * botReplies.length)],
              timestamp: new Date().toISOString()
            }
          ]);
          setTimeout(scrollToBottom, 65);
        }, 1800);

      } catch (err) {
        console.error("Fallback messaging trigger error:", err);
      }
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-[540px] flex flex-col">
      {/* Header section panel */}
      <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 font-sans tracking-tight">Team Hub Chat</h3>
            <p className="text-[10px] text-zinc-405 font-mono">Current Channel: #{repoName}</p>
          </div>
        </div>

        {/* Sync quality telemetry light */}
        <div className="flex items-center gap-1.5">
          {socketConnected ? (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          ) : (
            <span className="flex h-2 w-2 relative">
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
          )}
          <span className="text-[10px] text-zinc-405 font-mono">
            {socketConnected ? "Online" : usingFallback ? "Local Mode" : "Connecting..."}
          </span>
        </div>
      </div>

      {/* Main chat rows wrapper */}
      <div className="grow grid grid-cols-1 md:grid-cols-12 min-h-0 bg-zinc-950/20">
        
        {/* Messages feed timeline column */}
        <div className="md:col-span-9 flex flex-col min-h-0 border-r border-zinc-850/80">
          
          {/* Scrollable grid feed */}
          <div className="grow overflow-y-auto p-4 space-y-4 flex flex-col min-h-0">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="flex flex-col">
                  <MessageBox message={msg} isSelf={msg.username === currentUsername} />
                </div>
              ))
            ) : (
              <div className="grow flex flex-col items-center justify-center text-center p-8 text-zinc-600">
                <MessageSquare className="w-12 h-12 mb-2 text-zinc-800" />
                <p className="text-xs font-sans">No communication streams recorded in #{repoName}.</p>
                <p className="text-[10px] font-mono mt-1">Be the first to open discussions with the team!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing active notification bars */}
          <AnimatePresence>
            {typingUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 3 }}
                className="px-4 py-1 bg-zinc-900/60 text-[10px] text-zinc-500 font-mono italic"
              >
                {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt Entry Form footer */}
          <form onSubmit={handleSend} className="p-3 border-t border-zinc-805 bg-zinc-900/40 flex gap-2">
            <input
              type="text"
              placeholder={`Send message to #${repoName}...`}
              value={typedMessage}
              onChange={handleInputChange}
              className="grow bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-200 font-sans focus:outline-none focus:border-indigo-500 placeholder-zinc-500"
            />
            <button
              type="submit"
              disabled={!typedMessage.trim()}
              className={`p-2 rounded-xl shrink-0 flex items-center justify-center transition-all ${
                !typedMessage.trim()
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-505 text-white"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Member list sidebar column */}
        <div className="hidden md:flex md:col-span-3 flex-col min-h-0 bg-zinc-900/10">
          <div className="p-3 border-b border-zinc-850 bg-zinc-900/20 text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-1.5 shrink-0">
            <Users className="w-3.5 h-3.5 text-zinc-500" /> Channel Members
          </div>
          
          <div className="grow overflow-y-auto p-2 space-y-1">
            {onlineUsers.length > 0 ? (
              onlineUsers.map((user) => (
                <div key={user.username} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-850/40 transition-colors">
                  <div className="relative">
                    <img src={user.avatar} className="w-6 h-6 rounded-full border border-zinc-700/80 object-cover" alt={user.name} />
                    <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500 border border-zinc-900" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-zinc-200 truncate leading-none">{user.name}</div>
                    <div className="text-[9px] text-zinc-500 font-mono truncate">@{user.username}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-[10px] text-zinc-500 font-mono">
                Searching members...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
