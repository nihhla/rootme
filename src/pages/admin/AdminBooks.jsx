import { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import {
    getBooks,
    createBook,
    updateBook,
    deleteBook
} from '../../services/book.service';

const emptyForm = {
    title: '',
    author: '',
    isbn: '',
    description: '',
    category: '',
    pages: '',
    cover: '',
    availableCopies: 0,
    totalCopies: 1,
    xpReward: 50,
    difficulty: 'intermediate',
    estimatedReadingTime: 0,
    featured: false,
    quiz: []
};

const AdminBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [search, setSearch] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    const [form, setForm] = useState(emptyForm);

    const loadBooks = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await getBooks({
                search,
                page: 1,
                limit: 50
            });

            const result =
                response?.data ||
                response;

            setBooks(
                result?.books || []
            );
        } catch (error) {
            console.error(
                'Failed to load books:',
                error
            );

            setError(
                error.response?.data?.message ||
                'Failed to load books'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBooks();
    }, []);

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                type === 'checkbox'
                    ? checked
                    : value
        }));
    };

    const openAddForm = () => {
        setEditingBook(null);
        setForm(emptyForm);
        setError('');
        setMessage('');
        setShowForm(true);
    };

    const openEditForm = (book) => {
        setEditingBook(book);

        setForm({
            title: book.title || '',
            author: book.author || '',
            isbn: book.isbn || '',
            description: book.description || '',
            category: book.category || '',
            pages: book.pages || '',
            cover: book.cover || '',
            availableCopies:
                book.availableCopies ?? 0,
            totalCopies:
                book.totalCopies ?? 1,
            xpReward:
                book.xpReward ?? 50,
            difficulty:
                book.difficulty ||
                'intermediate',
            estimatedReadingTime:
                book.estimatedReadingTime ?? 0,
            featured:
                book.featured || false,
            quiz:
                book.quiz || []
        });

        setError('');
        setMessage('');
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError('');
            setMessage('');

            const bookData = {
                ...form,
                pages: Number(form.pages),
                availableCopies:
                    Number(form.availableCopies),
                totalCopies:
                    Number(form.totalCopies),
                xpReward:
                    Number(form.xpReward),
                estimatedReadingTime:
                    Number(
                        form.estimatedReadingTime
                    )
            };

            if (editingBook) {
                await updateBook(
                    editingBook._id,
                    bookData
                );

                setMessage(
                    'Book updated successfully'
                );
            } else {
                await createBook(bookData);

                setMessage(
                    'Book created successfully'
                );
            }

            setShowForm(false);
            setEditingBook(null);
            setForm(emptyForm);

            await loadBooks();

        } catch (error) {
            console.error(
                'Failed to save book:',
                error
            );

            setError(
                error.response?.data?.message ||
                'Failed to save book'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (book) => {
        const confirmed = window.confirm(
            `Delete "${book.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError('');
            setMessage('');

            await deleteBook(book._id);

            setMessage(
                'Book deleted successfully'
            );

            await loadBooks();

        } catch (error) {
            console.error(
                'Failed to delete book:',
                error
            );

            setError(
                error.response?.data?.message ||
                'Failed to delete book'
            );
        }
    };

    const addQuizQuestion = () => {
        setForm((previous) => ({
            ...previous,
            quiz: [
                ...previous.quiz,
                {
                    question: '',
                    options: [
                        '',
                        '',
                        '',
                        ''
                    ],
                    correctAnswer: 0
                }
            ]
        }));
    };

    const updateQuizQuestion = (
        questionIndex,
        field,
        value
    ) => {
        setForm((previous) => ({
            ...previous,
            quiz: previous.quiz.map(
                (question, index) =>
                    index === questionIndex
                        ? {
                              ...question,
                              [field]:
                                  field ===
                                  'correctAnswer'
                                      ? Number(value)
                                      : value
                          }
                        : question
            )
        }));
    };

    const updateQuizOption = (
        questionIndex,
        optionIndex,
        value
    ) => {
        setForm((previous) => ({
            ...previous,
            quiz: previous.quiz.map(
                (question, index) => {
                    if (
                        index !==
                        questionIndex
                    ) {
                        return question;
                    }

                    const options = [
                        ...question.options
                    ];

                    options[optionIndex] =
                        value;

                    return {
                        ...question,
                        options
                    };
                }
            )
        }));
    };

    const removeQuizQuestion = (
        questionIndex
    ) => {
        setForm((previous) => ({
            ...previous,
            quiz: previous.quiz.filter(
                (_, index) =>
                    index !== questionIndex
            )
        }));
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
                            Books Management
                        </h1>
                    </header>

                    <div className="p-8">

                        <div className="mx-auto max-w-7xl">

                            {message && (
                                <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-green-400">
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                                <div>
                                    <h2 className="text-2xl font-semibold">
                                        Library Books
                                    </h2>

                                    <p className="mt-2 text-slate-400">
                                        Add, edit and remove books.
                                    </p>
                                </div>

                                <button
                                    onClick={openAddForm}
                                    className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500"
                                >
                                    + Add Book
                                </button>

                            </div>

                            <div className="mt-6 flex gap-3">

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key ===
                                            'Enter'
                                        ) {
                                            loadBooks();
                                        }
                                    }}
                                    placeholder="Search books..."
                                    className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
                                />

                                <button
                                    onClick={loadBooks}
                                    className="rounded-xl border border-slate-700 px-6 py-3 font-medium hover:bg-slate-900"
                                >
                                    Search
                                </button>

                            </div>

                            {showForm && (
                                <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">

                                    <div className="flex items-center justify-between">

                                        <h2 className="text-2xl font-semibold">
                                            {editingBook
                                                ? 'Edit Book'
                                                : 'Add Book'}
                                        </h2>

                                        <button
                                            onClick={() =>
                                                setShowForm(
                                                    false
                                                )
                                            }
                                            className="text-slate-400 hover:text-white"
                                        >
                                            ✕
                                        </button>

                                    </div>

                                    <form
                                        onSubmit={
                                            handleSubmit
                                        }
                                        className="mt-6 space-y-6"
                                    >

                                        <div className="grid gap-5 md:grid-cols-2">

                                            <input
                                                name="title"
                                                value={
                                                    form.title
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                placeholder="Book title"
                                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                                            />

                                            <input
                                                name="author"
                                                value={
                                                    form.author
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                placeholder="Author"
                                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                                            />

                                            <input
                                                name="isbn"
                                                value={
                                                    form.isbn
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="ISBN"
                                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                                            />

                                            <input
                                                name="category"
                                                value={
                                                    form.category
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                placeholder="Category"
                                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                                            />

                                            <input
                                                name="pages"
                                                type="number"
                                                min="1"
                                                value={
                                                    form.pages
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                                placeholder="Pages"
                                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                                            />

                                            <input
                                                name="cover"
                                                value={
                                                    form.cover
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Cover URL"
                                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                                            />

                                            <input
                                                name="availableCopies"
                                                type="number"
                                                min="0"
                                                value={
                                                    form.availableCopies
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Available copies"
                                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                                            />

                                            <input
                                                name="totalCopies"
                                                type="number"
                                                min="1"
                                                value={
                                                    form.totalCopies
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Total copies"
                                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                                            />

                                            <input
                                                name="xpReward"
                                                type="number"
                                                min="0"
                                                value={
                                                    form.xpReward
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="XP reward"
                                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                                            />

                                            <select
                                                name="difficulty"
                                                value={
                                                    form.difficulty
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                                            >
                                                <option value="beginner">
                                                    Beginner
                                                </option>

                                                <option value="intermediate">
                                                    Intermediate
                                                </option>

                                                <option value="advanced">
                                                    Advanced
                                                </option>
                                            </select>

                                        </div>

                                        <textarea
                                            name="description"
                                            value={
                                                form.description
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            rows="4"
                                            placeholder="Book description"
                                            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                                        />

                                        <div className="flex items-center gap-3">

                                            <input
                                                type="checkbox"
                                                name="featured"
                                                checked={
                                                    form.featured
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="h-4 w-4"
                                            />

                                            <label className="text-slate-300">
                                                Featured book
                                            </label>

                                        </div>

                                        <div className="border-t border-slate-800 pt-6">

                                            <div className="flex items-center justify-between">

                                                <div>
                                                    <h3 className="text-xl font-semibold">
                                                        Quiz
                                                    </h3>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        Add questions for this book.
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        addQuizQuestion
                                                    }
                                                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
                                                >
                                                    + Add Question
                                                </button>

                                            </div>

                                            <div className="mt-6 space-y-5">

                                                {form.quiz.map(
                                                    (
                                                        question,
                                                        questionIndex
                                                    ) => (
                                                        <div
                                                            key={
                                                                questionIndex
                                                            }
                                                            className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                                                        >

                                                            <div className="flex items-center justify-between">

                                                                <h4 className="font-semibold">
                                                                    Question{' '}
                                                                    {questionIndex +
                                                                        1}
                                                                </h4>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeQuizQuestion(
                                                                            questionIndex
                                                                        )
                                                                    }
                                                                    className="text-sm text-red-400 hover:text-red-300"
                                                                >
                                                                    Remove
                                                                </button>

                                                            </div>

                                                            <input
                                                                value={
                                                                    question.question
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    updateQuizQuestion(
                                                                        questionIndex,
                                                                        'question',
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Question"
                                                                className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-500"
                                                            />

                                                            <div className="mt-4 grid gap-3 md:grid-cols-2">

                                                                {question.options.map(
                                                                    (
                                                                        option,
                                                                        optionIndex
                                                                    ) => (
                                                                        <input
                                                                            key={
                                                                                optionIndex
                                                                            }
                                                                            value={
                                                                                option
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateQuizOption(
                                                                                    questionIndex,
                                                                                    optionIndex,
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder={`Option ${
                                                                                optionIndex +
                                                                                1
                                                                            }`}
                                                                            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-500"
                                                                        />
                                                                    )
                                                                )}

                                                            </div>

                                                            <select
                                                                value={
                                                                    question.correctAnswer
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    updateQuizQuestion(
                                                                        questionIndex,
                                                                        'correctAnswer',
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                className="mt-4 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-500"
                                                            >
                                                                {question.options.map(
                                                                    (
                                                                        _,
                                                                        index
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                index
                                                                            }
                                                                            value={
                                                                                index
                                                                            }
                                                                        >
                                                                            Correct answer: Option{' '}
                                                                            {index +
                                                                                1}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>

                                                        </div>
                                                    )
                                                )}

                                            </div>

                                        </div>

                                        <div className="flex gap-3">

                                            <button
                                                type="submit"
                                                disabled={
                                                    saving
                                                }
                                                className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50"
                                            >
                                                {saving
                                                    ? 'Saving...'
                                                    : editingBook
                                                    ? 'Update Book'
                                                    : 'Create Book'}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowForm(
                                                        false
                                                    )
                                                }
                                                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-800"
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    </form>

                                </div>
                            )}

                            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900">

                                {loading ? (
                                    <div className="p-10 text-center text-slate-400">
                                        Loading books...
                                    </div>
                                ) : books.length === 0 ? (
                                    <div className="p-10 text-center">

                                        <div className="text-5xl">
                                            📚
                                        </div>

                                        <h3 className="mt-4 text-xl font-semibold">
                                            No books found
                                        </h3>

                                        <p className="mt-2 text-slate-400">
                                            Add your first book to the library.
                                        </p>

                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">

                                        <table className="w-full text-left">

                                            <thead className="border-b border-slate-800 text-sm text-slate-500">

                                                <tr>
                                                    <th className="px-6 py-4">
                                                        Book
                                                    </th>

                                                    <th className="px-6 py-4">
                                                        Author
                                                    </th>

                                                    <th className="px-6 py-4">
                                                        Category
                                                    </th>

                                                    <th className="px-6 py-4">
                                                        Copies
                                                    </th>

                                                    <th className="px-6 py-4">
                                                        XP
                                                    </th>

                                                    <th className="px-6 py-4 text-right">
                                                        Actions
                                                    </th>
                                                </tr>

                                            </thead>

                                            <tbody>

                                                {books.map(
                                                    (book) => (
                                                        <tr
                                                            key={
                                                                book._id
                                                            }
                                                            className="border-b border-slate-800 last:border-0"
                                                        >

                                                            <td className="px-6 py-5">

                                                                <div className="flex items-center gap-4">

                                                                    {book.cover ? (
                                                                        <img
                                                                            src={
                                                                                book.cover
                                                                            }
                                                                            alt={
                                                                                book.title
                                                                            }
                                                                            className="h-16 w-12 rounded object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-16 w-12 items-center justify-center rounded bg-slate-800 text-xl">
                                                                            📖
                                                                        </div>
                                                                    )}

                                                                    <div>
                                                                        <p className="font-semibold">
                                                                            {
                                                                                book.title
                                                                            }
                                                                        </p>

                                                                        <p className="mt-1 text-sm text-slate-500">
                                                                            {book.pages}{' '}
                                                                            pages
                                                                        </p>
                                                                    </div>

                                                                </div>

                                                            </td>

                                                            <td className="px-6 py-5 text-slate-300">
                                                                {
                                                                    book.author
                                                                }
                                                            </td>

                                                            <td className="px-6 py-5 text-slate-300">
                                                                {
                                                                    book.category
                                                                }
                                                            </td>

                                                            <td className="px-6 py-5 text-slate-300">
                                                                {
                                                                    book.availableCopies
                                                                }{' '}
                                                                /{' '}
                                                                {
                                                                    book.totalCopies
                                                                }
                                                            </td>

                                                            <td className="px-6 py-5 text-indigo-400">
                                                                +
                                                                {
                                                                    book.xpReward
                                                                }
                                                            </td>

                                                            <td className="px-6 py-5">

                                                                <div className="flex justify-end gap-2">

                                                                    <button
                                                                        onClick={() =>
                                                                            openEditForm(
                                                                                book
                                                                            )
                                                                        }
                                                                        className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
                                                                    >
                                                                        Edit
                                                                    </button>

                                                                    <button
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                book
                                                                            )
                                                                        }
                                                                        className="rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                                                    >
                                                                        Delete
                                                                    </button>

                                                                </div>

                                                            </td>

                                                        </tr>
                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
};

export default AdminBooks;