import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginFailure, resetLoading, loginSuccess } from '../../store/slices/authSlice';
import type { RootState } from '../../store/index';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoogleSignInButton from './GoogleSignInButton';
import ScreenLeft from '../../components/common/Auth';

interface LoginProps {
  role?: string;
}

const Login: React.FC<LoginProps> = ({ role: propRole }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetLoading());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = 'Email Address is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Email must be in a valid format (e.g., example@domain.com)';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(loginStart());
    try {
      const response = await axios.post('/auth/login', formData);
      console.log('Login response:', response.data);
      const verified = response.data.data.verified ?? false;
      const { accessToken, refreshToken, role, name, userId, rejectionReason} = response.data.data;
      dispatch(loginSuccess({ user: { userId, role, name, verified, rejectionReason}, accessToken, refreshToken }));
      toast.success('Login successful');
      navigate(role === 'admin' ? '/admin-dashboard' : '/', { replace: true });
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('role', role);
      if (name) localStorage.setItem('fullName', name);
    } catch (err: any) {
      console.error('Login error details:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      if (err.response?.status === 403 && errorMessage.includes('blocked')) {
        toast.error('Your account has been blocked by the admin');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className="flex h-screen">
      
         <ScreenLeft/>

     
      <div className="w-1/2 bg-gray-50 flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign in</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="mb-6 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10 ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-gray-600">or</p>
            <div className="mt-2">
              <GoogleSignInButton propRole={propRole} />
            </div>
          </div>
          <p className="text-center mt-4 text-gray-600">
            Don’t have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link> | 
            <Link to="/" className="text-blue-600 hover:underline ml-1">Back To Home</Link>
          </p>
          <p className="text-center mt-2 text-gray-600">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;