import React, { useState, useEffect } from 'react';
import { deleteCustomer, editCustomer, getAllCustomers } from '../../api/api.js';
import { toast } from 'sonner';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

// Mock data as fallback
const mockCustomers = [
  {
    _id: "1",
    id: "CUST001",
    userName: "John Doe",
    firmName: "ABC Electronics",
    firmAddress: "123 Main Street, New York, NY 10001",
    phone: "+1-555-0101",
    alternativePhone: "+1-555-0102",
    email: "john.doe@abcelectronics.com",
    gst: "22AAAAA0000A1Z5",
    description: "Regular customer, high volume orders"
  },
  {
    _id: "2",
    id: "CUST002",
    userName: "Jane Smith",
    firmName: "Tech Solutions Inc",
    firmAddress: "456 Oak Avenue, Los Angeles, CA 90210",
    phone: "+1-555-0201",
    alternativePhone: "+1-555-0202",
    email: "jane.smith@techsolutions.com",
    gst: "27BBBBB1111B2Z6",
    description: "New customer, premium services"
  },
  {
    _id: "3",
    id: "CUST003",
    userName: "Mike Johnson",
    firmName: "Global Imports LLC",
    firmAddress: "789 Pine Road, Chicago, IL 60601",
    phone: "+1-555-0301",
    alternativePhone: "+1-555-0302",
    email: "mike.johnson@globalimports.com",
    gst: "19CCCCC2222C3Z7",
    description: "International trade customer"
  },
  {
    _id: "4",
    id: "CUST004",
    userName: "Sarah Wilson",
    firmName: "Creative Designs Studio",
    firmAddress: "321 Elm Street, Miami, FL 33101",
    phone: "+1-555-0401",
    alternativePhone: "+1-555-0402",
    email: "sarah.wilson@creativedesigns.com",
    gst: "33DDDDD3333D4Z8",
    description: "Design and marketing services"
  },
  {
    _id: "5",
    id: "CUST005",
    userName: "David Brown",
    firmName: "Manufacturing Co",
    firmAddress: "654 Maple Drive, Houston, TX 77001",
    phone: "+1-555-0501",
    alternativePhone: "+1-555-0502",
    email: "david.brown@manufacturingco.com",
    gst: "06EEEEE4444E5Z9",
    description: "Industrial manufacturing client"
  }
];

const AllCustomers = () => {
  // State management
  const [allCustomers, setAllCustomers] = useState([]);
  const [usingMockData, setUsingMockData] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // Fetch customers from API with fallback to mock data
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingMockData(false);
      
      const response = await getAllCustomers();

      console.log('API Response:', response?.data);
      const customers = response?.data|| [];

      console.log('Parsed Customers:', customers);
      
      if (customers.length > 0) {
        setAllCustomers(customers);
        console.log('✅ Loaded real data from API');
        console.log(customers)
      } else {
        // Fallback to mock data if API returns empty
        setAllCustomers(mockCustomers);
        setUsingMockData(true);
        console.log('⚠️ API returned empty data, using mock data');
      }
    } catch (error) {
      console.error('❌ API Error, falling back to mock data:', error);
      setAllCustomers(mockCustomers);
      setUsingMockData(true);
      setError(null); // Clear error since we have fallback data
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
      
      // Here you would typically call the API to update the customer
     const response = await editCustomer(editingCustomer._id, editingCustomer);

     if(response && response.success) {

      toast.success("Customer updated successfully!",{
        position: "top-center"
      });

    }
      
     
      const updatedCustomers = allCustomers.map(customer => 
        customer._id === editingCustomer._id ? editingCustomer : customer
      );
      setAllCustomers(updatedCustomers);
      
      // Close modal and reset state
      setIsEditModalOpen(false);
      setEditingCustomer(null);
      
      // Refresh data from server
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

      if(response.success){
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

  // Mobile Card Component
  const CustomerCard = ({ customer, isFirst }) => (
    <div className={`p-4 rounded-lg shadow-md border space-y-3 ${
      isFirst 
        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{customer.userName}</h3>
          <p className="text-sm text-gray-600">{customer.firmName}</p>
          <p className="text-xs text-gray-500 font-mono">{customer.id}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(customer)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(customer)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium text-gray-700">Email: </span>
          <a href={`mailto:${customer.email}`} className="text-blue-600 hover:text-blue-800 break-all">
            {customer.email}
          </a>
        </div>
        <div>
          <span className="font-medium text-gray-700">Phone: </span>
          <span className="text-gray-900">{customer.phone}</span>
          {customer.alternativePhone && (
            <span className="text-gray-500 text-xs ml-2">Alt: {customer.alternativePhone}</span>
          )}
        </div>
        <div>
          <span className="font-medium text-gray-700">GST: </span>
          <span className="text-gray-900 font-mono text-xs">{customer.gst}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Address: </span>
          <span className="text-gray-900">{customer.firmAddress}</span>
        </div>
        {customer.description && (
          <div>
            <span className="font-medium text-gray-700">Description: </span>
            <span className="text-gray-600">{customer.description}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">All Customers</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Total: {allCustomers.length} | 
                Filtered: {sortedCustomers.length} | 
                Showing {currentCustomers.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, sortedCustomers.length)} of {sortedCustomers.length}
                {usingMockData && (
                  <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    Demo Data
                  </span>
                )}
              </p>
            </div>

            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <span className="text-gray-400 hover:text-gray-600 text-sm">✕</span>
                  </button>
                )}
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchCustomers}
                disabled={loading}
                className="px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="mb-3 text-sm text-gray-600">
              <span className="font-medium">Search results for:</span> "{searchTerm}" 
              <span className="ml-2">({sortedCustomers.length} found)</span>
              {sortConfig.key && (
                <span className="ml-2 text-blue-600">
                  • Sorted by {sortConfig.key} ({sortConfig.direction === 'asc' ? '↑' : '↓'})
                </span>
              )}
            </div>
          )}
          
          {/* Mock Data Notice */}
          {usingMockData && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              <span className="font-medium">ℹ️ Demo Mode:</span> Showing sample data because API is unavailable. 
              <button 
                onClick={fetchCustomers} 
                className="ml-1 text-yellow-900 underline hover:no-underline"
              >
                Try reconnecting
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading customers...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Customers</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-3">
                  <button
                    onClick={fetchCustomers}
                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Data Display */}
        {!loading && !error && (
          <>
            {/* Mobile View - Cards */}
            {isMobileView ? (
              <div className="space-y-4">
                {currentCustomers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="w-12 h-12 mx-auto mb-2" />
                    </div>
                    <div className="text-gray-500">
                      {searchTerm ? (
                        <>
                          <p className="font-medium">No customers found for "{searchTerm}"</p>
                          <p className="text-sm mt-1">Try adjusting your search terms</p>
                          <button 
                            onClick={() => setSearchTerm('')}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
                          >
                            Clear search
                          </button>
                        </>
                      ) : (
                        <p>No customers found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  currentCustomers.map((customer, index) => (
                    <CustomerCard 
                      key={customer._id || customer.id} 
                      customer={customer} 
                      isFirst={index === 0}
                    />
                  ))
                )}
              </div>
            ) : (
              /* Desktop View - Table */
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Customer ID</span>
                        {getSortIcon('id')}
                      </div>
                    </th>
                    <th 
                      className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('userName')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>User Name</span>
                        {getSortIcon('userName')}
                      </div>
                    </th>
                    <th 
                      className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('firmName')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Firm Name</span>
                        {getSortIcon('firmName')}
                      </div>
                    </th>
                    <th 
                      className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Email</span>
                        {getSortIcon('email')}
                      </div>
                    </th>
                    <th 
                      className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('phone')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Phone</span>
                        {getSortIcon('phone')}
                      </div>
                    </th>
                    <th 
                      className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('gst')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>GST Number</span>
                        {getSortIcon('gst')}
                      </div>
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Address
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center">
                        <div className="text-gray-400 mb-4">
                          <Search className="w-8 h-8 mx-auto mb-2" />
                        </div>
                        <div className="text-gray-500">
                          {searchTerm ? (
                            <>
                              <p className="font-medium">No customers found for "{searchTerm}"</p>
                              <p className="text-sm mt-1">Try adjusting your search terms</p>
                              <button 
                                onClick={() => setSearchTerm('')}
                                className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
                              >
                                Clear search
                              </button>
                            </>
                          ) : (
                            <p>No customers found</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentCustomers.map((customer, index) => (
                      <tr 
                        key={customer._id || customer.id} 
                        className={`transition-colors ${
                          index === 0 
                            ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-400' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {customer.id}
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.userName}
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="max-w-32 truncate" title={customer.firmName}>
                            {customer.firmName}
                          </div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <a 
                            href={`mailto:${customer.email}`}
                            className="text-blue-600 hover:text-blue-800 block max-w-40 truncate transition-colors"
                            title={customer.email}
                          >
                            {customer.email}
                          </a>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="max-w-28 truncate">{customer.phone}</div>
                            {customer.alternativePhone && (
                              <div className="text-gray-500 text-xs max-w-28 truncate">
                                Alt: {customer.alternativePhone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono hidden lg:table-cell">
                          {customer.gst}
                        </td>
                        <td className="px-3 lg:px-6 py-4 text-sm text-gray-900 max-w-xs hidden xl:table-cell">
                          <div className="truncate" title={customer.firmAddress}>
                            {customer.firmAddress}
                          </div>
                          {customer.description && (
                            <div className="text-gray-500 text-xs mt-1 truncate" title={customer.description}>
                              {customer.description}
                            </div>
                          )}
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-1 lg:space-x-2">
                            <button
                              onClick={() => handleEdit(customer)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-2 lg:px-3 py-1 rounded text-xs transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(customer)}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 lg:px-3 py-1 rounded text-xs transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
            )}

            {/* Responsive Pagination */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-700 text-center sm:text-left">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                currentPage === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Prev
            </button>

            <div className="flex space-x-1">
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
                      className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
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
              className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
            </div>
          </>
        )}

        {/* Modern Professional Alert Popup */}
        {isEditModalOpen && editingCustomer && (
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 w-96">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200">
              {/* Modern Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                  <span className="text-white font-medium text-sm">Edit Customer Information</span>
                </div>
                <button 
                  onClick={handleCancelEdit} 
                  className="text-white hover:bg-white hover:text-red-600 w-6 h-6 flex items-center justify-center rounded transition-colors"
                >
                  ×
                </button>
              </div>
              
              {/* Professional Form Body */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={editingCustomer.userName || ''}
                      onChange={(e) => handleInputChange('userName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Firm Name *</label>
                    <input
                      type="text"
                      value={editingCustomer.firmName || ''}
                      onChange={(e) => handleInputChange('firmName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Company name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={editingCustomer.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="user@company.com"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="text"
                      value={editingCustomer.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="+1-555-0000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alt. Phone</label>
                    <input
                      type="text"
                      value={editingCustomer.alternativePhone || ''}
                      onChange={(e) => handleInputChange('alternativePhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Optional"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    value={editingCustomer.gst || ''}
                    onChange={(e) => handleInputChange('gst', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                  <textarea
                    value={editingCustomer.firmAddress || ''}
                    onChange={(e) => handleInputChange('firmAddress', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Complete business address"
                  />
                </div>
              </div>
              
              {/* Professional Action Buttons */}
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg flex justify-end space-x-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Update Customer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal - Alert Style with Visible Background */}
        {isDeleteModalOpen && customerToDelete && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-96 pointer-events-none">
            <div className="bg-white rounded-lg shadow-2xl border-2 border-red-300 pointer-events-auto">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">Delete Customer</h3>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  Are you sure you want to delete <strong>{customerToDelete.userName}</strong> from <strong>{customerToDelete.firmName}</strong>?
                </p>
                <p className="text-xs text-red-500 mb-6 text-center">This action cannot be undone.</p>
                
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleCancelDelete}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCustomers;