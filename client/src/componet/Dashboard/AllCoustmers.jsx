import React, { useState, useEffect } from 'react';
import { editCustomer, getAllCustomers } from '../../api/api';
import { toast } from 'sonner';

// Mock data for customers
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
  // State to store all customer data
  const [allCustomers, setAllCustomers] = useState([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to handle any errors
  const [error, setError] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;
  
  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  
  // Delete confirmation states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Calculate pagination values
  const totalPages = Math.ceil(allCustomers.length / customersPerPage);
  const startIndex = (currentPage - 1) * customersPerPage;
  const endIndex = startIndex + customersPerPage;
  const currentCustomers = allCustomers.slice(startIndex, endIndex);

  // Function to simulate API call with mock data
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data instead of API call

      const allCustomers = await getAllCustomers();

      console.log('Fetched Customers:', allCustomers);
       console.log('Using mock data for customers:', mockCustomers);

    if (allCustomers && allCustomers.length > 0) {
        setAllCustomers(allCustomers);
        } else {
            setAllCustomers(mockCustomers);
        }

      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers when component mounts
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Pagination functions
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Edit customer function
  const handleEdit = (customer) => {
    setEditingCustomer({ ...customer });
    setIsEditModalOpen(true);
  };

  // Save edited customer
  const handleSaveEdit = async() => {
    console.log("Saving edited customer:", editingCustomer);

    const data = await editCustomer(editingCustomer._id, editingCustomer);

    if (data && data.success) {
        toast.success(data.message || "Customer updated successfully!", {
            position: "top-center",
        });
    }

    if (!data || !data.success) {
        toast.error(data.message || "Failed to update customer", {
            position: "top-center",
        });
        
    }

    console.log("Customer updated successfully:", data);

    const updatedCustomers = allCustomers.map(customer => 
      customer._id === editingCustomer._id ? editingCustomer : customer
    );
    setAllCustomers(updatedCustomers);
    setIsEditModalOpen(false);
    setEditingCustomer(null);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingCustomer(null);
  };

  // Delete customer function
  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
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
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCustomerToDelete(null);
  };

  // Handle input changes in edit modal
  const handleInputChange = (field, value) => {
    setEditingCustomer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Show loading message
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading customers...</div>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">All Customers</h1>
        <p className="text-gray-600">
          Total customers: {allCustomers.length} | 
          Showing {startIndex + 1}-{Math.min(endIndex, allCustomers.length)} of {allCustomers.length}
        </p>
      </div>

      {/* Customers Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table Header */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Firm Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  GST Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                currentCustomers.map((customer) => (
                  <tr key={customer._id || customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.userName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="max-w-32 truncate" title={customer.firmName}>
                        {customer.firmName}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <a 
                        href={`mailto:${customer.email}`}
                        className="text-blue-600 hover:text-blue-800 block max-w-40 truncate"
                        title={customer.email}
                      >
                        {customer.email}
                      </a>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="max-w-28 truncate">{customer.phone}</div>
                        {customer.alternativePhone && (
                          <div className="text-gray-500 text-xs max-w-28 truncate">
                            Alt: {customer.alternativePhone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-mono hidden lg:table-cell">
                      {customer.gst}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 max-w-xs hidden xl:table-cell">
                      <div className="truncate" title={customer.firmAddress}>
                        {customer.firmAddress}
                      </div>
                      {customer.description && (
                        <div className="text-gray-500 text-xs mt-1 truncate" title={customer.description}>
                          {customer.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(customer)}
                          className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
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

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchCustomers}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Refresh Data
        </button>
      </div>

      {/* Edit Modal - FULLY VISIBLE BUTTONS */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8 flex flex-col min-h-0">
            {/* Modal Header - Fixed */}
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-medium text-gray-900">Edit Customer</h3>
            </div>
            
            {/* Modal Body - Scrollable */}
            <div className="px-6 py-4 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                  <input
                    type="text"
                    value={editingCustomer?.userName || ''}
                    onChange={(e) => handleInputChange('userName', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Firm Name</label>
                  <input
                    type="text"
                    value={editingCustomer?.firmName || ''}
                    onChange={(e) => handleInputChange('firmName', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingCustomer?.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingCustomer?.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Phone</label>
                  <input
                    type="text"
                    value={editingCustomer?.alternativePhone || ''}
                    onChange={(e) => handleInputChange('alternativePhone', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                  <input
                    type="text"
                    value={editingCustomer?.gst || ''}
                    onChange={(e) => handleInputChange('gst', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Firm Address</label>
                  <textarea
                    value={editingCustomer?.firmAddress || ''}
                    onChange={(e) => handleInputChange('firmAddress', e.target.value)}
                    rows="2"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingCustomer?.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows="2"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                  />
                </div>
              </div>
            </div>
            
            {/* Modal Footer - Always Visible */}
            <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-1/2 transform -translate-y-1/2 mx-auto p-5 border w-11/12 md:w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Customer</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete <strong>{customerToDelete?.userName}</strong> from <strong>{customerToDelete?.firmName}</strong>?
              </p>
              <p className="text-xs text-red-500 mb-6">This action cannot be undone.</p>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCustomers;