import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import PageHeader from '../../components/layout/PageHeader';
import {
  getReadingById,
  updateReadingProgress,
  startReadingSession,
  endReadingSession
} from '../../services/reading.service';

const Reading = () => {
  const { id } = useParams();

  const [reading, setReading] = useState(null);
  const [pagesRead, setPagesRead] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [startingSession, setStartingSession] = useState(false);
  const [endingSession, setEndingSession] = useState(false);
  const [session, setSession] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadReading = async () => {
      try {
        const response = await getReadingById(id);

        const data =
          response?.data?.reading ||
          response?.reading;

        setReading(data);
        setPagesRead(data?.pagesRead ?? 0);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Failed to load reading'
        );
      } finally {
        setLoading(false);
      }
    };

    loadReading();
  }, [id]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const interval = setInterval(() => {
      const startedAt =
        new Date(session.startedAt).getTime();

      const seconds = Math.max(
        0,
        Math.floor(
          (Date.now() - startedAt) / 1000
        )
      );

      setElapsedSeconds(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(
      (seconds % 3600) / 60
    );
    const remainingSeconds = seconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      remainingSeconds.toString().padStart(2, '0')
    ].join(':');
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const response =
        await updateReadingProgress(
          id,
          Number(pagesRead)
        );

      const updatedReading =
        response?.data?.reading ||
        response?.reading;

      if (updatedReading) {
        setReading(updatedReading);
        setPagesRead(updatedReading.pagesRead);
      }

      setSuccess(
        'Reading progress updated successfully'
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to update reading progress'
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleStartSession = async () => {
    setStartingSession(true);
    setError('');
    setSuccess('');

    try {
      const response =
        await startReadingSession(
          reading.bookId?._id || reading.bookId
        );

      const newSession =
        response?.data?.session ||
        response?.session;

      setSession(newSession);
      setElapsedSeconds(0);
      setSuccess(
        'Reading session started'
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to start reading session'
      );
    } finally {
      setStartingSession(false);
    }
  };

  const handleEndSession = async () => {
    if (!session) {
      return;
    }

    setEndingSession(true);
    setError('');
    setSuccess('');

    try {
      const response =
        await endReadingSession(
          session._id,
          Number(pagesRead)
        );

      const endedSession =
        response?.data?.session ||
        response?.session;

      setSession(null);

      if (endedSession) {
        setElapsedSeconds(
          (endedSession.durationMinutes || 0) * 60
        );
      }

      setSuccess(
        `Reading session ended. Duration: ${
          endedSession?.durationMinutes || 0
        } minutes`
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to end reading session'
      );
    } finally {
      setEndingSession(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />

            <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-5xl">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
                  <p className="text-slate-400">
                    Loading reading...
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (!reading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />

            <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-5xl">
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-red-400">
                  {error || 'Reading not found'}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  const book = reading.bookId;
  const progress = reading.progress || 0;
  const totalPages = book?.pages || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-5xl">
              <PageHeader
                title={book?.title || 'Reading'}
                description="Keep reading and update your progress."
              />

              <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex h-80 items-center justify-center overflow-hidden rounded-xl bg-slate-800 p-5">
                    {book?.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="h-full w-auto max-w-[65%] rounded-lg object-contain"
                      />
                    ) : (
                      <span className="text-center text-slate-500">
                        {book?.title}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-5 text-lg font-semibold">
                    {book?.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {book?.author}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-500">
                          Reading Progress
                        </p>

                        <p className="mt-2 text-4xl font-bold">
                          {progress}%
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-slate-500">
                          Pages
                        </p>

                        <p className="mt-2 text-xl font-semibold">
                          {reading.pagesRead} / {totalPages}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                        style={{
                          width: `${progress}%`
                        }}
                      />
                    </div>

                    <form
                      onSubmit={handleUpdateProgress}
                      className="mt-8"
                    >
                      <label className="text-sm font-medium text-slate-300">
                        Pages you have read
                      </label>

                      <input
                        type="number"
                        min="0"
                        max={totalPages}
                        value={pagesRead}
                        onChange={(e) =>
                          setPagesRead(e.target.value)
                        }
                        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
                      />

                      <button
                        type="submit"
                        disabled={updating}
                        className="mt-4 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updating
                          ? 'Updating...'
                          : 'Update Progress'}
                      </button>
                    </form>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-semibold">
                          Reading Session
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          Track the time you spend reading.
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-950 px-5 py-3 text-xl font-bold tabular-nums text-indigo-400">
                        {formatTime(elapsedSeconds)}
                      </div>
                    </div>

                    {!session ? (
                      <button
                        type="button"
                        onClick={handleStartSession}
                        disabled={startingSession}
                        className="mt-6 w-full rounded-xl bg-emerald-600 px-5 py-4 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {startingSession
                          ? 'Starting Session...'
                          : 'Start Reading Session'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleEndSession}
                        disabled={endingSession}
                        className="mt-6 w-full rounded-xl bg-red-600 px-5 py-4 font-semibold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {endingSession
                          ? 'Ending Session...'
                          : 'End Reading Session'}
                      </button>
                    )}
                  </div>

                  {success && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
                      {success}
                    </div>
                  )}

                  {error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                      {error}
                    </div>
                  )}

                  {progress >= 100 && (
                    <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-6">
                      <h3 className="font-semibold text-indigo-300">
                        Book completed 🎉
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        You can now take the quiz and earn your rewards.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          window.location.href =
                            `/reading/${id}/quiz`
                        }
                        className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500"
                      >
                        Take Quiz
                      </button>
                    </div>
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

export default Reading;