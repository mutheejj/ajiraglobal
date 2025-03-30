import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useChat } from '../../context/ChatContext';
import ConversationList from './ConversationList';
import ChatMessage from './ChatMessage';

const ChatContainer = styled.div`
    display: flex;
    height: 80vh;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChatMain = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const ChatHeader = styled.div`
    padding: 15px;
    border-bottom: 1px solid #e0e0e0;
    background-color: #f8f9fa;
`;

const ChatMessages = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background-color: #ffffff;
`;

const InputContainer = styled.div`
    padding: 15px;
    border-top: 1px solid #e0e0e0;
    background-color: #f8f9fa;
    display: flex;
    gap: 10px;
`;

const MessageInput = styled.textarea`
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: none;
    font-family: inherit;
    &:focus {
        outline: none;
        border-color: #007bff;
    }
`;

const SendButton = styled.button`
    padding: 0 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    &:hover {
        background-color: #0056b3;
    }
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const EmptyStateMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
    text-align: center;
    padding: 20px;
`;

const ChatInterface = () => {
    const {
        currentChat,
        messages,
        sendMessage,
        sendTypingStatus,
        isTyping,
        markConversationAsRead
    } = useChat();
    const [messageInput, setMessageInput] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (currentChat) {
            markConversationAsRead(currentChat.id);
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [currentChat, messages]);

    const handleSendMessage = () => {
        if (messageInput.trim() && currentChat) {
            sendMessage(currentChat.id, messageInput.trim());
            setMessageInput('');
            clearTimeout(typingTimeout);
            sendTypingStatus(currentChat.id, false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleInputChange = (e) => {
        setMessageInput(e.target.value);
        if (currentChat) {
            clearTimeout(typingTimeout);
            sendTypingStatus(currentChat.id, true);
            const timeout = setTimeout(() => {
                sendTypingStatus(currentChat.id, false);
            }, 1000);
            setTypingTimeout(timeout);
        }
    };

    return (
        <ChatContainer>
            <ConversationList />
            <ChatMain>
                {currentChat ? (
                    <>
                        <ChatHeader>
                            <h3>{currentChat.title || 'Chat'}</h3>
                        </ChatHeader>
                        <ChatMessages>
                            {messages.map((message, index) => (
                                <ChatMessage
                                    key={message.id || index}
                                    message={message}
                                />
                            ))}
                            {isTyping && <ChatMessage isTyping={true} />}
                            <div ref={messagesEndRef} />
                        </ChatMessages>
                        <InputContainer>
                            <MessageInput
                                value={messageInput}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                rows={2}
                            />
                            <SendButton
                                onClick={handleSendMessage}
                                disabled={!messageInput.trim()}
                            >
                                Send
                            </SendButton>
                        </InputContainer>
                    </>
                ) : (
                    <EmptyStateMessage>
                        <h3>Welcome to Chat</h3>
                        <p>Select a conversation to start messaging</p>
                    </EmptyStateMessage>
                )}
            </ChatMain>
        </ChatContainer>
    );
};

export default ChatInterface;