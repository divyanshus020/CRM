import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { deleteChallan, getAllChallans } from '../../api/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FileText, IndianRupee, Hash, Trash2, Edit, Plus, Search, X, ChevronsUpDown, RefreshCw } from 'lucide-react';

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
    <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

// Main Dashboard Component
const AllChallans = () => {
  const navigate = useNavigate();

  // State Management
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [challanToDelete, setChallanToDelete] = useState(null);

  // Search, Sort, and Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Challans with useCallback for stable function reference
  const fetchChallans = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllChallans();
      const challanList = response?.data || [];
      setChallans(Array.isArray(challanList) ? challanList : []);
    } catch (err) {
      console.error('Error loading challans:', err);
      setError('Failed to load challans. Please try again.');
      toast.error('Failed to load challans.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallans();
  }, [fetchChallans]);

  // Memoized Data Processing (Filtering and Sorting)
  const processedChallans = useMemo(() => {
    let filtered = challans;

    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = challans.filter(c => 
        (c.customerName || '').toLowerCase().includes(lowercasedSearch) ||
        (c.challanNo || '').toLowerCase().includes(lowercasedSearch)
      );
    }

    return [...filtered].sort((a, b) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';

      if (sortBy === 'date') {
        return sortOrder === 'asc' ? new Date(aVal) - new Date(bVal) : new Date(bVal) - new Date(aVal);
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [challans, searchTerm, sortBy, sortOrder]);

  // Memoized Pagination Calculation
  const { currentItems, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = processedChallans.slice(startIndex, startIndex + itemsPerPage);
    return {
      currentItems: paginatedItems,
      totalPages: Math.ceil(processedChallans.length / itemsPerPage),
    };
  }, [currentPage, processedChallans]);

  // Event Handlers (useCallback for performance)
  const handleDelete = useCallback(async () => {
    if (!challanToDelete) return;
    setIsDeleting(true);
    try {
      await deleteChallan(challanToDelete._id);
      setChallans(prev => prev.filter(c => c._id !== challanToDelete._id));
      toast.success(`Challan ${challanToDelete.challanNo} deleted successfully.`);
      setChallanToDelete(null);
    } catch (err) {
      console.error('Error deleting challan:', err);
      toast.error('Failed to delete challan.');
    } finally {
      setIsDeleting(false);
    }
  }, [challanToDelete]);

  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }, [sortBy]);

  // Utility Functions
  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN');

  // Render Logic
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><RefreshCw className="animate-spin text-blue-500" size={48} /></div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Challans Dashboard</h1>
          <p className="text-gray-500">Manage all your delivery challans</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={fetchChallans} className="p-2 bg-white border rounded-md hover:bg-gray-100"><RefreshCw size={20} /></button>
          <button onClick={() => navigate('/new-challan')} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus size={20} />
            <span>New Challan</span>
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Challans" value={challans.length} icon={<FileText />} color="blue" />
        <StatCard title="Total Value" value={formatCurrency(challans.reduce((sum, c) => sum + c.totalAmount, 0))} icon={<IndianRupee />} color="green" />
        <StatCard title="Filtered Results" value={processedChallans.length} icon={<Hash />} color="purple" />
      </div>

      {/* Search and Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by Challan No or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
            {searchTerm && <X onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" size={20} />}
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                {['challanNo', 'customerName', 'date', 'totalAmount'].map(field => (
                  <th key={field} className="p-4 capitalize cursor-pointer" onClick={() => handleSort(field)}>
                    <div className="flex items-center space-x-1">
                      <span>{field.replace(/([A-Z])/g, ' $1')}</span>
                      {sortBy === field && <ChevronsUpDown size={16} />}
                    </div>
                  </th>
                ))}
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(challan => (
                <tr key={challan._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-blue-600">{challan.challanNo}</td>
                  <td className="p-4">{challan.customerName}</td>
                  <td className="p-4 text-gray-600">{formatDate(challan.date)}</td>
                  <td className="p-4 font-semibold">{formatCurrency(challan.totalAmount)}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button onClick={() => navigate(`/view/${challan._id}`)} className="p-2 text-gray-500 hover:text-blue-600"><Edit size={18} /></button>
                      <button onClick={() => setChallanToDelete(challan)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <div className="flex space-x-1">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border rounded-md disabled:opacity-50">Prev</button>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border rounded-md disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {challanToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete challan <span className="font-semibold">{challanToDelete.challanNo}</span>?</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button onClick={() => setChallanToDelete(null)} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
              <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllChallans;