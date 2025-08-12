import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import axios from '../../axiosConfig';
import { loginSuccess } from '../../store/slices/authSlice';
import GoogleIcon from '@mui/icons-material/Google';

interface GoogleSignInButtonProps {
  propRole?: string; 
  isSignup?: boolean; 
  onSuccess?: (data: { userId: string; role: string; name: string; verified: boolean; accessToken: string; refreshToken: string }) => void; // Optional callback
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ propRole, isSignup = false, onSuccess }) => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'employer' | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (!selectedRole) {
        toast.error('Please select a role before signing in with Google');
        setShowRoleModal(true);
        return;
      }

      setGoogleLoading(true);
      try {
        const endpoint = isSignup ? '/auth/google-signup' : '/auth/google-signin';
        const res = await axios.post(endpoint, {
          idToken: tokenResponse.code,
          role: selectedRole,
        });

        const { accessToken, refreshToken, role: userRole, name, userId, verified } = isSignup ? res.data.data : res.data;
        dispatch(loginSuccess({ user: { userId, role: userRole, name, verified }, accessToken, refreshToken }));
        toast.success(`Google ${isSignup ? 'Sign-Up' : 'Sign-In'} successful`);

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('role', userRole);
        if (name) localStorage.setItem('fullName', name);

        onSuccess?.({ userId, role: userRole, name, verified, accessToken, refreshToken });

        if (isSignup) {
          navigate(`/verify?email=${encodeURIComponent(res.data.data.email || '')}`);
        } else {
          navigate(userRole === 'admin' ? '/admin-dashboard' : '/', { replace: true });
        }
      } catch (err: any) {
        //console.error(`Google ${isSignup ? 'Sign-Up' : 'Sign-In'} error:`, err.response?.data || err.message);
        toast.error(err.response?.data?.message || `Google ${isSignup ? 'Sign-Up' : 'Sign-In'} failed. Please try again.`);
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error(`Google ${isSignup ? 'Sign-Up' : 'Sign-In'} error:`, error);
      toast.error(`Google ${isSignup ? 'Sign-Up' : 'Sign-In'} failed. Please check your network or configuration.`);
      setGoogleLoading(false);
    },
    flow: 'auth-code',
    scope: 'email profile openid',
  });

  const handleGoogleSignIn = () => {
    if (propRole && ['candidate', 'employer'].includes(propRole)) {
      setSelectedRole(propRole as 'candidate' | 'employer');
      loginWithGoogle();
    } else {
      setShowRoleModal(true);
    }
  };

  const handleRoleSelect = (role: 'candidate' | 'employer') => {
    setSelectedRole(role);
    setShowRoleModal(false);
    loginWithGoogle();
  };

  return (
    <>
      <button
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full bg-white border border-gray-300 p-3 rounded-lg hover:bg-gray-100 flex items-center justify-center disabled:opacity-50"
      >
        {googleLoading ? (
          `Loading Google ${isSignup ? 'Sign-Up' : 'Sign-In'}...`
        ) : (
          <>
            <GoogleIcon/>
            {isSignup ? 'Sign up with Google' : 'Sign in with Google'}
          </>
        )}
      </button>
      {showRoleModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Select Your Role</h3>
            <button
              onClick={() => handleRoleSelect('candidate')}
              className="w-full bg-blue-600 text-white p-3 rounded-lg mb-2 hover:bg-blue-700 transition duration-200"
            >
              Candidate
            </button>
            <button
              onClick={() => handleRoleSelect('employer')}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Employer
            </button>
            <button
              onClick={() => setShowRoleModal(false)}
              className="w-full bg-gray-300 text-gray-800 p-3 rounded-lg mt-2 hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleSignInButton;