import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import type { RootState } from '../../store/index';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Tooltip from '@mui/material/Tooltip'; // Import Tooltip
import dummyProfileImage from '../../assets/dummy-profile.jpg';

const EmployerHeader: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleVerification = () => {
    if (user && !user.verified) {
      navigate('/verification');
    }
  };

  return (
    <header className="bg-[#c6e1fc] shadow-md p-4 flex justify-between fixed items-center w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <PersonSearchRoundedIcon sx={{ color: 'black', fontSize: 40 }} />
          <h1 className="text-xl font-bold text-black">Talentra</h1>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/">Dashboard</Link></li>
            {user && user.role === 'employer' && (
              <li className="relative">
                <div
                  onClick={toggleDropdown}
                  className="flex items-center cursor-pointer"
                >
                  <img
                    src={dummyProfileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-black-600">{user.name || 'Employer'}</span>
                  {user && (
                    <Tooltip
                      title={user.verified ? 'Verified' : 'Account not verified. Please complete verification.'}
                      arrow
                      placement="bottom"
                    >
                      <span
                        onClick={handleVerification}
                        className={`ml-2 flex items-center justify-center w-5 h-5 rounded-full ${
                          user.verified
                            ? 'bg-[#0095f6] cursor-default'
                            : 'bg-red-500 hover:bg-red-600 cursor-pointer'
                        }`}
                      >
                        {user.verified ? (
                          <CheckCircleIcon sx={{ color: 'white', fontSize: 16 }} />
                        ) : (
                          <ErrorOutlineIcon sx={{ color: 'white', fontSize: 16 }} />
                        )}
                      </span>
                    </Tooltip>
                  )}
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                    <ul className="py-1">
                      <li>
                        <Link
                          to="/employer-profile"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            )}
            {!user && (
              <>
                <li><Link to="/login" className="hover:underline">Sign In</Link></li>
                <li><Link to="/signup" className="hover:underline">Sign Up</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default EmployerHeader;