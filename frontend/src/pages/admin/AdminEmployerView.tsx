import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';
import { fetchEmployersStart, fetchEmployersFailure, verifyEmployer, rejectEmployer } from '../../store/slices/employerSlice';
import type { Employer } from '../../types/employer';

const EmployerView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!accessToken) {
      toast.error('Authentication token missing. Please sign in.');
      navigate('/admin-signin');
      return;
    }

    const fetchEmployer = async () => {
      dispatch(fetchEmployersStart());
      try {
        const response = await axios.get(`/admin/employers/${id}/view`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setEmployer(response.data.data);
        setLoading(false);
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Failed to fetch employer details';
        dispatch(fetchEmployersFailure(errorMessage));
        toast.error(errorMessage);
        setLoading(false);
      }
    };

    fetchEmployer();
  }, [id, accessToken, dispatch, navigate]);

  const handleVerify = async () => {
    try {
      await axios.patch(
        `/admin/employers/${id}/verify`,
        { verified: true },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      dispatch(verifyEmployer(id!));
      setEmployer((prev) => (prev ? { ...prev, verified: true, rejectionReason: undefined } : null));
      toast.success('Employer verified successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to verify employer';
      toast.error(errorMessage);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await axios.patch(
        `/admin/employers/${id}/reject`,
        { rejectionReason },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      dispatch(rejectEmployer({ id: id!, rejectionReason }));
      setEmployer((prev) => (prev ? { ...prev, verified: false, rejectionReason } : null));
      toast.success('Employer rejected and notification sent');
      setIsModalOpen(false);
      setRejectionReason('');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to reject employer';
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!employer) return <div className="p-6 text-center text-red-600">Employer not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Employer Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
            <p><strong>Name:</strong> {employer.name}</p>
            <p><strong>Email:</strong> {employer.email}</p>
            <p><strong>Phone Number:</strong> {employer.phoneNumber}</p>
            <p>
              <strong>Website:</strong>{' '}
              <a href={employer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {employer.website}
              </a>
            </p>
            <p><strong>Location:</strong> {employer.location}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Company Details</h2>
            <p><strong>Industry Type:</strong> {employer.industryType}</p>
            <p><strong>Organization Type:</strong> {employer.organizationType}</p>
            <p><strong>Registration ID:</strong> {employer.regId}</p>
            <p><strong>Team Size:</strong> {employer.teamSize}</p>
            <p><strong>Year Established:</strong> {new Date(employer.yearEstablishment).getFullYear()}</p>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Company Description</h2>
          <p>{employer.companyDescription}</p>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Status</h2>
          <p>
            <strong>Verification Status:</strong>{' '}
            <span style={{ color: employer.verified ? 'green' : 'red' }}>
              {employer.verified ? 'Verified' : 'Not Verified'}
            </span>
          </p>
          <p>
            <strong>Blocked Status:</strong>{' '}
            <span style={{ color: employer.blocked ? 'red' : 'green' }}>
              {employer.blocked ? 'Blocked' : 'Active'}
            </span>
          </p>
          {!employer.verified && (
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleVerify}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Verify
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          )}
          {employer.rejectionReason && (
            <p className="mt-2">
              <strong>Rejection Reason:</strong> {employer.rejectionReason}
            </p>
          )}
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Timestamps</h2>
          <p><strong>Registered At:</strong> {new Date(employer.createdAt).toLocaleString()}</p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate('/admin-employers')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Employers
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Reject Employer</h2>
            <textarea
              className="w-full p-2 border rounded mb-4"
              rows={4}
              placeholder="Enter reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerView;