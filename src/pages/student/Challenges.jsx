import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import PageHeader from '../../components/layout/PageHeader';
import {
  getChallenges,
  getMyChallenges
} from '../../services/challenge.service';

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const [
          challengesResponse,
          myChallengesResponse
        ] = await Promise.all([
          getChallenges(),
          getMyChallenges()
        ]);

        const allChallenges =
          challengesResponse?.data?.challenges ||
          challengesResponse?.challenges ||
          [];

        const progress =
          myChallengesResponse?.data?.challenges ||
          myChallengesResponse?.data?.progress ||
          myChallengesResponse?.challenges ||
          myChallengesResponse?.progress ||
          [];

        setChallenges(allChallenges);
        setMyChallenges(progress);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          'Failed to load challenges'
        );
      } finally {
        setLoading(false);
      }
    };

    loadChallenges();
  }, []);

  const getProgress = (challengeId) => {
    const item = myChallenges.find((progress) => {
      const currentId =
        progress.challengeId?._id ||
        progress.challengeId ||
        progress.challenge?._id ||
        progress.challenge;

      return String(currentId) === String(challengeId);
    });

    if (!item) {
      return {
        current: 0,
        target: 0,
        completed: false
      };
    }

    return {
      current:
        item.currentProgress ??
        item.progress ??
        item.completedCount ??
        0,
      target:
        item.target ??
        item.requiredCount ??
        0,
      completed:
        item.completed === true ||
        item.status === 'completed'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />

            <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
                  <p className="text-slate-400">
                    Loading challenges...
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <Navbar />

            <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
                  {error}
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

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <PageHeader
                title="Reading Challenges"
                description="Complete challenges and earn extra XP."
              />

              {challenges.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">
                  <div className="text-5xl">
                    🎯
                  </div>

                  <h2 className="mt-4 text-xl font-semibold">
                    No challenges available
                  </h2>

                  <p className="mt-2 text-slate-500">
                    New challenges will appear here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {challenges.map((challenge) => {
                    const progress =
                      getProgress(challenge._id);

                    const current =
                      progress.current;

                    const target =
                      progress.target ||
                      challenge.target ||
                      challenge.goal ||
                      1;

                    const percentage = Math.min(
                      100,
                      Math.round(
                        (current / target) * 100
                      )
                    );

                    const completed =
                      progress.completed ||
                      percentage >= 100;

                    return (
                      <div
                        key={challenge._id}
                        className={`rounded-2xl border p-6 ${
                          completed
                            ? 'border-emerald-500/30 bg-emerald-500/10'
                            : 'border-slate-800 bg-slate-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-3xl">
                            {challenge.icon || '🎯'}
                          </div>

                          {completed && (
                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                              Completed
                            </span>
                          )}
                        </div>

                        <h2 className="mt-5 text-xl font-semibold">
                          {challenge.title ||
                            challenge.name}
                        </h2>

                        <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                          {challenge.description ||
                            'Complete this challenge to earn rewards.'}
                        </p>

                        <div className="mt-6">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">
                              Progress
                            </span>

                            <span className="font-medium text-slate-300">
                              {current} / {target}
                            </span>
                          </div>

                          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                            <div
                              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                              style={{
                                width: `${percentage}%`
                              }}
                            />
                          </div>

                          <p className="mt-2 text-right text-xs text-slate-600">
                            {percentage}%
                          </p>
                        </div>

                        {(challenge.xpReward !==
                          undefined ||
                          challenge.reward !==
                            undefined) && (
                          <div className="mt-5 border-t border-slate-800 pt-4">
                            <span className="text-sm font-semibold text-indigo-400">
                              +{challenge.xpReward ??
                                challenge.reward ??
                                0}{' '}
                              XP
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Challenges;