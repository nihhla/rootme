import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import PageHeader from '../../components/layout/PageHeader';
import { getBooks } from '../../services/book.service';
import {
  getBookReviews,
  createReview
} from '../../services/review.service';

const Reviews = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] =
    useState(null);

  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const [loadingBooks, setLoadingBooks] =
    useState(true);

  const [loadingReviews, setLoadingReviews] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        setLoadingBooks(false);
      }
    };

    loadBooks();
  }, []);

  const selectBook = async (book) => {
    setSelectedBook(book);

    setReviews([]);
    setRating(0);
    setComment('');
    setError('');
    setSuccess('');

    setLoadingReviews(true);

    try {
      const response =
        await getBookReviews(book._id);

      const data =
        response?.data?.reviews ||
        response?.reviews ||
        [];

      setReviews(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to load reviews'
      );
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBook) {
      setError('Please select a book first');
      return;
    }

    setError('');
    setSuccess('');

    if (!rating) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a review');
      return;
    }

    setSubmitting(true);

    try {
      await createReview({
        bookId: selectedBook._id,
        rating,
        comment: comment.trim()
      });

      setRating(0);
      setComment('');
      setSuccess(
        'Review submitted successfully'
      );

      const response =
        await getBookReviews(
          selectedBook._id
        );

      const data =
        response?.data?.reviews ||
        response?.reviews ||
        [];

      setReviews(data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to submit review'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (
    value,
    interactive = false
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={
              interactive
                ? 'button'
                : undefined
            }
            onClick={
              interactive
                ? () => setRating(star)
                : undefined
            }
            className={`text-2xl ${
              star <= value
                ? 'text-yellow-400'
                : 'text-slate-700'
            } ${
              interactive
                ? 'cursor-pointer hover:text-yellow-400'
                : 'cursor-default'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">

              <PageHeader
                title="Book Reviews"
                description="Choose a book to read reviews or share your experience."
              />

              {error && (
                <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                  {error}
                </div>
              )}

              {!selectedBook ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold">
                      Select a Book
                    </h2>

                    <p className="mt-1 text-slate-500">
                      Choose a book to view and write reviews.
                    </p>
                  </div>

                  {loadingBooks ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
                      <p className="text-slate-400">
                        Loading books...
                      </p>
                    </div>
                  ) : books.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">
                      <div className="text-5xl">
                        📚
                      </div>

                      <h2 className="mt-4 text-xl font-semibold">
                        No books available
                      </h2>
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {books.map((book) => (
                        <button
                          key={book._id}
                          onClick={() =>
                            selectBook(book)
                          }
                          className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-left transition hover:-translate-y-1 hover:border-indigo-500/50"
                        >
                          <div className="flex h-64 items-center justify-center overflow-hidden bg-slate-800">
                            {book.cover ? (
                              <img
                                src={book.cover}
                                alt={book.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="text-6xl">
                                📖
                              </div>
                            )}
                          </div>

                          <div className="p-5">
                            <h3 className="text-lg font-semibold group-hover:text-indigo-400">
                              {book.title}
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                              {book.author}
                            </p>

                            <div className="mt-5 rounded-xl bg-indigo-600 px-4 py-3 text-center font-semibold">
                              View Reviews
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setSelectedBook(null);
                      setReviews([]);
                      setError('');
                      setSuccess('');
                    }}
                    className="mb-6 text-sm font-medium text-indigo-400 hover:text-indigo-300"
                  >
                    ← Back to Books
                  </button>

                  <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:flex-row sm:items-center">
                    <div className="h-32 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-800">
                      {selectedBook.cover ? (
                        <img
                          src={selectedBook.cover}
                          alt={selectedBook.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl">
                          📖
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-indigo-400">
                        Selected Book
                      </p>

                      <h1 className="mt-1 text-3xl font-bold">
                        {selectedBook.title}
                      </h1>

                      <p className="mt-2 text-slate-500">
                        {selectedBook.author}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                      <h2 className="text-xl font-semibold">
                        Write a Review
                      </h2>

                      <p className="mt-2 text-sm text-slate-500">
                        Share your experience with this book.
                      </p>

                      <form
                        onSubmit={handleSubmit}
                        className="mt-6"
                      >
                        <label className="text-sm font-medium text-slate-300">
                          Rating
                        </label>

                        <div className="mt-2">
                          {renderStars(
                            rating,
                            true
                          )}
                        </div>

                        <label className="mt-6 block text-sm font-medium text-slate-300">
                          Review
                        </label>

                        <textarea
                          value={comment}
                          onChange={(e) =>
                            setComment(
                              e.target.value
                            )
                          }
                          rows={6}
                          placeholder="Write your thoughts..."
                          className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-indigo-500"
                        />

                        {success && (
                          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                            {success}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={submitting}
                          className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {submitting
                            ? 'Submitting...'
                            : 'Submit Review'}
                        </button>
                      </form>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold">
                            Reader Reviews
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            {reviews.length}{' '}
                            review
                            {reviews.length !==
                            1
                              ? 's'
                              : ''}
                          </p>
                        </div>
                      </div>

                      {loadingReviews ? (
                        <div className="mt-6 rounded-xl border border-slate-800 p-10 text-center">
                          <p className="text-slate-500">
                            Loading reviews...
                          </p>
                        </div>
                      ) : reviews.length === 0 ? (
                        <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-10 text-center">
                          <div className="text-5xl">
                            ⭐
                          </div>

                          <p className="mt-4 text-lg text-slate-400">
                            No reviews yet.
                          </p>

                          <p className="mt-2 text-sm text-slate-600">
                            Be the first reader to review this book.
                          </p>
                        </div>
                      ) : (
                        <div className="mt-6 space-y-4">
                          {reviews.map(
                            (review) => (
                              <div
                                key={
                                  review._id ||
                                  review.id
                                }
                                className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="font-semibold">
                                      {review.userId
                                        ?.name ||
                                        review.user
                                          ?.name ||
                                        review.name ||
                                        'Reader'}
                                    </p>

                                    <div className="mt-1">
                                      {renderStars(
                                        review.rating
                                      )}
                                    </div>
                                  </div>

                                  {review.createdAt && (
                                    <span className="text-xs text-slate-600">
                                      {new Date(
                                        review.createdAt
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>

                                <p className="mt-4 leading-7 text-slate-400">
                                  {review.comment ||
                                    review.review}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                </>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Reviews;