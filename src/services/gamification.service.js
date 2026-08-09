import api from './api';

export const getGamificationStats = async () => {
  const response = await api.get(
    '/gamification/stats'
  );

  return response.data;
};

export const getXPTransactions = async () => {
  const response = await api.get(
    '/gamification/transactions'
  );

  return response.data;
};