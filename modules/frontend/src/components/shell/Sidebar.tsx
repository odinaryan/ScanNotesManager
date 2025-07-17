import React from 'react';
import ScanList from '../ScanList';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
      <ScanList />
    </aside>
  );
};

export default Sidebar; 