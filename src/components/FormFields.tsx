import { useState } from 'react';
import { UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface FormData {
  name: string;
  email: string;
}

interface FormFieldsProps {
  onSubmit: (data: FormData) => void;
  buttonText: string;
}

const FormFields = ({ onSubmit, buttonText }: FormFieldsProps) => {
  const [localFormData, setLocalFormData] = useState<FormData>({ name: '', email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(localFormData);
    setLocalFormData({ name: '', email: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label 
          htmlFor="name" 
          className="block text-sm font-['DM_Sans'] font-medium text-orange-800 mb-2"
        >
          Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-orange-400" />
          </div>
          <input
            type="text"
            id="name"
            value={localFormData.name}
            onChange={(e) => setLocalFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full pl-10 pr-4 py-2.5 font-['DM_Sans'] text-orange-900 bg-white/50 border border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 placeholder:text-orange-300"
            placeholder="Enter your name"
            required
          />
        </div>
      </div>

      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-['DM_Sans'] font-medium text-orange-800 mb-2"
        >
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <EnvelopeIcon className="h-5 w-5 text-orange-400" />
          </div>
          <input
            type="email"
            id="email"
            value={localFormData.email}
            onChange={(e) => setLocalFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full pl-10 pr-4 py-2.5 font-['DM_Sans'] text-orange-900 bg-white/50 border border-orange-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 placeholder:text-orange-300"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white font-['DM_Sans'] font-bold py-2.5 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-rose-200/50 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
};

export default FormFields; 