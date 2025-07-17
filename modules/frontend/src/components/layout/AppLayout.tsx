import React from 'react';
import type { ReactNode } from 'react';
import Header from '../shell/Header';
import Sidebar from '../shell/Sidebar';
import MainContent from '../shell/MainContent';
import ErrorBanner from '../shell/ErrorBanner';

interface AppLayoutProps {
  children?: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ErrorBanner />
      <div className="flex h-[calc(100vh-80px)]">
        <Sidebar />
        <MainContent />
      </div>
      {children}
    </div>
  );
};

export default AppLayout; 