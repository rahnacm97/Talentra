import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import dummyProfileImage from '../../assets/dummy-profile.jpg';
import type { RootState } from '../../store/index';
import axios from '../../axiosConfig';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && accessToken) {
        await axios.post(
          '/admin/logout',
          { refreshToken },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
    
      const roleToCheck = user?.role || localStorage.getItem('role') || '';
      console.log('Logout role check:', roleToCheck);
      const redirectPath = roleToCheck === 'admin' ? '/admin-signin' : '/login';
      console.log('Navigating to:', redirectPath);
      navigate(redirectPath, { replace: true }); 
      dispatch(logout()); 
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-[#c6e1fc] text-white p-4 shadow-md">
      <div className="flex items-center">
          <PersonSearchRoundedIcon sx={{ color: 'black', fontSize: 40 }}/>
          <h1 className="text-xl font-bold text-black">Talentra</h1>
      <div className="container mx-auto flex justify-between items-center"> 
        </div>       
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <div
                onClick={toggleDropdown}
                className="flex items-center cursor-pointer"
              >
                <img
                  src={dummyProfileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-black text-xl">{user.name || 'Admin'}</span>
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                  <ul className="py-1">
                    <li>
                      <Link
                        to="/admin-profile"
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
            </div>
          ) : (
            <Link to="/admin-signin" className="text-black hover:underline">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;