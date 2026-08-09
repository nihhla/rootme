import api from './api';

export const getBookReviews = async (bookId) => {
  const response = await api.get(
    `/reviews/book/${bookId}`
  );

  return response.data;
};

export const createReview = async ({
  bookId,
  rating,
  comment
}) => {
  const response = await api.post(
    '/reviews',
    {
      bookId,
      rating,
      comment
    }
  );

  return response.data;
};