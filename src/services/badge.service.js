import api from './api';

export const getBadges = async () => {
  const response = await api.get('/badges');

  return response.data;
};

export const getMyBadges = async () => {
  const response = await api.get('/badges/my');

  return response.data;
};