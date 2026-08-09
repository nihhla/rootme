import api from './api';

export const getReadingProgress = async () => {
  const response = await api.get('/reading');

  return response.data;
};