import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import './ChatDashboard.scss';

const fetchMessages = async () => {
    const res = await fetch('http://127.0.0.1:8000/api/messages');
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
};

const ChatDashboard = () => {
    const { data: initialMessages, isLoading, isError } = useQuery({
        queryKey: ['messages'],
        queryFn: fetchMessages,
    });
    const [messages, setMessages] = useState([]);
    const [typingUser, setTypingUser] = useState(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (initialMessages) {
            setMessages(initialMessages);
        }
    }, [initialMessages]);

    useEffect(() => {
        const varOcg = new WebSocket('ws://127.0.0.1:8000/ws/chat');
        varOcg.onmessage = (event) => {
            const varFiltersCg = JSON.parse(event.data);
            if (varFiltersCg.type === 'message') {
                setMessages(prevMessages => [...prevMessages, varFiltersCg]);
                setTypingUser(null);
            } else if (varFiltersCg.type === 'typing') {
                setTypingUser(varFiltersCg.user);
            }
        };

        return () => {
            varOcg.close();
        };
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (isLoading) return <div>Loading messages...</div>;
    if (isError) return <div>Error fetching messages.</div>;

    return (
        <div className="chat-dashboard">
            <div className="message-list">
                {messages.map((msg, index) => (
                    <div key={msg.id || index} className="message">
                        <strong>{msg.user}:</strong> {msg.message}
                    </div>
                ))}
                {typingUser && (
                    <div className="typing-indicator">
                        <em>{typingUser} is typing...</em>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="input-box">
                <input type="text" placeholder="Type a message..." />
                <button>Send</button>
            </div>
        </div>
    );
};

export default ChatDashboard;