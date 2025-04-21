import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not defined in environment variables');
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// export const createApplication = async (formData: FormData) => {
//   const response = await apiClient.post('/application/create', formData);
//   return response.data;
// };



export const createProject = async (data: any) => {
  const response = await apiClient.post('/upload', data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const askBot = async (data: any) => {
  const response = await apiClient.post('/chat', data);
  return response.data;
};


