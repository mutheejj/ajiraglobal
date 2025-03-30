import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
    return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [unreadMessages, setUnreadMessages] = useState({});
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (user) {
            // Initialize WebSocket connection
            const ws = new WebSocket(`ws://localhost:8000/ws/chat/${user.id}/`);

            ws.onopen = () => {
                console.log('WebSocket Connected');
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                switch (data.type) {
                    case 'chat.message':
                        setMessages(prev => [...prev, data.message]);
                        if (data.message.sender_id !== user.id) {
                            setUnreadMessages(prev => ({
                                ...prev,
                                [data.message.conversation_id]: (prev[data.message.conversation_id] || 0) + 1
                            }));
                        }
                        break;
                    case 'chat.typing':
                        setIsTyping(data.is_typing);
                        break;
                    case 'chat.conversation_list':
                        setConversations(data.conversations);
                        break;
                    default:
                        break;
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };

            ws.onclose = () => {
                console.log('WebSocket Disconnected');
            };

            setSocket(ws);

            return () => {
                if (ws) ws.close();
            };
        }
    }, [user]);

    const sendMessage = (conversationId, content) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'chat.message',
                conversation_id: conversationId,
                content: content
            }));
        }
    };

    const sendTypingStatus = (conversationId, isTyping) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'chat.typing',
                conversation_id: conversationId,
                is_typing: isTyping
            }));
        }
    };

    const markConversationAsRead = (conversationId) => {
        setUnreadMessages(prev => ({
            ...prev,
            [conversationId]: 0
        }));
    };

    const value = {
        conversations,
        currentChat,
        setCurrentChat,
        messages,
        sendMessage,
        sendTypingStatus,
        isTyping,
        unreadMessages,
        markConversationAsRead
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};