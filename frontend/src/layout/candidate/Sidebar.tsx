import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen fixed top-16 left-0 p-4 transition-all duration-300 z-40">
      <nav className="space-y-4">
        <Link
          to="/candidate/dashboard"
          className="block py-2 px-4 rounded hover:bg-gray-700"
        >
          Dashboard
        </Link>
        <Link
          to="/candidate/profile"
          className="block py-2 px-4 rounded hover:bg-gray-700"
        >
          Profile
        </Link>
        <Link
          to="/candidate/jobs"
          className="block py-2 px-4 rounded hover:bg-gray-700"
        >
          Jobs
        </Link>
        <Link
          to="/candidate/applications"
          className="block py-2 px-4 rounded hover:bg-gray-700"
        >
          Applications
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;