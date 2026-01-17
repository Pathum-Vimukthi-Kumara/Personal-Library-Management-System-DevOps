import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBooks, addBook, updateBook, deleteBook, removeAuthToken } from '../../services/api';
import { API_BASE_URL } from '../../services/api';
import Sidebar from '../Sidebar/Sidebar';

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [username, setUsername] = useState('');
  const [currentView, setCurrentView] = useState('all'); // 'dashboard' | 'completed' | 'remaining' | 'all'
  // Filters & search
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [authorFilter, setAuthorFilter] = useState('');
  const [onlyWithCover, setOnlyWithCover] = useState(false);
  const [progressOnly, setProgressOnly] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    image: null,
    pagesTotal: 0,
    pagesRead: 0
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('username');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    setUsername(user || 'User');
    fetchBooks();
  }, [navigate]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      setBooks(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

  const filteredBooks = useMemo(() => {
    let list = Array.isArray(books) ? [...books] : [];
    // Sidebar filtering first
    if (currentView === 'completed') {
      list = list.filter(b => (b.pagesTotal || 0) > 0 && (b.pagesRead || 0) >= (b.pagesTotal || 0));
    } else if (currentView === 'remaining') {
      list = list.filter(b => (b.pagesTotal || 0) === 0 || (b.pagesRead || 0) < (b.pagesTotal || 0));
    }
    const q = (search || '').trim().toLowerCase();
    if (q) {
      list = list.filter(b =>
        (b.title || '').toLowerCase().includes(q) ||
        (b.author || '').toLowerCase().includes(q)
      );
    }
    if (activeLetter) {
      if (activeLetter === '#') {
        list = list.filter(b => !/^[A-Za-z]/.test((b.title || '').trim()));
      } else {
        list = list.filter(b => (b.title || '').trim().toUpperCase().startsWith(activeLetter));
      }
    }
    if ((authorFilter || '').trim()) {
      const af = authorFilter.trim().toLowerCase();
      list = list.filter(b => (b.author || '').toLowerCase().includes(af));
    }
    if (onlyWithCover) {
      list = list.filter(b => !!b.imagePath);
    }
    if (progressOnly) {
      list = list.filter(b => (b.pagesRead || 0) > 0);
    }
    // Sort
    list.sort((a, b) => {
      if (sortBy === 'author') return (a.author || '').localeCompare(b.author || '');
      if (sortBy === 'created') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return (a.title || '').localeCompare(b.title || '');
    });
    return list;
  }, [books, currentView, search, activeLetter, authorFilter, onlyWithCover, progressOnly, sortBy]);

  const stats = useMemo(() => {
    const total = books.length;
    const completed = books.filter(b => (b.pagesTotal || 0) > 0 && (b.pagesRead || 0) >= (b.pagesTotal || 0)).length;
    const inProgress = books.filter(b => (b.pagesTotal || 0) > 0 && (b.pagesRead || 0) > 0 && (b.pagesRead || 0) < (b.pagesTotal || 0)).length;
    const notStarted = total - completed - inProgress;
    return { total, completed, inProgress, notStarted };
  }, [books]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      // Convert numeric fields to numbers
      if (name === 'pagesTotal' || name === 'pagesRead') {
        const num = value === '' ? '' : Math.max(0, parseInt(value, 10) || 0);
        setFormData(prev => ({ ...prev, [name]: num }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author) {
      setError('Title and author are required');
      return;
    }

    try {
      const pagesTotal = Number(formData.pagesTotal || 0);
      const pagesRead = Number(formData.pagesRead || 0);
      if (pagesRead < 0 || pagesTotal < 0) {
        setError('Pages must be non-negative');
        return;
      }
      if (pagesRead > pagesTotal) {
        setError('Pages read cannot exceed total pages');
        return;
      }
      if (editingId) {
        await updateBook(editingId, formData.title, formData.author, formData.description, formData.image, pagesTotal, pagesRead);
        setEditingId(null);
      } else {
        await addBook(formData.title, formData.author, formData.description, formData.image, pagesTotal, pagesRead);
      }
      
      setFormData({ title: '', author: '', description: '', image: null, pagesTotal: 0, pagesRead: 0 });
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      setError(err.message || 'Failed to save book');
    }
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      image: null,
      pagesTotal: typeof book.pagesTotal === 'number' ? book.pagesTotal : (book.pagesTotal || 0),
      pagesRead: typeof book.pagesRead === 'number' ? book.pagesRead : (book.pagesRead || 0)
    });
    setEditingId(book.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        fetchBooks();
      } catch (err) {
        setError('Failed to delete book');
      }
    }
  };

  const handleAddNew = () => {
    setFormData({ title: '', author: '', description: '', image: null, pagesTotal: 0, pagesRead: 0 });
    setEditingId(null);
    setShowModal(true);
  };

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="flex max-w-7xl mx-auto">
        <Sidebar currentView={currentView} onSelect={setCurrentView} onAddItem={handleAddNew} />

        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="sticky top-0 z-10 bg-white border-b">
            <div className="px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{currentView === 'dashboard' ? 'Dashboard' : 'My Books'}</h1>
                {currentView !== 'dashboard' && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{filteredBooks.length}</span>
                )}
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-96">
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Start Searching..."
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">🔎</span>
                </div>
                <button 
                  onClick={handleAddNew}
                  className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md"
                >
                  + Add Book
                </button>
                <button 
                  onClick={handleLogout}
                  className="hidden md:inline-flex bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Filters row (hidden on dashboard view) */}
            <div className="px-4 pb-3">
              {currentView !== 'dashboard' && (
              <div className="flex items-center gap-3">
                <div className="flex flex-wrap gap-1 text-sm">
                  {letters.map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setActiveLetter(prev => prev === l ? '' : l)}
                      className={`px-2 py-1 rounded ${activeLetter === l ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="hidden md:flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Sort</span>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border rounded px-2 py-1">
                      <option value="title">Title</option>
                      <option value="author">Author</option>
                      <option value="created">Recently added</option>
                    </select>
                  </div>
                  <button onClick={() => setShowFilters(s => !s)} className="text-sm border rounded px-3 py-1 bg-white hover:bg-gray-50">
                    Filters
                  </button>
                </div>
              </div>
              )}

              {showFilters && currentView !== 'dashboard' && (
                <div className="mt-3 border rounded-md p-3 bg-gray-50">
                  <div className="grid md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-600">Author</label>
                      <input
                        type="text"
                        value={authorFilter}
                        onChange={e => setAuthorFilter(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                        placeholder="Filter by author"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={onlyWithCover} onChange={e => setOnlyWithCover(e.target.checked)} />
                      Only with cover image
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={progressOnly} onChange={e => setProgressOnly(e.target.checked)} />
                      Only with progress
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {currentView === 'dashboard' ? (
          <div className="p-6 grid gap-4 md:grid-cols-4">
            <div className="border rounded-lg p-4 bg-white">
              <div className="text-sm text-gray-600">Total Books</div>
              <div className="text-3xl font-semibold">{stats.total}</div>
            </div>
            <div className="border rounded-lg p-4 bg-white">
              <div className="text-sm text-gray-600">Completed</div>
              <div className="text-3xl font-semibold text-green-600">{stats.completed}</div>
            </div>
            <div className="border rounded-lg p-4 bg-white">
              <div className="text-sm text-gray-600">In Progress</div>
              <div className="text-3xl font-semibold text-blue-600">{stats.inProgress}</div>
            </div>
            <div className="border rounded-lg p-4 bg-white">
              <div className="text-sm text-gray-600">Not Started</div>
              <div className="text-3xl font-semibold text-gray-700">{stats.notStarted}</div>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading your books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No books in your library yet</p>
            <button 
              onClick={handleAddNew}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
            >
              Add Your First Book
            </button>
          </div>
        ) : (
          /* Books Grid */
          <div className="p-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <div 
                key={book.id} 
                className="bg-white rounded-lg border overflow-hidden hover:shadow-sm transition"
              >
                {book.imagePath && (
                  <img 
                    src={`${(API_BASE_URL || '')}/api/images/${(book.imagePath || '').split('/').pop()}`} 
                    alt={book.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">By {book.author}</p>
                  {book.description && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{book.description}</p>
                  )}
                  {(book.pagesTotal > 0 || book.pagesRead > 0) && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>
                          {Math.min(100, Math.round(((book.pagesRead || 0) / (book.pagesTotal || 1)) * 100))}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
                        <div
                          className="bg-green-500 h-2"
                          style={{ width: `${Math.min(100, Math.round(((book.pagesRead || 0) / (book.pagesTotal || 1)) * 100))}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Pages: {book.pagesRead || 0} / {book.pagesTotal || 0}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(book)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded transition text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(book.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Book' : 'Add New Book'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Title *</label>
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Book title"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Author *</label>
                <input 
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Author name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Book description"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Total Pages</label>
                  <input
                    type="number"
                    name="pagesTotal"
                    min="0"
                    value={formData.pagesTotal}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Pages Read</label>
                  <input
                    type="number"
                    name="pagesRead"
                    min="0"
                    value={formData.pagesRead}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 120"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Book Cover Image</label>
                <input 
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition"
                >
                  {editingId ? 'Update' : 'Add'} Book
                </button>
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;