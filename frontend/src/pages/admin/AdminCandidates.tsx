import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCandidatesStart, fetchCandidatesSuccess, fetchCandidatesFailure, updateCandidateBlock, setCurrentPage } from '../../store/slices/candidateSlices';
import type { RootState } from '../../store/index';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Table from '../../components/admin/Table';
import Pagination from '../../components/admin/Pagination';
import Modal from '../../components/admin/Modal';
import SearchInput from '../../components/admin/SearchInput';
import type { Candidate } from '../../types/candidate';

const AdminCandidates: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { candidates, loading, error, currentPage, totalPages } = useSelector((state: RootState) => state.candidates);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = React.useState<string | null>(null);
  const [isBlockAction, setIsBlockAction] = React.useState<boolean | null>(null);

  useEffect(() => {
    if (!accessToken) {
      toast.error('Authentication token missing. Please sign in.');
      navigate('/admin-signin');
      return;
    }

    dispatch(fetchCandidatesStart());
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('/admin/candidates', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { page: currentPage, limit: 5, search: searchTerm },
        });
        const candidatesData = Array.isArray(response.data.data) ? response.data.data : [];
        dispatch(fetchCandidatesSuccess({ data: candidatesData, totalPages: Math.ceil(response.data.total / 5) }));
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch candidates';
        dispatch(fetchCandidatesFailure(errorMessage));
        toast.error(errorMessage);
      }
    };
    fetchCandidates();
  }, [dispatch, currentPage, searchTerm, accessToken, navigate]);

  const filteredCandidates: Candidate[] = Array.isArray(candidates) ? candidates : [];

  const paginate = (pageNumber: number) => dispatch(setCurrentPage(pageNumber));

  const handleBlockUnblock = async (id: string, blocked: boolean) => {
    try {
      if (!accessToken) throw new Error('No authentication token found.');
      const response = await axios.patch(`/admin/candidates/${id}/block`, { blocked: !blocked }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      dispatch(updateCandidateBlock({ id, blocked: !blocked }));
      toast.success(response.data.message || `Successfully ${!blocked ? 'blocked' : 'unblocked'} the candidate.`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update blocked status';
      toast.error(errorMessage);
    }
  };

  const openModal = (id: string, blocked: boolean) => {
    setSelectedCandidateId(id);
    setIsBlockAction(!blocked);
    setShowModal(true);
  };

  const handleApprove = async () => {
    if (selectedCandidateId && isBlockAction !== null) {
      await handleBlockUnblock(selectedCandidateId, !isBlockAction);
      setShowModal(false);
      setSelectedCandidateId(null);
      setIsBlockAction(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedCandidateId(null);
    setIsBlockAction(null);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Candidates</h1>
      <div className="mb-6 flex justify-between items-center">
        <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <Table<Candidate>
        data={filteredCandidates}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'resume', label: 'Resume' },
        ]}
        renderActions={(candidate) => (
          <div className="p-3">
            <button
              onClick={() => openModal(candidate._id, candidate.blocked)}
              className={`mr-2 px-2 py-1 rounded ${candidate.blocked ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
            >
              {candidate.blocked ? 'Unblock' : 'Block'}
            </button>
            <Link to={`/admin-candidates/view/${candidate._id}`} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
              View
            </Link>
          </div>
        )}
        indexOffset={(currentPage - 1) * 5}
      />
      <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
      <Modal isOpen={showModal} onApprove={handleApprove} onCancel={handleCancel} actionType={isBlockAction ? 'block' : 'unblock'} />
    </div>
  );
};

export default AdminCandidates;