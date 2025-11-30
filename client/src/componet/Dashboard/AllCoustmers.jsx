import React, { useState, useEffect } from 'react';
import { deleteCustomer, updateCustomer, getAllCustomers } from '../../api/api.js';
import { toast } from 'sonner';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Edit2, Trash2, RefreshCw, X, Users, Mail, Phone, MapPin, FileText } from 'lucide-react';

// Customer data will be fetched from the API

const AllCustomers = () => {
  // State management
  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Search and Sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const customersPerPage = 10;

  // Search function
  const filteredCustomers = allCustomers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.userName?.toLowerCase().includes(searchLower) ||
      customer.firmName?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.toLowerCase().includes(searchLower) ||
      customer.alternativePhone?.toLowerCase().includes(searchLower) ||
      customer.gst?.toLowerCase().includes(searchLower) ||
      customer.id?.toLowerCase().includes(searchLower) ||
      customer.firmAddress?.toLowerCase().includes(searchLower)
    );
  });

  // Sort function
  const sortedCustomers = React.useMemo(() => {
    if (!sortConfig.key) return filteredCustomers;

    return [...filteredCustomers].sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredCustomers, sortConfig]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Get sort icon
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc'
      ? <ArrowUp className="w-4 h-4 text-blue-600" />
      : <ArrowDown className="w-4 h-4 text-blue-600" />;
  };

  // Reset search and pagination when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllCustomers();

      // Map API response to match component's expected structure
      const mappedCustomers = response.data.map(customer => ({
        ...customer,
        userName: customer.name || customer.userName,
        firmAddress: customer.address || customer.firmAddress,
        gst: customer.gstNumber || customer.gst,
        id: customer._id // Map _id to id if needed
      }));

      setAllCustomers(mappedCustomers);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please try again.');
      setAllCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect hooks
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Check screen size for mobile view
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Calculate pagination values (using sorted and filtered customers)
  const totalPages = Math.ceil(sortedCustomers.length / customersPerPage);
  const startIndex = (currentPage - 1) * customersPerPage;
  const endIndex = startIndex + customersPerPage;
  const currentCustomers = sortedCustomers.slice(startIndex, endIndex);

  // Pagination functions
  const goToPage = (page) => setCurrentPage(page);
  const goToPrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Modal functions
  const handleEdit = (customer) => {
    setEditingCustomer({ ...customer });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (!editingCustomer) return;

      // Prepare the data to send to the API (matches backend Customer.js model)
      const customerData = {
        name: editingCustomer.userName || editingCustomer.name,
        firmName: editingCustomer.firmName || '',
        email: editingCustomer.email || '',
        phone: editingCustomer.phone || '',
        address: editingCustomer.firmAddress || editingCustomer.address || ''
      };

      // Only include gstNumber if it has a value
      if (editingCustomer.gst || editingCustomer.gstNumber) {
        customerData.gstNumber = editingCustomer.gst || editingCustomer.gstNumber;
      }

      const response = await updateCustomer(editingCustomer._id, customerData);

      if (response && response.success) {
        toast.success("Customer updated successfully!", {
          position: "top-center"
        });
      }

      // Update local state with the edited customer
      const updatedCustomers = allCustomers.map(customer =>
        customer._id === editingCustomer._id
          ? { ...editingCustomer, ...customerData }
          : customer
      );

      setAllCustomers(updatedCustomers);

      // Close modal and reset state
      setIsEditModalOpen(false);
      setEditingCustomer(null);

      // Refresh data from server to ensure consistency
      fetchCustomers();

    } catch (error) {
      console.error("Failed to update customer:", error);
      toast.error("Failed to update customer. Please try again.", {
        position: "top-center"
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingCustomer(null);
  };

  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {

      const response = await deleteCustomer(customerToDelete._id)

      if (response.success) {
        toast.success("Customer deleted successfully!", {
          position: "top-center"
        });
      }

      const updatedCustomers = allCustomers.filter(customer =>
        customer._id !== customerToDelete._id
      );
      setAllCustomers(updatedCustomers);
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);

      // Adjust current page if necessary
      const newTotalPages = Math.ceil(updatedCustomers.length / customersPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }

      //alert("Customer deleted successfully!");
    } catch (error) {
      console.error("Failed to delete customer:", error);
      alert("Failed to delete customer. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCustomerToDelete(null);
  };

  const handleInputChange = (field, value) => {
    setEditingCustomer(prev => ({ ...prev, [field]: value }));
  };

  // Modern Customer Card Component
  const CustomerCard = ({ customer }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900">{customer.userName}</h3>
          <p className="text-sm text-gray-600 mt-1">{customer.firmName}</p>
          <p className="text-xs text-gray-500 font-mono mt-2 bg-gray-100 px-2 py-1 rounded w-fit">{customer.id}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(customer)}
            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
            title="Edit customer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(customer)}
            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            title="Delete customer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="space-y-3 border-t border-gray-100 pt-4">
        <div className="flex items-start gap-3">
          <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 font-medium">Email</p>
            <a href={`mailto:${customer.email}`} className="text-sm text-blue-600 hover:text-blue-800 break-all">
              {customer.email}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-gray-600 font-medium">Phone</p>
            <p className="text-sm text-gray-900">{customer.phone}</p>
            {customer.alternativePhone && (
              <p className="text-xs text-gray-500 mt-1">Alt: {customer.alternativePhone}</p>
            )}
          </div>
        </div>

        {customer.gst && (
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-600 font-medium">GST Number</p>
              <p className="text-sm font-mono text-gray-900">{customer.gst}</p>
            </div>
          </div>
        )}

        {customer.firmAddress && (
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-600 font-medium">Address</p>
              <p className="text-sm text-gray-900">{customer.firmAddress}</p>
            </div>
          </div>
        )}

        {customer.description && (
          <div className="bg-gray-50 rounded p-3 mt-3">
            <p className="text-xs text-gray-600 font-medium mb-1">Notes</p>
            <p className="text-sm text-gray-700">{customer.description}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Directory</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and organize your customer information</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{allCustomers.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Filtered</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{sortedCustomers.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Current Page</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{currentPage}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <p className="text-gray-600 text-xs font-medium uppercase tracking-wide">Total Pages</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalPages}</p>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, GST, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchCustomers}
              disabled={loading}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {/* Search Info */}
          {searchTerm && (
            <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
              <span className="font-medium">Results:</span> 
              <span>{sortedCustomers.length} customer{sortedCustomers.length !== 1 ? 's' : ''} found</span>
              {sortConfig.key && (
                <span className="text-blue-600 font-medium">
                  • Sorted by {sortConfig.key} ({sortConfig.direction === 'asc' ? '↑' : '↓'})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"></div>
            <span className="text-gray-600 font-medium">Loading customers...</span>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900">Failed to Load Customers</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button
                  onClick={fetchCustomers}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customer Data Display */}
        {!loading && !error && (
          <>
            {/* Empty State */}
            {currentCustomers.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? `No customers found for "${searchTerm}"` : 'No customers found'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first customer'}
                </p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Mobile View - Cards */}
                {isMobileView ? (
                  <div className="space-y-4">
                    {currentCustomers.map((customer) => (
                      <CustomerCard 
                        key={customer._id || customer.id} 
                        customer={customer}
                      />
                    ))}
                  </div>
                ) : (
                  /* Desktop View - Modern Table */
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <th 
                              className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                              onClick={() => handleSort('userName')}
                            >
                              <div className="flex items-center gap-2">
                                <span>Name</span>
                                {getSortIcon('userName')}
                              </div>
                            </th>
                            <th 
                              className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                              onClick={() => handleSort('firmName')}
                            >
                              <div className="flex items-center gap-2">
                                <span>Firm</span>
                                {getSortIcon('firmName')}
                              </div>
                            </th>
                            <th 
                              className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                              onClick={() => handleSort('email')}
                            >
                              <div className="flex items-center gap-2">
                                <span>Email</span>
                                {getSortIcon('email')}
                              </div>
                            </th>
                            <th 
                              className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                              onClick={() => handleSort('phone')}
                            >
                              <div className="flex items-center gap-2">
                                <span>Phone</span>
                                {getSortIcon('phone')}
                              </div>
                            </th>
                            <th 
                              className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors hidden lg:table-cell"
                              onClick={() => handleSort('gst')}
                            >
                              <div className="flex items-center gap-2">
                                <span>GST</span>
                                {getSortIcon('gst')}
                              </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {currentCustomers.map((customer) => (
                            <tr 
                              key={customer._id || customer.id} 
                              className="hover:bg-blue-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <p className="font-medium text-gray-900">{customer.userName}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">{customer.firmName}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <p className="text-sm text-gray-900 max-w-xs truncate" title={customer.firmName}>
                                  {customer.firmName}
                                </p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <a 
                                  href={`mailto:${customer.email}`}
                                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                  title={customer.email}
                                >
                                  {customer.email}
                                </a>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  <p>{customer.phone}</p>
                                  {customer.alternativePhone && (
                                    <p className="text-xs text-gray-500">Alt: {customer.alternativePhone}</p>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                <p className="text-sm font-mono text-gray-700">{customer.gst}</p>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEdit(customer)}
                                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                                    title="Edit customer"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(customer)}
                                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                    title="Delete customer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Modern Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-sm text-gray-700 font-medium">
                  Page <span className="font-bold text-blue-600">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    ← Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, isMobileView ? 3 : 5) }, (_, i) => {
                      let page;
                      if (isMobileView) {
                        page = Math.max(1, Math.min(totalPages - 2, currentPage - 1)) + i;
                      } else {
                        page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      }
                      
                      if (page <= totalPages) {
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                              currentPage === page
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modern Edit Modal */}
        {isEditModalOpen && editingCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center sticky top-0">
                <h2 className="text-white font-bold text-lg">Edit Customer</h2>
                <button 
                  onClick={handleCancelEdit} 
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Form Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                    <input
                      type="text"
                      value={editingCustomer.userName || ''}
                      onChange={(e) => handleInputChange('userName', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Firm Name</label>
                    <input
                      type="text"
                      value={editingCustomer.firmName || ''}
                      onChange={(e) => handleInputChange('firmName', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Company name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={editingCustomer.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="user@company.com"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                    <input
                      type="text"
                      value={editingCustomer.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+1-555-0000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Alt. Phone</label>
                    <input
                      type="text"
                      value={editingCustomer.alternativePhone || ''}
                      onChange={(e) => handleInputChange('alternativePhone', e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Optional"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">GST Number</label>
                  <input
                    type="text"
                    value={editingCustomer.gst || ''}
                    onChange={(e) => handleInputChange('gst', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Business Address</label>
                  <textarea
                    value={editingCustomer.firmAddress || ''}
                    onChange={(e) => handleInputChange('firmAddress', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Complete business address"
                  />
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modern Delete Confirmation Modal */}
        {isDeleteModalOpen && customerToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-white font-bold text-lg">Delete Customer</h2>
                <button 
                  onClick={handleCancelDelete} 
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                      <Trash2 className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Delete {customerToDelete.userName}?
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      This action cannot be undone. All customer data including invoices and records will be permanently deleted.
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Customer:</span> {customerToDelete.firmName}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
                >
                  Delete Customer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCustomers;