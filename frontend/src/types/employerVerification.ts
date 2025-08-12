export interface FormData {
  organizationType: string;
  industryType: string;
  teamSize: string;
  yearEstablishment: string;
  regId: string;
  companyDescription: string;
  website: string;
  location: string;
}

export interface VerificationFormProps {
  initialFormData: FormData;
  onSubmit: (formData: FormData) => Promise<void>;
}