import api from './api';

export const getReadingProgress = async () => {
  const response = await api.get('/reading');

  return response.data;
};

export const getReadingById = async (readingId) => {
  const response = await api.get(
    `/reading/${readingId}`
  );

  return response.data;
};

export const startReading = async (bookId) => {
  const response = await api.post(
    `/reading/${bookId}/start`
  );

  return response.data;
};

export const updateReadingProgress = async (
  readingId,
  pagesRead
) => {
  const response = await api.patch(
    `/reading/${readingId}/progress`,
    {
      pagesRead
    }
  );

  return response.data;
};

export const startReadingSession = async (bookId) => {
  const response = await api.post(
    `/reading/session/${bookId}`
  );

  return response.data;
};

export const endReadingSession = async (
  sessionId,
  pagesRead
) => {
  const response = await api.patch(
    `/reading/session/${sessionId}/end`,
    {
      pagesRead
    }
  );

  return response.data;
};

export const getReadingSessions = async () => {
  const response = await api.get(
    '/reading/sessions'
  );

  return response.data;
};