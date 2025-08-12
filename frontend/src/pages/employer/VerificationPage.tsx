import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../axiosConfig';
import { toast } from 'react-toastify';
import { updateEmployer } from '../../store/slices/employerSlice';
import type { RootState } from '../../store/index';
import EmployerHeader from '../../layout/employer/EmployerHeader';
import EmployerFooter from '../../layout/employer/EmployerFooter';
import VerificationForm from '../../components/employer/VerificationForm';


const VerificationPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { employers } = useSelector((state: RootState) => state.employers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentEmployer = employers.find((e) => e._id === user?.userId);

  const initialFormData = {
    organizationType: currentEmployer?.organizationType || '',
    industryType: currentEmployer?.industryType || '',
    teamSize: currentEmployer?.teamSize || '',
    yearEstablishment: currentEmployer?.yearEstablishment
      ? new Date(currentEmployer.yearEstablishment).toISOString().split('T')[0]
      : '',
    regId: currentEmployer?.regId || '',
    companyDescription: currentEmployer?.companyDescription || '',
    website: currentEmployer?.website || '',
    location: currentEmployer?.location || '',
  };

  const handleSubmit = async (formData: typeof initialFormData) => {
    if (user?.userId) {
      try {
        const updatedData = {
          ...formData,
          yearEstablishment: new Date(formData.yearEstablishment),
          verified: false,
        };
        await axios.put('/employer/verification', updatedData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        dispatch(updateEmployer({ id: user.userId, updateData: updatedData }));
        toast.success('Verification data submitted successfully!');
        navigate('/wait-verification');
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'Failed to submit verification data. Please try again.'
        );
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <EmployerHeader />
      <div className="mx-auto p-4 max-w-4xl">
        <h2 className="text-2xl font-bold mb-4 mt-16">Enter Founding Information</h2>
        <VerificationForm initialFormData={initialFormData} onSubmit={handleSubmit} />
      </div>
      <EmployerFooter />
    </div>
  );
};

export default VerificationPage;