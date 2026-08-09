import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import PageHeader from '../../components/layout/PageHeader';
import { getBookById } from '../../services/book.service';
import { getReadingProgress, startReading } from '../../services/reading.service';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBook = async () => {
      try {
        const [bookResponse, readingResponse] =
          await Promise.all([
            getBookById(id),
            getReadingProgress()
          ]);

        const bookData =
          bookResponse?.data?.book ||
          bookResponse?.book;

        const readings =
          readingResponse?.data?.readings ||
          readingResponse?.readings ||
          [];

        const existingReading =
          readings.find(
            (item) =>
              item.bookId?._id === id ||
              item.bookId === id
          );

        setBook(bookData);
        setReading(existingReading || null);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Failed to load book'
        );
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const handleStartReading = async () => {
    setStarting(true);
    setError('');

    try {
      const response = await startReading(id);

      const newReading =
        response?.data?.reading ||
        response?.reading;

      if (newReading) {
        setReading(newReading);
        navigate(`/reading/${newReading._id}`);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to start reading'
      );
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />

            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-7xl">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
                  <p className="text-slate-400">
                    Loading book...
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />

            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-7xl">
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-red-400">
                  {error || 'Book not found'}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">
              <PageHeader
                title="Book Details"
                description="Learn more about this book before starting your reading quest."
              />

              <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                  <div className="flex h-[420px] items-center justify-center overflow-hidden rounded-xl bg-slate-800 p-6">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="h-full w-auto max-w-[70%] rounded-lg object-contain"
                      />
                    ) : (
                      <span className="text-center text-slate-500">
                        {book.title}
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-indigo-400">
                        {book.category}
                      </p>

                      <h1 className="mt-2 text-3xl font-bold">
                        {book.title}
                      </h1>

                      <p className="mt-2 text-lg text-slate-400">
                        {book.author}
                      </p>
                    </div>

                    <div className="rounded-full bg-indigo-500/10 px-4 py-2 font-semibold text-indigo-400">
                      +{book.xpReward || 0} XP
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {book.difficulty && (
                      <span className="rounded-full bg-slate-800 px-3 py-1.5 text-sm capitalize text-slate-400">
                        {book.difficulty}
                      </span>
                    )}

                    <span className="rounded-full bg-slate-800 px-3 py-1.5 text-sm text-slate-400">
                      {book.pages} pages
                    </span>

                    {book.estimatedReadingTime && (
                      <span className="rounded-full bg-slate-800 px-3 py-1.5 text-sm text-slate-400">
                        {book.estimatedReadingTime} min
                      </span>
                    )}
                  </div>

                  {book.description && (
                    <div className="mt-8">
                      <h2 className="text-lg font-semibold">
                        About this book
                      </h2>

                      <p className="mt-3 leading-7 text-slate-400">
                        {book.description}
                      </p>
                    </div>
                  )}

                  {reading && (
                    <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950 p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">
                          Your progress
                        </span>

                        <span className="font-semibold text-indigo-400">
                          {reading.progress || 0}%
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{
                            width: `${reading.progress || 0}%`
                          }}
                        />
                      </div>

                      <Link
                        to={`/reading/${reading._id}`}
                        className="mt-5 block rounded-xl bg-indigo-600 px-4 py-3 text-center font-semibold transition hover:bg-indigo-500"
                      >
                        Continue Reading
                      </Link>
                    </div>
                  )}

                  {!reading && (
                    <button
                      onClick={handleStartReading}
                      disabled={starting}
                      className="mt-8 w-full rounded-xl bg-indigo-600 px-5 py-4 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {starting
                        ? 'Starting...'
                        : 'Start Reading'}
                    </button>
                  )}

                  {error && (
                    <p className="mt-4 text-sm text-red-400">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;