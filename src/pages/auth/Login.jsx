import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const result = await login(form);

            console.log('LOGIN RESULT:', result);
            console.log('USER ROLE:', result?.user?.role);

            if (result?.user?.role === 'admin') {
                navigate('/admin/dashboard', {
                    replace: true
                });
            } else {
                navigate('/dashboard', {
                    replace: true
                });
            }

        } catch (error) {
            console.error('LOGIN ERROR:', error);

            setError(
                error.response?.data?.message ||
                error.message ||
                'Invalid email or password'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="mx-auto flex min-h-screen max-w-md items-center px-6">

                <div className="w-full">

                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold">
                            ReadQuest
                        </h1>

                        <p className="mt-3 text-slate-400">
                            Continue your reading journey
                        </p>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

                        <h2 className="text-2xl font-semibold">
                            Welcome back
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            Login to your account
                        </p>

                        {/* Error */}
                        {error && (
                            <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="mt-6 space-y-5"
                        >

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                                />
                            </div>

                            {/* Login */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? 'Logging in...'
                                    : 'Login'}
                            </button>

                        </form>

                        {/* Register */}
                        <p className="mt-6 text-center text-sm text-slate-400">
                            Don't have an account?{' '}

                            <Link
                                to="/register"
                                className="font-medium text-indigo-400 hover:text-indigo-300"
                            >
                                Create one
                            </Link>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;