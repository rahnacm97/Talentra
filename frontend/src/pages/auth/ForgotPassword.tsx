import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import { toast } from 'react-toastify';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/forgot-password', { email });
      toast.success('OTP sent to your email');
      navigate(`/verify?email=${encodeURIComponent(email)}&purpose=forgot-password`);
    } catch (error: any) {
      toast.error(error.response?.data.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="bg-white w-full p-4 flex justify-between items-center shadow-md">
        <PersonSearchRoundedIcon sx={{ color: '#3963eef7', fontSize: 40 }}/>
        <button onClick={() => navigate('/login')} className="text-blue-600 font-semibold hover:underline">
          Back
        </button>
      </header>
      <div className="bg-white p-8 rounded-lg shadow-md text-center w-full max-w-md mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Forgot Password</h2>
        <p className="text-gray-600 mb-6">Enter your email address to receive an OTP for password reset.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;