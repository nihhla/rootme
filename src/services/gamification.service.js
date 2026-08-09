import api from './api';

export const getGamificationStats = async () => {
  const response = await api.get('/gamification');

  return response.data;
};