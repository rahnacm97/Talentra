import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';
import { socketService } from '../../services/socket';
import type { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';

const SocketSetup: React.FC = () => {
  const { user, accessToken, refreshToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.userId && accessToken && user.role !== 'admin') {
      socketService.connect(user.userId, accessToken);

      socketService.onUserBlocked((data) => {
        toast.error(data.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        dispatch(logout());
        localStorage.clear();
        socketService.disconnect();
        navigate('/login', { replace: true });
      });

      socketService.onEmployerVerified(() => {
        if (user && user.role === 'employer') {
          toast.success('Your employer account has been verified!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
          });
          dispatch(
            loginSuccess({
              user: { ...user, verified: true, rejectionReason: undefined },
              accessToken: accessToken!,
              refreshToken: refreshToken!,
            })
          );
        }
      });

      socketService.onEmployerRejected((data) => {
        if (user && user.role === 'employer') {
          toast.error(`Your employer account verification was rejected. Reason: ${data.rejectionReason || 'No reason provided'}`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
          });
          dispatch(
            loginSuccess({
              user: { ...user, verified: false, rejectionReason: data.rejectionReason },
              accessToken: accessToken!,
              refreshToken: refreshToken!,
            })
          );
        }
      });

      socketService.onConnectError((error) => {
        console.error('WebSocket connection error:', error);
      });
    }

    return () => {
      socketService.offUserBlocked();
      socketService.offEmployerVerified();
      socketService.offEmployerRejected();
      socketService.disconnect();
    };
  }, [user, accessToken, refreshToken, dispatch, navigate]);

  return null;
};

export default SocketSetup;
