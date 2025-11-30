import express from 'express';
import {
  createCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController.js';
import { validateCustomer } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /api/v1/customers
 * @desc    Create a new customer
 * @access  Public
 */
router.post('/', createCustomer);

/**
 * @route   GET /api/v1/customers
 * @desc    Get all customers
 * @access  Public
 */
router.get('/', getAllCustomers);

/**
 * @route   GET /api/v1/customers/:id
 * @desc    Get single customer by ID
 * @access  Public
 */
router.get('/:id', getCustomer);

/**
 * @route   PUT /api/v1/customers/:id
 * @desc    Update a customer
 * @access  Public
 */
router.put('/:id', updateCustomer);

/**
 * @route   DELETE /api/v1/customers/:id
 * @desc    Delete a customer
 * @access  Public
 */
router.delete('/:id', deleteCustomer);

export default router;
