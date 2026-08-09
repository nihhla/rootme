import api from './api';

export const getBooks = async (params = {}) => {
  const response = await api.get('/books', {
    params
  });

  return response.data;
};

export const getBookById = async (bookId) => {
  const response = await api.get(
    `/books/${bookId}`
  );

  return response.data;
};