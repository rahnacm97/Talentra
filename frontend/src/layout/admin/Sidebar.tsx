import React from 'react';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WorkIcon from '@mui/icons-material/Work';
import SettingsIcon from '@mui/icons-material/Settings';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#99b2cb] text-black text-base p-4">
      <h2 className="text-lg font-semibold mb-4">Admin Menu</h2>
      <ul className="space-y-2">
        <li><Link to="/admin-dashboard" className="block p-2 hover:bg-gray-500 rounded"><DashboardIcon sx={{marginRight: 2}}/>Dashboard</Link></li>
        <li><Link to="/admin-candidates" className="block p-2 hover:bg-gray-500 rounded"><PersonIcon sx={{marginRight: 2}}/>Manage Candidates</Link></li>
        <li><Link to="/admin-employers" className="block p-2 hover:bg-gray-500 rounded"><AccountBoxIcon sx={{marginRight: 2}}/>Manage Employers</Link></li>
        <li><Link to="/admin-jobs" className="block p-2 hover:bg-gray-500 rounded"><WorkIcon sx={{marginRight: 2}}/>Manage Jobs</Link></li>
        <li><Link to="/admin-settings" className="block p-2 hover:bg-gray-500 rounded"><SettingsIcon sx={{marginRight: 2}}/>Settings</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;