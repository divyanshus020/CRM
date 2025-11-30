import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { deleteChallan, getAllChallans } from '../../api/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FileText, IndianRupee, Hash, Trash2, Eye, Plus, Search, X, ChevronsUpDown, RefreshCw } from 'lucide-react';

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
      console.log('Fetching challans...');
      
      const response = await getAllChallans();
      console.log('API Response:', response);
      
      let challanList = [];
      
      // Handle different response structures
      if (response?.success && response?.data) {
        challanList = Array.isArray(response.data) ? response.data : [response.data];
      } else if (Array.isArray(response?.data)) {
        challanList = response.data;
      } else if (Array.isArray(response)) {
        challanList = response;
      } else {
        console.warn('Unexpected response structure:', response);
        challanList = [];
      }
      
      console.log('Processed challans:', challanList);
      setChallans(challanList);
      
      if (challanList.length === 0) {
        toast.info('No challans found.');
      }
    } catch (err) {
      console.error('Error loading challans:', err);
      setError('Failed to load challans. Please try again.');
      toast.error('Failed to load challans: ' + (err.message || 'Unknown error'));
      setChallans([]);
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
      filtered = challans.filter(c => {
        const challanNo = (c.challanNo || '').toLowerCase();
        const customerName = (c.customer?.name || '').toLowerCase();
        const firmName = (c.firmName || '').toLowerCase();
        
        return challanNo.includes(lowercasedSearch) || 
               customerName.includes(lowercasedSearch) ||
               firmName.includes(lowercasedSearch);
      });
    }

    return [...filtered].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'date') {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (sortBy === 'totalAmount') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      aVal = aVal || '';
      bVal = bVal || '';

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
      totalPages: Math.ceil(processedChallans.length / itemsPerPage) || 1,
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
      toast.error('Failed to delete challan: ' + (err.message || 'Unknown error'));
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
    setCurrentPage(1);
  }, [sortBy]);

  // Utility Functions
  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR' 
      }).format(Number(amount) || 0);
    } catch (err) {
      console.error('Currency formatting error:', err);
      return `₹${Number(amount) || 0}`;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN');
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'N/A';
    }
  };

  // Render Logic
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <RefreshCw className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading challans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Challans Dashboard</h1>
          <p className="text-gray-500">Manage all your delivery challans</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={fetchChallans} 
            className="p-2 bg-white border rounded-md hover:bg-gray-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={() => navigate('/new-challan')} 
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>New Challan</span>
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Challans" 
          value={challans.length} 
          icon={<FileText />} 
          color="blue" 
        />
        <StatCard 
          title="Total Value" 
          value={formatCurrency(challans.reduce((sum, c) => sum + (Number(c.totalAmount) || 0), 0))} 
          icon={<IndianRupee />} 
          color="green" 
        />
        <StatCard 
          title="Filtered Results" 
          value={processedChallans.length} 
          icon={<Hash />} 
          color="purple" 
        />
      </div>

      {/* Search and Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by Challan No, Customer or Firm..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <X 
                onClick={() => {
                  setSearchTerm('');
                  setCurrentPage(1);
                }} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600" 
                size={20} 
              />
            )}
          </div>
        </div>

        {error && <div className="text-red-600 bg-red-50 p-4 rounded-md mb-4">{error}</div>}

        {challans.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No challans found. <button onClick={() => navigate('/new-challan')} className="text-blue-600 hover:underline">Create one</button></p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th 
                      className="p-4 cursor-pointer hover:bg-gray-100 font-semibold text-gray-700"
                      onClick={() => handleSort('challanNo')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Challan No</span>
                        {sortBy === 'challanNo' && <ChevronsUpDown size={16} />}
                      </div>
                    </th>
                    <th 
                      className="p-4 cursor-pointer hover:bg-gray-100 font-semibold text-gray-700"
                      onClick={() => handleSort('customer')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Customer</span>
                        {sortBy === 'customer' && <ChevronsUpDown size={16} />}
                      </div>
                    </th>
                    <th 
                      className="p-4 cursor-pointer hover:bg-gray-100 font-semibold text-gray-700"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Date</span>
                        {sortBy === 'date' && <ChevronsUpDown size={16} />}
                      </div>
                    </th>
                    <th 
                      className="p-4 cursor-pointer hover:bg-gray-100 font-semibold text-gray-700"
                      onClick={() => handleSort('totalAmount')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Amount</span>
                        {sortBy === 'totalAmount' && <ChevronsUpDown size={16} />}
                      </div>
                    </th>
                    <th className="p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(challan => (
                    <tr key={challan._id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-semibold text-blue-600">{challan.challanNo || 'N/A'}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{challan.customer?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{challan.firmName || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{formatDate(challan.date)}</td>
                      <td className="p-4 font-semibold text-gray-900">{formatCurrency(challan.totalAmount)}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => navigate(`/view/${challan._id}`)} 
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View challan"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => setChallanToDelete(challan)} 
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete challan"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages} (Total: {processedChallans.length} results)
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1} 
                    className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-100 disabled:hover:bg-white transition-colors"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages} 
                    className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-100 disabled:hover:bg-white transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      {challanToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete challan <span className="font-semibold">{challanToDelete.challanNo}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setChallanToDelete(null)} 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                disabled={isDeleting} 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
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