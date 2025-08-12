import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginFailure, loginSuccess } from '../../store/slices/authSlice';
import type { RootState } from '../../store/index';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';
import ScreenLeft from '../../components/common/Auth';

const AdminSignIn: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user, accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (accessToken && user?.role === 'admin') {
      navigate('/admin-dashboard');
    }
  }, [accessToken, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = 'Admin Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Email must be in a valid format (e.g., admin@domain.com)';
    if (!formData.password.trim()) newErrors.password = 'Admin Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(loginStart());
    try {
      const response = await axios.post('/admin/signin', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      const { token: accessToken, refreshToken, role, name, userId, verified } = response.data.data;
      if (role !== 'admin') {
        throw new Error('This endpoint is for admin login only');
      }
      dispatch(loginSuccess({ user: { userId, role, name, verified }, accessToken, refreshToken }));
      toast.success('Admin login successful');
      navigate('/admin-dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Admin login failed. Please check your credentials.';
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex h-screen">
      <ScreenLeft/>
      <div className="w-1/2 bg-gray-50 flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Admin Email"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.email ? 'border-red-500' : ''}`}
                disabled={loading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-6 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Admin Password"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243m-13.583-5.171a6 6 0 0112 0m0 0a6 6 0 01-12 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 rounded-lg transition duration-200 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center mt-4 text-gray-600">
            Back to <Link to="/login" className="text-blue-600 hover:underline">User Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;