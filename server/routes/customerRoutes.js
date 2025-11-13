import express from 'express';
import { 
  createCustomer, 
  getAllCustomers, 
  getCustomer, 
  updateCustomer, 
  deleteCustomer 
} from '../controllers/customerController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Create a new customer
router.post('/new-customer', isAuthenticated, createCustomer);

// Get all customers
router.get('/get-coustmers', getAllCustomers);

// Get single customer
router.get('/:id', isAuthenticated, getCustomer);

// Update customer
router.put('/:id', isAuthenticated, updateCustomer);

// Delete customer
router.delete('/:id', isAuthenticated, deleteCustomer);

export default router;
