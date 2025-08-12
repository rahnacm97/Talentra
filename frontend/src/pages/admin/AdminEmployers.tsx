import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployersStart, fetchEmployersSuccess, fetchEmployersFailure, updateEmployerBlock, setCurrentPage } from '../../store/slices/employerSlice';
import type { RootState } from '../../store/index';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Table from '../../components/admin/Table';
import Pagination from '../../components/admin/Pagination';
import Modal from '../../components/admin/Modal';
import SearchInput from '../../components/admin/SearchInput';

const AdminEmployers: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employers, loading, error, currentPage, totalPages } = useSelector((state: RootState) => state.employers);
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [selectedEmployerId, setSelectedEmployerId] = React.useState<string | null>(null);
  const [isBlockAction, setIsBlockAction] = React.useState<boolean | null>(null);

  useEffect(() => {
    if (!accessToken) {
      toast.error('Authentication token missing. Please sign in.');
      navigate('/admin-signin');
      return;
    }

    dispatch(fetchEmployersStart());
    const fetchEmployers = async () => {
      try {
        const response = await axios.get('/admin/employers', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { page: currentPage, limit: 5, search: searchTerm },
        });
        const { data, meta } = response.data;
        console.log('API response:', response.data);
        console.log('Meta details:', JSON.stringify(meta, null, 2));
        if (!Array.isArray(data)) {
          throw new Error('Expected data to be an array of employers');
        }
        if (!meta || typeof meta.total !== 'number') {
          console.warn('Meta is not in expected format:', meta);
          throw new Error('Invalid meta data format');
        }
        dispatch(fetchEmployersSuccess({ data, totalPages: Math.ceil(meta.total / 5) }));
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch employers';
        dispatch(fetchEmployersFailure(errorMessage));
        toast.error(errorMessage);
      }
    };
    fetchEmployers();
  }, [dispatch, currentPage, searchTerm, accessToken, navigate]);

  // Debugging: Log employers state
  console.log('Employers state:', employers);

  const filteredEmployers = employers;

  const paginate = (pageNumber: number) => dispatch(setCurrentPage(pageNumber));

  const handleBlockUnblock = async (id: string, blocked: boolean) => {
    try {
      if (!accessToken) throw new Error('No authentication token found.');
      await axios.patch(`/admin/employers/${id}/block`, { blocked: !blocked }, { headers: { Authorization: `Bearer ${accessToken}` } });
      dispatch(updateEmployerBlock({ id, blocked: !blocked }));
      toast.success(`Successfully ${!blocked ? 'blocked' : 'unblocked'} the employer.`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update blocked status';
      toast.error(errorMessage);
    }
  };

  const openModal = (id: string, blocked: boolean) => {
    setSelectedEmployerId(id);
    setIsBlockAction(!blocked);
    setShowModal(true);
  };

  const handleApprove = async () => {
    if (selectedEmployerId && isBlockAction !== null) {
      await handleBlockUnblock(selectedEmployerId, !isBlockAction);
      setShowModal(false);
      setSelectedEmployerId(null);
      setIsBlockAction(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedEmployerId(null);
    setIsBlockAction(null);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Employers</h1>
      <div className="mb-6 flex justify-between items-center">
        <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      <Table
        data={filteredEmployers}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          {
            key: 'verified',
            label: 'Status',
            render: (value: boolean) => (
              <span className={value ? 'text-green-600' : 'text-red-600'}>
                {value ? 'Verified' : 'Not Verified'}
              </span>
            ),
          },
        ]}
        renderActions={(employer) => (
          <div className="p-3">
            <button
              onClick={() => openModal(employer._id, employer.blocked)}
              className={`mr-2 px-2 py-1 rounded ${employer.blocked ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
            >
              {employer.blocked ? 'Unblock' : 'Block'}
            </button>
            <Link to={`/admin/employers/${employer._id}/view`} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
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

export default AdminEmployers;