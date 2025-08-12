import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import EmployerHeader from '../../layout/employer/EmployerHeader';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const WaitVerificationPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('User state in WaitVerificationPage:', user);
  }, [user]);

  const handleReapply = () => {
    navigate('/verification');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <EmployerHeader />
      <div className="container mx-auto p-4 text-center">
        {user && user.role === 'employer' && typeof user.verified === 'boolean' && (
          <>
            {user.verified ? (
              <div className="flex flex-col items-center justify-center mt-52">
                <CheckCircleIcon sx={{ color: '#22c55e', fontSize: 60 }} />
                <h2 className="text-2xl font-bold text-green-500 mt-4">
                  Your account has been verified by the admin
                </h2>
              </div>
            ) : user.rejectionReason ? (
              <div className="flex flex-col items-center justify-center mt-52">
                <ErrorOutlineIcon sx={{ color: '#ef4444', fontSize: 60 }} />
                <h2 className="text-2xl font-bold text-red-500 mt-4">Account Rejected</h2>
                <p className="text-gray-600 mb-4">
                  Reason: {user.rejectionReason || 'No reason provided'}
                </p>
                <button
                  onClick={handleReapply}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Reapply
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-52">
                <h2 className="text-2xl font-bold mb-4">Waiting for Admin Verification</h2>
                <p>Your details have been submitted. Please wait for admin approval.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WaitVerificationPage;