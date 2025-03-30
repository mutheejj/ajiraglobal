import React from 'react';
import styled from '@emotion/styled';
import { ChatProvider } from '../context/ChatContext';
import ChatInterface from '../components/chat/ChatInterface';

const PageContainer = styled.div`
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

const PageTitle = styled.h2`
    color: #333;
    margin-bottom: 20px;
`;

const ChatPage = () => {
    return (
        <ChatProvider>
            <PageContainer>
                <PageTitle>Messages</PageTitle>
                <ChatInterface />
            </PageContainer>
        </ChatProvider>
    );
};

export default ChatPage;