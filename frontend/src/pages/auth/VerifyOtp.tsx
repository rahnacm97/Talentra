import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';

interface VerifyOtpProps {
  purpose?: 'signup' | 'forgot-password';
}

const VerifyOtp: React.FC<VerifyOtpProps> = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiration, setOtpExpiration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [purpose, setPurpose] = useState<'signup' | 'forgot-password'>('signup');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    const purposeParam = searchParams.get('purpose') as 'signup' | 'forgot-password';
    
    if (emailParam && purposeParam) {
      setEmail(decodeURIComponent(emailParam));
      setPurpose(purposeParam || 'signup'); 
      setOtpExpiration(60);
    } else {
      toast.error('Invalid verification link');
      navigate(purposeParam === 'forgot-password' ? '/forgot-password' : '/signup');
    }
  }, [location, navigate]);

  useEffect(() => {
    let otpTimer: NodeJS.Timeout;
    if (otpExpiration && otpExpiration > 0) {
      otpTimer = setInterval(() => setOtpExpiration((prev) => (prev !== null ? prev - 1 : null)), 1000);
    } else if (otpExpiration === 0) {
      setOtpExpiration(null);
    }
    return () => clearInterval(otpTimer);
  }, [otpExpiration]);

  useEffect(() => {
    let resendTimer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      resendTimer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(resendTimer);
  }, [resendCooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const endpoint = '/auth/verify';
      //console.log('Sending to endpoint:', endpoint, 'with data:', { email, otp, purpose });
      await axios.post(endpoint, { email, otp, purpose });
      //console.log('Verification response:', response.data);
      toast.success(purpose === 'forgot-password' ? 'OTP verified successfully' : 'Email verified successfully');
      navigate(purpose === 'forgot-password' ? `/reset-password?email=${encodeURIComponent(email)}` : '/login');
    } catch (error: any) {
      toast.error(error.response?.data.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    try {
      const endpoint = purpose === 'forgot-password' ? '/auth/forgot-password' : '/auth/resend-otp';
      console.log('Resending OTP to:', endpoint, 'with email:', email);
      await axios.post(endpoint, { email });
      setResendCooldown(30);
      setOtpExpiration(60);
      setOtp('');
      toast.success(purpose === 'forgot-password' ? 'New OTP sent to your email' : 'New OTP sent for verification');
    } catch (error: any) {
      toast.error(error.response?.data.error || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="bg-white w-full p-4 flex justify-between items-center shadow-md">
        <PersonSearchRoundedIcon sx={{ color: '#3963eef7', fontSize: 40 }}/>
        <button onClick={() => navigate(purpose === 'forgot-password' ? '/forgot-password' : '/login')} className="text-blue-600 font-semibold hover:underline">
          Back
        </button>
      </header>
      <div className="bg-white p-8 rounded-lg shadow-md text-center w-full max-w-md mt-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{purpose === 'forgot-password' ? 'Verify OTP' : 'Email Verification'}</h2>
        <p className="text-gray-600 mb-6">
          {purpose === 'forgot-password'
            ? `Enter the OTP sent to ${email || 'your email'} to reset your password.`
            : `We've sent a verification code to ${email || 'emailaddress@gmail.com'} to verify your email address and activate your account.`}
        </p>
        {email ? (
          <form onSubmit={handleVerify} className="space-y-6">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit Verification Code"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify My Account →'}
            </button>
          </form>
        ) : (
          <p className="text-red-600">Loading verification data...</p>
        )}
        {email && (
          <div className="mt-6">
            <p className="text-gray-600">
              OTP will expire in {otpExpiration !== null ? `${otpExpiration}s` : '0s'}.{' '}
              {otpExpiration === 0 && <span className="text-red-600">OTP expired!</span>}
            </p>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              className="text-blue-600 mt-2 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Didn't receive any code? Resend {resendCooldown > 0 ? `(${resendCooldown}s)` : ''}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;