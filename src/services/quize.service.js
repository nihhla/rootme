import api from './api';

export const getQuiz = async (readingId) => {
  const response = await api.get(
    `/reading/${readingId}/quiz`
  );

  return response.data;
};

export const submitQuiz = async (
  readingId,
  answers
) => {
  const response = await api.post(
    `/completion/${readingId}/complete`,
    {
      answers
    }
  );

  return response.data;
};