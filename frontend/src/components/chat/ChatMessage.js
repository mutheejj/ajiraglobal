import React from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../../context/AuthContext';

const MessageContainer = styled.div`
    display: flex;
    flex-direction: ${props => props.isSender ? 'row-reverse' : 'row'};
    margin: 10px;
    gap: 10px;
`;

const MessageBubble = styled.div`
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 16px;
    background-color: ${props => props.isSender ? '#007bff' : '#f0f0f0'};
    color: ${props => props.isSender ? 'white' : '#333'};
    position: relative;
    word-wrap: break-word;
`;

const MessageTime = styled.span`
    font-size: 12px;
    color: ${props => props.isSender ? 'rgba(255, 255, 255, 0.7)' : '#666'};
    display: block;
    margin-top: 4px;
`;

const TypingIndicator = styled.div`
    padding: 12px 16px;
    border-radius: 16px;
    background-color: #f0f0f0;
    color: #666;
    font-style: italic;
`;

const ChatMessage = ({ message, isTyping }) => {
    const { user } = useAuth();
    const isSender = message?.sender_id === user?.id;

    if (isTyping) {
        return (
            <MessageContainer>
                <TypingIndicator>Typing...</TypingIndicator>
            </MessageContainer>
        );
    }

    if (!message) return null;

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <MessageContainer isSender={isSender}>
            <MessageBubble isSender={isSender}>
                {message.content}
                <MessageTime isSender={isSender}>
                    {formatTime(message.timestamp)}
                </MessageTime>
            </MessageBubble>
        </MessageContainer>
    );
};

export default ChatMessage;