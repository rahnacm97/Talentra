import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link,useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import dummyProfileImage from '../../assets/dummy-profile.jpg'; 
import type { RootState } from '../../store/index';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
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

  return (
    <header className="bg-[#c6e1fc] shadow-md p-4 flex justify-between fixed items-center w-full z-50">
      <div className="flex items-center">
        <PersonSearchRoundedIcon sx={{ color: 'black', fontSize: 40 }}/>
        <h1 className="text-xl font-bold text-black">Talentra</h1>
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
              <span className="text-black">{user.name || 'Candidate'}</span>
            </div>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <ul className="py-1">
                  <li>
                    <Link
                      to="/profile"
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
        ) : null}
      </div>
    </header>
  );
};

export default Header;