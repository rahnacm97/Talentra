import React from 'react';
import { toast } from 'react-toastify';
import type { FormData, VerificationFormProps } from '../../types/employerVerification';


const useEmployerFormValidation = (initialData: FormData) => {
  const [formData, setFormData] = React.useState<FormData>(initialData);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormData, string>>>({});

  const validateField = (name: keyof FormData, value: string) => {
    switch (name) {
      case 'organizationType':
      case 'industryType':
      case 'teamSize':
      case 'companyDescription':
      case 'location':
        return value.trim() ? '' : `${name} is required`;
      case 'yearEstablishment':
        if (!value) return 'Year of Establishment is required';
        const selectedDate = new Date(value);
        const today = new Date();
        return selectedDate <= today ? '' : 'Year of Establishment cannot be a future date';
      case 'regId':
        if (!value) return 'Registration ID is required';
        const regIdRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{12}$/;
        return regIdRegex.test(value) ? '' : 'Registration ID must be 12 alphanumeric characters';
      case 'website':
        if (!value) return 'Website is required';
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return urlRegex.test(value) ? '' : 'Please enter a valid URL';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;
    setFormData({ ...formData, [fieldName]: value });
    setErrors({ ...errors, [fieldName]: validateField(fieldName, value) });
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { formData, errors, handleChange, setFormData, validateForm };
};

const VerificationForm: React.FC<VerificationFormProps> = ({ initialFormData, onSubmit }) => {
  const { formData, errors, handleChange, validateForm } = useEmployerFormValidation(initialFormData);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    } else {
      toast.error('Please fix the form errors before submitting.');
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block">Organization Type</label>
        <input
          type="text"
          name="organizationType"
          value={formData.organizationType}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.organizationType ? 'border-red-500' : ''}`}
        />
        {errors.organizationType && <p className="text-red-500 text-sm">{errors.organizationType}</p>}
      </div>

      <div>
        <label className="block">Industry Type</label>
        <input
          type="text"
          name="industryType"
          value={formData.industryType}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.industryType ? 'border-red-500' : ''}`}
        />
        {errors.industryType && <p className="text-red-500 text-sm">{errors.industryType}</p>}
      </div>

      <div>
        <label className="block">Team Size</label>
        <input
          type="text"
          name="teamSize"
          value={formData.teamSize}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.teamSize ? 'border-red-500' : ''}`}
        />
        {errors.teamSize && <p className="text-red-500 text-sm">{errors.teamSize}</p>}
      </div>

      <div>
        <label className="block">Year of Establishment</label>
        <input
          type="date"
          name="yearEstablishment"
          value={formData.yearEstablishment}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.yearEstablishment ? 'border-red-500' : ''}`}
        />
        {errors.yearEstablishment && <p className="text-red-500 text-sm">{errors.yearEstablishment}</p>}
      </div>

      <div>
        <label className="block">Registration ID</label>
        <input
          type="text"
          name="regId"
          value={formData.regId}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.regId ? 'border-red-500' : ''}`}
        />
        {errors.regId && <p className="text-red-500 text-sm">{errors.regId}</p>}
      </div>

      <div>
        <label className="block">Company Description</label>
        <input
          type="text"
          name="companyDescription"
          value={formData.companyDescription}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.companyDescription ? 'border-red-500' : ''}`}
        />
        {errors.companyDescription && <p className="text-red-500 text-sm">{errors.companyDescription}</p>}
      </div>

      <div>
        <label className="block">Website</label>
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.website ? 'border-red-500' : ''}`}
        />
        {errors.website && <p className="text-red-500 text-sm">{errors.website}</p>}
      </div>

      <div>
        <label className="block">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.location ? 'border-red-500' : ''}`}
        />
        {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default VerificationForm;