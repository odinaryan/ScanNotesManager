import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Scan Notes Manager
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage and review patient scan notes
        </p>
      </div>
    </header>
  );
};

export default Header; 