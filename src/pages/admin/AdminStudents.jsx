import { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { getStudents, deleteStudent } from '../../services/auth.service';

const AdminStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });

    const loadStudents = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await getStudents({
                search,
                page: pagination.page,
                limit: pagination.limit
            });

            console.log(
                'STUDENTS RESPONSE:',
                response
            );

            const data =
                response?.data ||
                response;

            setStudents(
                data?.students || []
            );

            if (data?.pagination) {
                setPagination(
                    data.pagination
                );
            }

        } catch (err) {
            console.error(
                'STUDENTS ERROR:',
                err
            );

            setError(
                err?.response?.data?.message ||
                'Failed to load students'
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, [
        pagination.page,
        search
    ]);

    const handleSearch = (e) => {
        const value = e.target.value;

        setSearch(value);

        setPagination((previous) => ({
            ...previous,
            page: 1
        }));
    };

    const goToPreviousPage = () => {
        if (!pagination.hasPreviousPage) {
            return;
        }

        setPagination((previous) => ({
            ...previous,
            page: previous.page - 1
        }));
    };

    const goToNextPage = () => {
        if (!pagination.hasNextPage) {
            return;
        }

        setPagination((previous) => ({
            ...previous,
            page: previous.page + 1
        }));
    };
    const handleDeleteStudent = async (student) => {
    const confirmed = window.confirm(
        `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        setError('');

        await deleteStudent(student._id);

        await loadStudents();

    } catch (err) {
        console.error(
            'DELETE STUDENT ERROR:',
            err
        );

        setError(
            err?.response?.data?.message ||
            'Failed to delete student'
        );
    }
};

  return (
    <div className="min-h-screen bg-slate-950 text-white">

        <div className="flex min-h-screen">

            <AdminSidebar />

            <main className="min-w-0 flex-1">

                <header className="border-b border-slate-800 px-8 py-6">

                    <p className="text-sm text-slate-500">
                        Administration
                    </p>

                    <h1 className="mt-1 text-3xl font-bold">
                        Students
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Manage registered students on ReadQuest.
                    </p>

                </header>

                <div className="p-8">

                    <div className="mx-auto max-w-7xl">

                        <div className="mb-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                            <div>

                                <h2 className="text-2xl font-semibold">
                                    All Students
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    {pagination.total || 0}{' '}
                                    registered students
                                </p>

                            </div>

                            <input
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Search by name, email or student ID..."
                                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-indigo-500 md:w-96"
                            />

                        </div>

                        {error && (
                            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400">
                                {error}
                            </div>
                        )}

                        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

                            {loading ? (

                                <div className="flex min-h-[350px] items-center justify-center">

                                    <div className="text-center">

                                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

                                        <p className="mt-4 text-slate-400">
                                            Loading students...
                                        </p>

                                    </div>

                                </div>

                            ) : students.length === 0 ? (

                                <div className="flex min-h-[350px] items-center justify-center">

                                    <div className="text-center">

                                        <div className="text-5xl">
                                            👨‍🎓
                                        </div>

                                        <h3 className="mt-5 text-xl font-semibold">
                                            No students found
                                        </h3>

                                        <p className="mt-2 text-slate-500">
                                            No registered students match your search.
                                        </p>

                                    </div>

                                </div>

                            ) : (

                                <div className="overflow-x-auto">

                                    <table className="w-full text-left">

                                        <thead className="border-b border-slate-800 bg-slate-950">

                                            <tr>

                                                <th className="px-6 py-4 text-sm font-medium text-slate-400">
                                                    Student
                                                </th>

                                                <th className="px-6 py-4 text-sm font-medium text-slate-400">
                                                    Student ID
                                                </th>

                                                <th className="px-6 py-4 text-sm font-medium text-slate-400">
                                                    Email
                                                </th>

                                                <th className="px-6 py-4 text-sm font-medium text-slate-400">
                                                    Department
                                                </th>

                                                <th className="px-6 py-4 text-sm font-medium text-slate-400">
                                                    Semester
                                                </th>

                                                <th className="px-6 py-4 text-sm font-medium text-slate-400">
                                                    XP
                                                </th>

                                                <th className="px-6 py-4 text-sm font-medium text-slate-400">
                                                    Level
                                                </th>

                                                <th className="px-6 py-4 text-sm font-medium text-slate-400">
                                                    Joined
                                                </th>

                                                <th className="px-6 py-4 text-sm font-medium text-slate-400">
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody className="divide-y divide-slate-800">

                                            {students.map(
                                                (student) => (

                                                    <tr
                                                        key={
                                                            student._id
                                                        }
                                                        className="transition hover:bg-slate-800/40"
                                                    >

                                                        <td className="px-6 py-5">

                                                            <div className="flex items-center gap-4">

                                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold">

                                                                    {student.name
                                                                        ?.charAt(0)
                                                                        ?.toUpperCase() ||
                                                                        'S'}

                                                                </div>

                                                                <div>

                                                                    <p className="font-medium text-white">

                                                                        {student.name ||
                                                                            'Unnamed Student'}

                                                                    </p>

                                                                    <span className="mt-1 inline-block rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                                                                        {student.role ||
                                                                            'student'}
                                                                    </span>

                                                                </div>

                                                            </div>

                                                        </td>

                                                        <td className="px-6 py-5 text-slate-300">
                                                            {student.studentId ||
                                                                '-'}
                                                        </td>

                                                        <td className="px-6 py-5 text-slate-300">
                                                            {student.email ||
                                                                '-'}
                                                        </td>

                                                        <td className="px-6 py-5 text-slate-300">
                                                            {student.department ||
                                                                '-'}
                                                        </td>

                                                        <td className="px-6 py-5 text-slate-300">
                                                            {student.semester ||
                                                                '-'}
                                                        </td>

                                                        <td className="px-6 py-5">

                                                            <span className="font-semibold text-indigo-400">
                                                                {student.xp ??
                                                                    0}
                                                            </span>

                                                        </td>

                                                        <td className="px-6 py-5">

                                                            <span className="rounded-lg bg-purple-500/10 px-3 py-1.5 text-sm font-medium text-purple-400">
                                                                Level{' '}
                                                                {student.level ??
                                                                    1}
                                                            </span>

                                                        </td>

                                                        <td className="px-6 py-5 text-slate-400">

                                                            {student.createdAt
                                                                ? new Date(
                                                                      student.createdAt
                                                                  ).toLocaleDateString()
                                                                : '-'}

                                                        </td>

                                                        <td className="px-6 py-5">

                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteStudent(
                                                                        student
                                                                    )
                                                                }
                                                                className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                                                            >
                                                                Delete
                                                            </button>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                        {pagination.pages > 1 && (
                            <div className="mt-6 flex items-center justify-between">

                                <button
                                    onClick={
                                        goToPreviousPage
                                    }
                                    disabled={
                                        !pagination.hasPreviousPage
                                    }
                                    className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    ← Previous
                                </button>

                                <div className="text-sm text-slate-400">

                                    Page{' '}

                                    <span className="font-semibold text-white">
                                        {pagination.page}
                                    </span>

                                    {' '}of{' '}

                                    <span className="font-semibold text-white">
                                        {pagination.pages}
                                    </span>

                                </div>

                                <button
                                    onClick={
                                        goToNextPage
                                    }
                                    disabled={
                                        !pagination.hasNextPage
                                    }
                                    className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next →
                                </button>

                            </div>
                        )}

                    </div>

                </div>

            </main>

        </div>

    </div>
);
};

export default AdminStudents;