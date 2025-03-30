import React from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import styled from '@emotion/styled';

const ConversationContainer = styled.div`
    width: 300px;
    height: 100%;
    border-right: 1px solid #e0e0e0;
    overflow-y: auto;
`;

const ConversationItem = styled.div`
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${props => props.active ? '#f5f5f5' : 'white'};
    &:hover {
        background-color: #f8f8f8;
    }
`;

const UserInfo = styled.div`
    flex: 1;
`;

const UserName = styled.h4`
    margin: 0;
    font-size: 16px;
    color: #333;
`;

const LastMessage = styled.p`
    margin: 5px 0 0;
    font-size: 14px;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
`;

const UnreadBadge = styled.span`
    background-color: #007bff;
    color: white;
    border-radius: 50%;
    padding: 2px 8px;
    font-size: 12px;
    margin-left: 10px;
`;

const ConversationList = () => {
    const { conversations, currentChat, setCurrentChat, unreadMessages } = useChat();
    const { user } = useAuth();

    const handleSelectConversation = (conversation) => {
        setCurrentChat(conversation);
    };

    const getOtherParticipant = (conversation) => {
        const otherUser = conversation.participants.find(p => p.id !== user.id);
        return otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'Unknown User';
    };

    return (
        <ConversationContainer>
            {conversations.map((conversation) => (
                <ConversationItem
                    key={conversation.id}
                    active={currentChat?.id === conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                >
                    <UserInfo>
                        <UserName>{getOtherParticipant(conversation)}</UserName>
                        <LastMessage>
                            {conversation.last_message?.content || 'No messages yet'}
                        </LastMessage>
                    </UserInfo>
                    {unreadMessages[conversation.id] > 0 && (
                        <UnreadBadge>{unreadMessages[conversation.id]}</UnreadBadge>
                    )}
                </ConversationItem>
            ))}
        </ConversationContainer>
    );
};

export default ConversationList;