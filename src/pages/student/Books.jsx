import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import PageHeader from '../../components/layout/PageHeader';
import { getBooks } from '../../services/book.service';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await getBooks();

        const data =
          response?.data?.books ||
          response?.books ||
          [];

        setBooks(data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Failed to load books'
        );
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <PageHeader
                title="Library"
                description="Explore books and start your next reading quest."
              />

              {loading && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
                  <p className="text-slate-400">
                    Loading books...
                  </p>
                </div>
              )}

              {error && !loading && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
                  {error}
                </div>
              )}

              {!loading &&
                !error &&
                books.length === 0 && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
                    <h2 className="text-xl font-semibold">
                      No books available
                    </h2>

                    <p className="mt-2 text-slate-500">
                      Check back later for new books.
                    </p>
                  </div>
                )}

              {!loading &&
                !error &&
                books.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {books.map((book) => (
                      <article
                        key={book._id}
                        className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:-translate-y-1 hover:border-indigo-500/50"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-slate-800 h-60 w-full">
                          {book.cover ? (
                            <img
                              src={book.cover}
                              alt={book.title}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center p-6 text-center">
                              <span className="text-lg font-semibold text-slate-500">
                                {book.title}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3 h-10">
                            <div>
                              <h2 className="line-clamp-2 font-semibold text-white">
                                {book.title}
                              </h2>

                              <p className="mt-1 text-sm text-slate-500">
                                {book.author}
                              </p>
                            </div>

                            <span className="shrink-0 rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-400">
                              {book.xpReward || 0} XP
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {book.category && (
                              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                                {book.category}
                              </span>
                            )}

                            {book.difficulty && (
                              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs capitalize text-slate-400">
                                {book.difficulty}
                              </span>
                            )}
                          </div>

                          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                            <span>
                              {book.pages || 0} pages
                            </span>

                            {book.estimatedReadingTime && (
                              <span>
                                {book.estimatedReadingTime} min
                              </span>
                            )}
                          </div>

                          <Link
                            to={`/books/${book._id}`}
                            className="mt-5 block w-full rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-500"
                          >
                            View Book
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Books;