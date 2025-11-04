import React from 'react';
import Navbar from './Navbar';
import Chatbot from '@/components/Chatbot/Chatbot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Chatbot />
    </div>
  );
};

export default Layout;