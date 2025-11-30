import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: 'New Customer'
    },
    firmName: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    gstNumber: {
      type: String,
      default: ''
    },
    createdBy: {
      type: String,
      default: '000000000000' // Default user ID for testing
    },
  },
  {
    timestamps: true,
    minimize: false // Ensure empty objects are returned
  }
);

// This line will drop the unique index on the 'email' field. 
// It can be removed after the application has started once with this code.
customerSchema.pre('save', function (next) {
  this.constructor.collection.dropIndex('email_1', function(err, result) {
    // Ignore errors if the index doesn't exist
    next();
  });
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
