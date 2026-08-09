import api from './api';

export const getChallenges = async () => {
  const response = await api.get('/challenges');

  return response.data;
};

export const getMyChallenges = async () => {
  const response = await api.get('/challenges/my');

  return response.data;
};