import React, { useState, useEffect } from 'react';
import { deleteChallan, getAllChallans } from '../../api/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // State for storing challans data
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [challanToDelete, setChallanToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'name', 'challanNo', 'amount'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  // Mock challans data (15 records for pagination demo)
  const mockChallans = [
    {
      _id: '1',
      challanNumber: 'CH001',
      customerName: 'Rajesh Kumar',
      date: '2025-01-15',
      subTotal: 50000,
      grandTotal: 59000
    },
    {
      _id: '2',
      challanNumber: 'CH002',
      customerName: 'Priya Sharma',
      date: '2025-01-14',
      subTotal: 25000,
      grandTotal: 29500
    },
    {
      _id: '3',
      challanNumber: 'CH003',
      customerName: 'Amit Singh',
      date: '2025-01-13',
      subTotal: 75000,
      grandTotal: 88500
    },
    {
      _id: '4',
      challanNumber: 'CH004',
      customerName: 'Sunita Gupta',
      date: '2025-01-12',
      subTotal: 35000,
      grandTotal: 41300
    },
    {
      _id: '5',
      challanNumber: 'CH005',
      customerName: 'Vikram Singh',
      date: '2025-01-11',
      subTotal: 45000,
      grandTotal: 53100
    },
    {
      _id: '6',
      challanNumber: 'CH006',
      customerName: 'Meera Jain',
      date: '2025-01-10',
      subTotal: 65000,
      grandTotal: 76700
    },
    {
      _id: '7',
      challanNumber: 'CH007',
      customerName: 'Rohit Patel',
      date: '2025-01-09',
      subTotal: 55000,
      grandTotal: 64900
    },
    {
      _id: '8',
      challanNumber: 'CH008',
      customerName: 'Kavya Reddy',
      date: '2025-01-08',
      subTotal: 42000,
      grandTotal: 49560
    },
    {
      _id: '9',
      challanNumber: 'CH009',
      customerName: 'Arjun Nair',
      date: '2025-01-07',
      subTotal: 38000,
      grandTotal: 44840
    },
    {
      _id: '10',
      challanNumber: 'CH010',
      customerName: 'Deepika Rao',
      date: '2025-01-06',
      subTotal: 52000,
      grandTotal: 61360
    },
    {
      _id: '11',
      challanNumber: 'CH011',
      customerName: 'Karan Sharma',
      date: '2025-01-05',
      subTotal: 48000,
      grandTotal: 56640
    },
    {
      _id: '12',
      challanNumber: 'CH012',
      customerName: 'Anjali Verma',
      date: '2025-01-04',
      subTotal: 62000,
      grandTotal: 73160
    },
    {
      _id: '13',
      challanNumber: 'CH013',
      customerName: 'Sanjay Kumar',
      date: '2025-01-03',
      subTotal: 33000,
      grandTotal: 38940
    },
    {
      _id: '14',
      challanNumber: 'CH014',
      customerName: 'Pooja Singh',
      date: '2025-01-02',
      subTotal: 71000,
      grandTotal: 83780
    },
    {
      _id: '15',
      challanNumber: 'CH015',
      customerName: 'Manish Agarwal',
      date: '2025-01-01',
      subTotal: 58000,
      grandTotal: 68440
    }
  ];

  // Load challans when component starts
  useEffect(() => {
    loadChallans();
  }, []);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  // Function to load challans (using mock data)
  const loadChallans = async () => {
    try {
      setLoading(true);
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock data (replace this with your API call)
      const data = await getAllChallans();

      if (data && data.length > 0) {
        setChallans(data);
        console.log('Challans loaded:', data);
      } else {
        setChallans(mockChallans);
      }

      setError('');
    } catch (err) {
      setError('Failed to load challans');
      console.error('Error loading challans:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to filter challans based on search term
  const getFilteredChallans = () => {
    if (!searchTerm.trim()) {
      return challans;
    }

    return challans.filter(challan => {
      const customerName = (challan.customer?.name || challan.customerName || '').toLowerCase();
      const challanNumber = (challan.challanNo || challan.challanNumber || '').toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      // Date search functionality
      const challanDate = new Date(challan.date);
      const dateString = challanDate.toLocaleDateString('en-IN'); // DD/MM/YYYY format
      const dateStringUS = challanDate.toLocaleDateString('en-US'); // MM/DD/YYYY format
      const dateStringISO = challan.date; // YYYY-MM-DD format
      const dateStringReverse = challan.date.split('-').reverse().join('/'); // DD/MM/YYYY from ISO
      
      // Check different date formats
      const dateMatches = dateString.includes(searchLower) || 
                         dateStringUS.includes(searchLower) ||
                         dateStringISO.includes(searchLower) ||
                         dateStringReverse.includes(searchLower) ||
                         // Partial date matches (e.g., searching "2025" or "01" or "15")
                         challan.date.includes(searchTerm) ||
                         // Day/Month/Year individual searches
                         challanDate.getDate().toString().includes(searchTerm) ||
                         (challanDate.getMonth() + 1).toString().padStart(2, '0').includes(searchTerm) ||
                         challanDate.getFullYear().toString().includes(searchTerm);

      return customerName.includes(searchLower) || 
             challanNumber.includes(searchLower) || 
             dateMatches;
    });
  };

  // Function to sort challans
  const getSortedChallans = (filteredChallans) => {
    const sorted = [...filteredChallans].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = (a.customer?.name || a.customerName || '').toLowerCase();
          bValue = (b.customer?.name || b.customerName || '').toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'challanNo':
          aValue = (a.challanNo || a.challanNumber || '').toLowerCase();
          bValue = (b.challanNo || b.challanNumber || '').toLowerCase();
          break;
        case 'amount':
          aValue = a.totalAmount || a.grandTotal || 0;
          bValue = b.totalAmount || b.grandTotal || 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
        return 0;
      }
    });

    return sorted;
  };

  // Get processed data for display
  const getProcessedChallans = () => {
    const filtered = getFilteredChallans();
    const sorted = getSortedChallans(filtered);
    return sorted;
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      // Toggle sort order if same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column with default desc order
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Function to format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  // Function to format money in Indian Rupees
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
  };

  // Open delete confirmation modal
  const openDeleteModal = (challan) => {
    setChallanToDelete(challan);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setChallanToDelete(null);
    setIsDeleting(false);
  };

  // Confirm delete challan function
  const confirmDeleteChallan = async () => {
    if (!challanToDelete) return;

    try {
      setIsDeleting(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would make your API call to delete the challan
      const response = await deleteChallan(challanToDelete._id);

      if(response.success) {
      
      const updatedChallans = challans.filter(challan => challan._id !== challanToDelete._id);
      setChallans(updatedChallans);
      
      // Adjust current page if needed
      const processedChallans = getProcessedChallans().filter(challan => challan._id !== challanToDelete._id);
      const newTotalPages = Math.ceil(processedChallans.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      
      closeDeleteModal();
      
      // Show success message (you can replace this with a toast notification)
      toast.success('Challan deleted successfully!', {
        position: 'top-center',
        autoClose: 5000,
      });
    }
      
    } catch (error) {
      console.error('Error deleting challan:', error);
      alert('Failed to delete challan. Please try again.');
      setIsDeleting(false);
    }
  };

  // Get processed challans for pagination
  const processedChallans = getProcessedChallans();
  const totalPages = Math.ceil(processedChallans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentChallans = processedChallans.slice(startIndex, startIndex + itemsPerPage);

  // Calculate totals for summary
  const totalValue = challans.reduce((sum, challan) => sum + (challan.totalAmount || challan.grandTotal || 0), 0);

  // Pagination functions
  const goToPage = (page) => setCurrentPage(page);
  const goToPrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading challans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Challans Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage all your delivery challans</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Challans Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Challans</h3>
            <p className="text-3xl font-bold text-blue-600">{challans.length}</p>
          </div>
          
          {/* Total Value Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Value</h3>
            <p className="text-3xl font-bold text-green-600">{formatMoney(totalValue)}</p>
          </div>
          
          {/* Filtered Results Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Challans</h3>
            <p className="text-3xl font-bold text-purple-600">{processedChallans.length}</p>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by customer name, challan number, or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Customer Name</option>
                <option value="challanNo">Sort by Challan No.</option>
                <option value="amount">Sort by Amount</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center gap-2"
              >
                {sortOrder === 'asc' ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    Ascending
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    Descending
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                Found <strong>{processedChallans.length}</strong> result(s) for "<strong>{searchTerm}</strong>"
                {processedChallans.length === 0 && (
                  <span> - Try different keywords, dates (DD/MM/YYYY, YYYY-MM-DD), or check spelling</span>
                )}
              </p>
              {searchTerm && processedChallans.length > 0 && (
                <div className="mt-2 text-xs text-blue-600">
                  💡 <strong>Date search tips:</strong> Try "2025", "01/15", "15/01/2025", "2025-01-15", or just "15" for day
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate('/new-challan')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            + Add New Challan
          </button>
          <button 
            onClick={loadChallans}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg"
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* No Results Message */}
        {processedChallans.length === 0 && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-yellow-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.007-5.824-2.562M15 6.5a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-lg font-medium text-yellow-800 mb-2">No challans found</h3>
            <p className="text-yellow-700">
              {searchTerm 
                ? `No challans match your search "${searchTerm}". Try different keywords, dates, or check spelling.`
                : 'No challans available. Add your first challan to get started.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Challans Table */}
        {processedChallans.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">All Challans</h2>
              <p className="text-gray-600 text-sm">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, processedChallans.length)} of {processedChallans.length} challans
                {searchTerm && ` (filtered from ${challans.length} total)`}
              </p>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden">
              {currentChallans.map((challan) => (
                <div key={challan._id} className="border-b border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-bold">
                      {challan.challanNo || challan.challanNumber}
                    </span>
                    <span className="text-green-600 font-bold">
                      {formatMoney(challan.totalAmount || challan.grandTotal)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <p className="font-semibold text-gray-800">{challan.customer?.name || challan.customerName}</p>
                    <p className="text-gray-600 text-sm">{formatDate(challan.date)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                       onClick={() => navigate(`/view/${challan._id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => openDeleteModal(challan)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      <button 
                        onClick={() => handleSortChange('challanNo')}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Challan No.
                        {sortBy === 'challanNo' && (
                          <svg className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      <button 
                        onClick={() => handleSortChange('name')}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Customer Name
                        {sortBy === 'name' && (
                          <svg className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      <button 
                        onClick={() => handleSortChange('date')}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Date
                        {sortBy === 'date' && (
                          <svg className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      <button 
                        onClick={() => handleSortChange('amount')}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Grand Total
                        {sortBy === 'amount' && (
                          <svg className={`w-4 h-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentChallans.map((challan) => (
                    <tr key={challan._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-bold">
                          {challan.challanNo || challan.challanNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {challan.customer?.name || challan.customerName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(challan.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        {formatMoney(challan.totalAmount || challan.grandTotal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => navigate(`/view/${challan._id}`)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => openDeleteModal(challan)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
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
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToPrevious}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 text-sm rounded ${
                          currentPage === page
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={goToNext}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 19c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this challan?
              </p>
              {challanToDelete && (
                <div className="bg-gray-50 p-3 rounded border">
                  <p className="text-sm">
                    <span className="font-semibold">Challan No:</span> {challanToDelete.challanNo || challanToDelete.challanNumber}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Customer:</span> {challanToDelete.customer?.name || challanToDelete.customerName}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Amount:</span> {formatMoney(challanToDelete.totalAmount || challanToDelete.grandTotal)}
                  </p>
                </div>
              )}
              <p className="text-red-600 text-sm mt-2">
                <strong>Warning:</strong> This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteChallan}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Challan'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;