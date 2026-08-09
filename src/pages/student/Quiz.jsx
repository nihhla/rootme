import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import PageHeader from '../../components/layout/PageHeader';

import {
    getQuiz,
    submitQuiz
} from '../../services/quize.service';

const Quiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const response = await getQuiz(id);

                const data =
                    response?.data?.quiz ||
                    response?.quiz;

                setQuiz(data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    'Failed to load quiz'
                );
            } finally {
                setLoading(false);
            }
        };

        loadQuiz();
    }, [id]);

    /*
     * IMPORTANT:
     * Backend expects answer to be the option index:
     *
     * 0 = first option
     * 1 = second option
     * 2 = third option
     * 3 = fourth option
     */
    const handleAnswer = (
        questionId,
        answerIndex
    ) => {
        setAnswers((previous) => ({
            ...previous,
            [questionId]: answerIndex
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitting(true);
        setError('');

        try {
            const formattedAnswers =
                Object.entries(answers).map(
                    ([questionId, answer]) => ({
                        questionId,
                        answer
                    })
                );

            const response = await submitQuiz(
                id,
                formattedAnswers
            );

            const data =
                response?.data ||
                response;

            setResult(data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Failed to submit quiz'
            );
        } finally {
            setSubmitting(false);
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
                            <div className="mx-auto max-w-4xl">

                                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

                                    <p className="text-slate-400">
                                        Loading quiz...
                                    </p>

                                </div>

                            </div>
                        </main>

                    </div>
                </div>
            </div>
        );
    }

    if (error && !quiz) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="flex min-h-screen">

                    <Sidebar />

                    <div className="flex min-w-0 flex-1 flex-col">

                        <Navbar />

                        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-4xl">

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

    /*
     * QUIZ RESULT
     */
    if (result) {
        const passed =
            result.passed === true;

        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <div className="flex min-h-screen">

                    <Sidebar />

                    <div className="flex min-w-0 flex-1 flex-col">

                        <Navbar />

                        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-3xl">

                                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center sm:p-12">

                                    <div className="text-5xl">
                                        {passed
                                            ? '🎉'
                                            : '📚'}
                                    </div>

                                    <h1 className="mt-5 text-3xl font-bold">
                                        {passed
                                            ? 'Quiz Passed!'
                                            : 'Keep Reading!'}
                                    </h1>

                                    <p className="mt-3 text-slate-400">
                                        {passed
                                            ? 'You successfully completed the book.'
                                            : 'You did not pass the quiz yet.'}
                                    </p>

                                    {result.score !== undefined && (
                                        <div className="mx-auto mt-8 max-w-sm rounded-2xl bg-slate-950 p-6">

                                            <p className="text-sm text-slate-500">
                                                Your Score
                                            </p>

                                            <p className="mt-2 text-4xl font-bold text-indigo-400">
                                                {result.score}%
                                            </p>

                                            {result.correctAnswers !== undefined &&
                                                result.totalQuestions !== undefined && (
                                                    <p className="mt-2 text-sm text-slate-500">
                                                        {result.correctAnswers} /{' '}
                                                        {result.totalQuestions}{' '}
                                                        correct
                                                    </p>
                                                )}

                                        </div>
                                    )}

                                    {result.rewards && (
                                        <div className="mt-6 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-5">

                                            <p className="text-sm text-slate-400">
                                                XP Earned
                                            </p>

                                            <p className="mt-1 text-2xl font-bold text-indigo-400">
                                                +{result.rewards.total || 0} XP
                                            </p>

                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate('/dashboard')
                                        }
                                        className="mt-8 rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500"
                                    >
                                        Back to Dashboard
                                    </button>

                                </div>

                            </div>
                        </main>

                    </div>
                </div>
            </div>
        );
    }

    const questions =
        quiz?.questions || [];

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            <div className="flex min-h-screen">

                <Sidebar />

                <div className="flex min-w-0 flex-1 flex-col">

                    <Navbar />

                    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">

                        <div className="mx-auto w-full max-w-4xl">

                            <PageHeader
                                title={`${quiz?.title || 'Book'} Quiz`}
                                description="Answer all questions to complete your reading quest."
                            />

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >

                                {questions.map(
                                    (question, index) => (

                                        <div
                                            key={question.id}
                                            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8"
                                        >

                                            <div className="flex gap-4">

                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold">
                                                    {index + 1}
                                                </span>

                                                <h2 className="text-lg font-semibold leading-8">
                                                    {question.question}
                                                </h2>

                                            </div>

                                            <div className="mt-6 space-y-3">

                                                {question.options.map(
                                                    (
                                                        option,
                                                        optionIndex
                                                    ) => {

                                                        /*
                                                         * IMPORTANT:
                                                         *
                                                         * Compare the selected
                                                         * answer with optionIndex,
                                                         * NOT with option text.
                                                         */
                                                        const selected =
                                                            answers[
                                                                question.id
                                                            ] === optionIndex;

                                                        return (
                                                            <label
                                                                key={optionIndex}
                                                                className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                                                                    selected
                                                                        ? 'border-indigo-500 bg-indigo-500/10'
                                                                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                                                                }`}
                                                            >

                                                                <input
                                                                    type="radio"
                                                                    name={`question-${question.id}`}
                                                                    value={optionIndex}
                                                                    checked={selected}
                                                                    onChange={() =>
                                                                        handleAnswer(
                                                                            question.id,
                                                                            optionIndex
                                                                        )
                                                                    }
                                                                    className="h-4 w-4 accent-indigo-500"
                                                                />

                                                                <span className="text-slate-300">
                                                                    {option}
                                                                </span>

                                                            </label>
                                                        );
                                                    }
                                                )}

                                            </div>

                                        </div>
                                    )
                                )}

                                {error && (
                                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={
                                        submitting ||
                                        Object.keys(answers).length !==
                                            questions.length
                                    }
                                    className="w-full rounded-xl bg-indigo-600 px-5 py-4 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting
                                        ? 'Submitting Quiz...'
                                        : 'Submit Quiz'}
                                </button>

                            </form>

                        </div>

                    </main>

                </div>
            </div>
        </div>
    );
};

export default Quiz;