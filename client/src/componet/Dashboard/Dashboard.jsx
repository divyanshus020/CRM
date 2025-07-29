import React, { useState, useEffect } from 'react';
import { Eye, Edit3, Trash2, Plus, RefreshCw, TrendingUp, FileText, DollarSign, UserPlus } from 'lucide-react';
import { deleteChallan, getAllChallans } from '../../api/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [challans, setChallans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [challanToDelete, setChallanToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock data for demonstration (15+ records to show pagination)
  const mockChallans = [
    {
      _id: '1',
      challanNo: 'CH001',
      customer: { name: 'Rajesh Kumar' },
      contact: '9876543210',
      date: '2025-01-15',
      totalAmount: 59000
    },
    {
      _id: '2',
      challanNo: 'CH002',
      customer: { name: 'Priya Sharma' },
      contact: '9876543211',
      date: '2025-01-14',
      totalAmount: 29500
    },
    {
      _id: '3',
      challanNo: 'CH003',
      customer: { name: 'Amit Singh' },
      contact: '9876543212',
      date: '2025-01-13',
      totalAmount: 88500
    },
    {
      _id: '4',
      challanNo: 'CH004',
      customer: { name: 'Sunita Gupta' },
      contact: '9876543213',
      date: '2025-01-12',
      totalAmount: 41300
    },
    {
      _id: '5',
      challanNo: 'CH005',
      customer: { name: 'Vikram Singh' },
      contact: '9876543214',
      date: '2025-01-11',
      totalAmount: 53100
    },
    {
      _id: '6',
      challanNo: 'CH006',
      customer: { name: 'Meera Jain' },
      contact: '9876543215',
      date: '2025-01-10',
      totalAmount: 76700
    },
    {
      _id: '7',
      challanNo: 'CH007',
      customer: { name: 'Rohit Patel' },
      contact: '9876543216',
      date: '2025-01-09',
      totalAmount: 64900
    },
    {
      _id: '8',
      challanNo: 'CH008',
      customer: { name: 'Kavya Reddy' },
      contact: '9876543217',
      date: '2025-01-08',
      totalAmount: 49560
    },
    {
      _id: '9',
      challanNo: 'CH009',
      customer: { name: 'Arjun Nair' },
      contact: '9876543218',
      date: '2025-01-07',
      totalAmount: 44840
    },
    {
      _id: '10',
      challanNo: 'CH010',
      customer: { name: 'Deepika Rao' },
      contact: '9876543219',
      date: '2025-01-06',
      totalAmount: 61360
    },
    {
      _id: '11',
      challanNo: 'CH011',
      customer: { name: 'Karan Sharma' },
      contact: '9876543220',
      date: '2025-01-05',
      totalAmount: 56640
    },
    {
      _id: '12',
      challanNo: 'CH012',
      customer: { name: 'Anjali Verma' },
      contact: '9876543221',
      date: '2025-01-04',
      totalAmount: 73160
    },
    {
      _id: '13',
      challanNo: 'CH013',
      customer: { name: 'Sanjay Kumar' },
      contact: '9876543222',
      date: '2025-01-03',
      totalAmount: 38940
    },
    {
      _id: '14',
      challanNo: 'CH014',
      customer: { name: 'Pooja Singh' },
      contact: '9876543223',
      date: '2025-01-02',
      totalAmount: 83780
    },
    {
      _id: '15',
      challanNo: 'CH015',
      customer: { name: 'Manish Agarwal' },
      contact: '9876543224',
      date: '2025-01-01',
      totalAmount: 68440
    }
  ];

  useEffect(() => {
    fetchChallans();
  }, []);

  const fetchChallans = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, replace this with your API call:
       const data = await getAllChallans();
      if(data && data.length > 0) {
        setChallans(data);
      } else {
        setChallans(mockChallans); // Fallback to mock data if API returns empty
      }
      console.log('Challans fetched:', data || mockChallans);
      setError('');
    } catch (err) {
      console.error('Error fetching challans:', err);
      setChallans(mockChallans); // Fallback to mock data
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN');

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);

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
      
      // Call actual delete API
     const response = await deleteChallan(challanToDelete._id);

     if(response.success) {
      
      // Update local state
      const updatedChallans = challans.filter(challan => challan._id !== challanToDelete._id);
      setChallans(updatedChallans);
      
      // Adjust current page if needed
      const newTotalPages = Math.ceil(updatedChallans.length / itemsPerPage);
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
      alert('Failed to delete challan: ' + error.message);
      setIsDeleting(false);
    }
  };

  const totalValue = challans.reduce((sum, challan) => sum + (challan.totalAmount || 0), 0);
  const totalPages = Math.ceil(challans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedChallans = challans.slice(startIndex, startIndex + itemsPerPage);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-xl">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ActionButton = ({ onClick, icon: Icon, className, children }) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${className}`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your challans and track business performance</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <button
                onClick={() => window.location.href = "/new-customer"}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-3 sm:px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <UserPlus className="w-4 h-4" />
                <span className="sm:inline">New Customer</span>
              </button>
              <button
                onClick={fetchChallans}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total Challans"
            value={challans.length}
            icon={FileText}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Value"
            value={formatCurrency(totalValue)}
            icon={DollarSign}
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Average Value"
            value={formatCurrency(totalValue / challans.length || 0)}
            icon={TrendingUp}
            color="from-purple-500 to-purple-600"
          />
        </div>

        {/* Challans Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">All Challans</h2>
                <p className="text-gray-600 text-sm mt-1">Manage and track all your challan records</p>
              </div>
              <button 
                onClick={() => window.location.href = "/new-challan"} 
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Challan</span>
              </button>
            </div>
          </div>

          {error ? (
            <div className="p-4 sm:p-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-red-800 font-medium">Error</h3>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                  <button
                    onClick={fetchChallans}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm w-full sm:w-auto"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden">
                {paginatedChallans.map((challan) => (
                  <div key={challan._id} className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {challan.challanNo}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-green-600">
                          {formatCurrency(challan.totalAmount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(challan.date)}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="font-medium text-gray-900 text-sm">
                        {challan.customer?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-600 font-mono">
                        Total: {formatCurrency(challan.totalAmount)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ActionButton
                        onClick={() => window.location.href = `/view/${challan._id}`}
                        icon={Eye}
                        className="text-blue-600 hover:bg-blue-50 text-xs px-2 py-1"
                      >
                        View
                      </ActionButton>
                      <ActionButton
                        onClick={() => openDeleteModal(challan)}
                        icon={Trash2}
                        className="text-red-600 hover:bg-red-50 text-xs px-2 py-1"
                      >
                        Delete
                      </ActionButton>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Challan No.</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Amount</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedChallans.map((challan, index) => (
                      <tr key={challan._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                            {challan.challanNo}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {challan.customer?.name || 'N/A'}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(challan.date)}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {challan.contact || 'N/A'}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-semibold text-green-600 font-mono">
                          {formatCurrency(challan.totalAmount)}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <ActionButton
                              onClick={() => window.location.href = `/view/${challan._id}`}
                              icon={Eye}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <span className="hidden sm:inline">View</span>
                            </ActionButton>
                            <ActionButton
                              onClick={() => openDeleteModal(challan)}
                              icon={Trash2}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <span className="hidden sm:inline">Delete</span>
                            </ActionButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-sm text-gray-700 text-center sm:text-left">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, challans.length)} of {challans.length} results
                    </div>
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-2 sm:px-3 py-2 cursor-pointer text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                      </button>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-2 sm:px-3 py-2 cursor-pointer text-xs sm:text-sm font-medium rounded-lg border transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium cursor-pointer text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Next</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
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
                    <span className="font-semibold">Challan No:</span> {challanToDelete.challanNo}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Customer:</span> {challanToDelete.customer?.name || 'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Amount:</span> {formatCurrency(challanToDelete.totalAmount)}
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