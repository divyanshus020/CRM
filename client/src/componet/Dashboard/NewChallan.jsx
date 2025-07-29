import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Table,
  InputNumber,
  Space,
  Row,
  Col,
  Typography,
  message,
  Popconfirm,
  Alert,
  Checkbox,
  Modal
} from 'antd';
import {
  Plus,
  Trash2,
  Save,
  Calculator,
  Users,
  Calendar,
  Hash,
  IndianRupee,
  Package,
  Building,
  Truck,
  FileText,
  CheckSquare
} from 'lucide-react';

import dayjs from 'dayjs';
import { createChallan, getAllCustomers, newCostomer } from '../../api/api';
import { toast } from 'react-toastify';


const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CreateChallanForm = () => {
  const [form] = Form.useForm();
  const [customerForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [items, setItems] = useState([
    { key: Date.now(), particulars: '', hsnCode: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [calculations, setCalculations] = useState({
    subTotal: 0,
    gstPercentage: 18,
    gstAmount: 0,
    totalAmount: 0
  });

  // Memoized currency formatter
  const formatCurrency = useMemo(() => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    });
  }, []);

  // Memoized calculations
  const calculatedTotals = useMemo(() => {
    const subTotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const gstAmount = (subTotal * calculations.gstPercentage) / 100;
    const totalAmount = subTotal + gstAmount;
    
    return { subTotal, gstAmount, totalAmount };
  }, [items, calculations.gstPercentage]);

  // Update calculations when memoized values change
  useEffect(() => {
    setCalculations(prev => ({
      ...prev,
      ...calculatedTotals
    }));
  }, [calculatedTotals]);

  // Memoized customer options for Select
  const customerOptions = useMemo(() => {
    return customers.map(customer => (
      <Option key={customer._id} value={customer._id}>
        {customer.userName || customer.firmName} 
        {customer.firmName && customer.userName && ` (${customer.firmName})`}
      </Option>
    ));
  }, [customers]);

  // Optimized item change handler with useCallback
  const handleItemChange = useCallback((key, field, value) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.key !== key) return item;
        
        const updatedItem = { ...item, [field]: value };
        
        // Calculate amount when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          const quantity = field === 'quantity' ? value : updatedItem.quantity;
          const rate = field === 'rate' ? value : updatedItem.rate;
          updatedItem.amount = (quantity || 0) * (rate || 0);
        }
        
        return updatedItem;
      });
    });
  }, []);

  // Memoized table columns to prevent recreation on each render
  const columns = useMemo(() => [
    {
      title: '#',
      key: 'index',
      width: 50,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Particulars',
      key: 'particulars',
      render: (_, record) => (
        <Input
          placeholder="Enter item particulars"
          value={record.particulars}
          onChange={(e) => handleItemChange(record.key, 'particulars', e.target.value)}
          status={!record.particulars ? 'error' : ''}
        />
      ),
    },
    {
      title: 'HSN Code',
      key: 'hsnCode',
      width: 120,
      render: (_, record) => (
        <Input
          placeholder="HSN Code"
          value={record.hsnCode}
          onChange={(e) => handleItemChange(record.key, 'hsnCode', e.target.value)}
          status={!record.hsnCode ? 'error' : ''}
        />
      ),
    },
    {
      title: 'Quantity',
      key: 'quantity',
      width: 120,
      render: (_, record) => (
        <InputNumber
          min={1}
          precision={0}
          placeholder="Qty"
          value={record.quantity}
          onChange={(value) => handleItemChange(record.key, 'quantity', value)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Rate (₹)',
      key: 'rate',
      width: 130,
      render: (_, record) => (
        <InputNumber
          min={0}
          precision={2}
          placeholder="0.00"
          value={record.rate}
          onChange={(value) => handleItemChange(record.key, 'rate', value)}
          style={{ width: '100%' }}
          formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/₹\s?|(,*)/g, '')}
        />
      ),
    },
    {
      title: 'Amount (₹)',
      key: 'amount',
      width: 130,
      align: 'right',
      render: (_, record) => (
        <Text strong className="text-green-600 text-base">
          {formatCurrency.format(record.amount || 0)}
        </Text>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="Delete Item"
          description="Are you sure?"
          onConfirm={() => removeItem(record.key)}
          disabled={items.length === 1}
        >
          <Button
            type="text"
            danger
            icon={<Trash2 size={16} />}
            disabled={items.length === 1}
          />
        </Popconfirm>
      ),
    },
  ], [handleItemChange, formatCurrency, items.length]);

  // Cached customer fetch function
  const fetchCustomers = useCallback(async () => {
    try {
      const response = await getAllCustomers();
      console.log('Fetched Customers:', response.data);
      if (response.success) {
        setCustomers(response.data);
      } else {
        message.error('Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      message.error('Failed to load customers');
    }
  }, []);

  const generateChallanNumber = useCallback(() => {
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const challanNumber = `CH-${random}`;
    form.setFieldsValue({ challanNo: challanNumber });
  }, [form]);

  const addItem = useCallback(() => {
    const newItem = {
      key: Date.now(),
      particulars: '',
      hsnCode: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  const removeItem = useCallback((key) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.key !== key));
    } else {
      message.warning('At least one item is required');
    }
  }, [items.length]);

  const handleGSTChange = useCallback((value) => {
    setCalculations(prev => ({
      ...prev,
      gstPercentage: value || 0
    }));
  }, []);

  const handleCustomerChange = useCallback((customerId) => {
    const customer = customers.find(c => c._id === customerId);
    setSelectedCustomer(customer);
    console.log('Selected Customer:', customer);
  }, [customers]);

  const handleAddCustomer = useCallback(async (values) => {
    try {
      setCustomerLoading(true);
      console.log('Adding Customer with values:', values);
      const response = await newCostomer(values);
      
      if (response.success) {
        toast.success('Customer added successfully!',{
          position: 'top-center',
          autoClose: 5000,
        });
        setCustomerModalVisible(false);
        customerForm.resetFields();
        await fetchCustomers();
      } else {
        message.error('Failed to add customer');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      message.error('Failed to add customer');
    } finally {
      setCustomerLoading(false);
    }
  }, [customerForm, fetchCustomers]);

  const validateItems = useCallback(() => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.particulars || !item.particulars.trim()) {
        message.error(`Item ${i + 1}: Particulars is required`);
        return false;
      }
      if (!item.hsnCode || !item.hsnCode.trim()) {
        message.error(`Item ${i + 1}: HSN Code is required`);
        toast.error(`Item ${i + 1}: HSN Code is required`,{
          position: 'top-center',
        });
        return false;
      }
      if (!item.quantity || item.quantity <= 0) {
        message.error(`Item ${i + 1}: Quantity must be greater than 0`);
        return false;
      }
      if (!item.rate || item.rate <= 0) {
        message.error(`Item ${i + 1}: Rate must be greater than 0`);
        return false;
      }
    }
    return true;
  }, [items]);

  const resetForm = useCallback(() => {
    form.resetFields();
    setSelectedCustomer(null);
    setItems([{ key: Date.now(), particulars: '', hsnCode: '', quantity: 1, rate: 0, amount: 0 }]);
    generateChallanNumber();
    
    // Reset default values
    form.setFieldsValue({
      date: dayjs(),
      firmName: 'ABC Traders',
      gstin: '22ABCDE1234F1Z5',
      pan: 'ABCDE1234F',
      contact: '9876543210',
      issuedBy: 'Ramesh Kumar',
      eoe: false
    });
  }, [form, generateChallanNumber]);

  const handleSubmit = useCallback(async (values) => {
    console.log('Form Values before validation:', values);
    console.log('Selected Customer State:', selectedCustomer);

    values.customer = selectedCustomer;

    if (!values.customer) {
      message.error('Please select a customer');
      return;
    }

    const customerFromList = customers.find(c => c._id === values.customer._id);
    if (!customerFromList) {
      message.error('Selected customer not found. Please refresh and try again.');
      return;
    }

    if (!validateItems()) {
      return;
    }

    try {
      setLoading(true);

      const challanData = {
        challanNo: values.challanNo,
        date: values.date.toDate(),
        firmName: values.firmName,
        gstin: values.gstin,
        pan: values.pan,
        contact: values.contact,
        customer: {
          id: customerFromList._id,
          name: customerFromList.userName || customerFromList.firmName || '',
          address: customerFromList.firmAddress || '',
          gstin: customerFromList.gst || ''
        },
        poNumber: values.poNumber || '',
        poDate: values.poDate ? values.poDate.toDate() : null,
        vehicleNo: values.vehicleNo || '',
        items: items.map(({ key, ...item }) => item),
        subTotal: calculations.subTotal,
        gstPercentage: calculations.gstPercentage,
        gstAmount: calculations.gstAmount,
        totalAmount: calculations.totalAmount,
        eoe: values.eoe || false,
        receiverSign: values.receiverSign || null,
        issuedBy: values.issuedBy
      };

      console.log('Challan Data to be sent:', challanData);
      
      const response = await createChallan(challanData);

      if(response.success) {

        toast.success(response.message || 'Challan created successfully!', {
          position: 'top-center',
          autoClose: 8000,
        });

         message.success('Challan created successfully!');
         resetForm();
      }

      
     
      
    } catch (error) {
      console.error('Error creating challan:', error);
      message.error('Failed to create challan. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedCustomer, customers, validateItems, items, calculations, resetForm]);

  // Initialize component
  useEffect(() => {
    fetchCustomers();
    generateChallanNumber();
    
    // Set default values
    form.setFieldsValue({
      date: dayjs(),
      firmName: 'ABC Traders',
      gstin: '22ABCDE1234F1Z5',
      pan: 'ABCDE1234F',
      contact: '9876543210',
      issuedBy: 'Ramesh Kumar',
      eoe: false
    });
  }, [fetchCustomers, generateChallanNumber, form]);

  // Validation alert component
  const ValidationAlert = useMemo(() => {
    const hasInvalidItems = items.some(item => 
      !item.particulars || !item.hsnCode || item.quantity <= 0 || item.rate <= 0
    );
    
    return hasInvalidItems ? (
      <Alert
        message="Please fill all item details"
        type="warning"
        showIcon
        className="mb-4"
      />
    ) : null;
  }, [items]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Title level={2} className="mb-2 text-gray-800">Create New Challan</Title>
        <Text type="secondary">Fill in the details to create a delivery challan</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card 
          title={
            <span className="flex items-center gap-2 text-lg">
              <Hash size={20} className="text-blue-600" />
              Basic Information
            </span>
          }
          className="shadow-sm"
        >
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Challan Number"
                name="challanNo"
                rules={[{ required: true, message: 'Challan number is required' }]}
              >
                <Input
                  prefix={<Hash size={16} className="text-gray-400" />}
                  readOnly
                  className="bg-gray-50"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: 'Date is required' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  suffixIcon={<Calendar size={16} />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Issued By"
                name="issuedBy"
                rules={[{ required: true, message: 'Issued By is required' }]}
              >
                <Input
                  prefix={<Users size={16} className="text-gray-400" />}
                  placeholder="Enter issuer name"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Firm Information */}
        <Card 
          title={
            <span className="flex items-center gap-2 text-lg">
              <Building size={20} className="text-green-600" />
              Firm Information
            </span>
          }
          className="shadow-sm"
        >
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Firm Name"
                name="firmName"
                rules={[{ required: true, message: 'Firm name is required' }]}
              >
                <Input placeholder="Enter firm name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="GSTIN"
                name="gstin"
                rules={[{ required: true, message: 'GSTIN is required' }]}
              >
                <Input placeholder="Enter GSTIN" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="PAN"
                name="pan"
                rules={[{ required: true, message: 'PAN is required' }]}
              >
                <Input placeholder="Enter PAN" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Contact"
                name="contact"
                rules={[{ required: true, message: 'Contact is required' }]}
              >
                <Input placeholder="Enter contact number" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Customer Information */}
        <Card 
          title={
            <span className="flex items-center gap-2 text-lg">
              <Users size={20} className="text-purple-600" />
              Customer Information
            </span>
          }
          className="shadow-sm"
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Customer"
                name="customer"
              >
                <div className="flex gap-2">
                  <Select
                    placeholder="Select customer"
                    showSearch
                    optionFilterProp="children"
                    style={{ flex: 1 }}
                    notFoundContent="No customer found"
                    onChange={handleCustomerChange}
                    value={form.getFieldValue('customer')}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {customerOptions}
                  </Select>
                  <Button
                    type="dashed"
                    icon={<Plus size={16} />}
                    onClick={() => setCustomerModalVisible(true)}
                    className="flex items-center gap-1"
                  >
                    Add Customer
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
          
          {/* Display selected customer details */}
          {selectedCustomer && (
            <Alert
              message="Selected Customer Details"
              description={
                <div>
                  <p><strong>Name:</strong> {selectedCustomer.userName}</p>
                  <p><strong>Firm:</strong> {selectedCustomer.firmName}</p>
                  <p><strong>GST:</strong> {selectedCustomer.gst}</p>
                  <p><strong>Address:</strong> {selectedCustomer.firmAddress}</p>
                </div>
              }
              type="info"
              showIcon
              className="mt-4"
            />
          )}
        </Card>

        {/* Purchase Order & Vehicle Information */}
        <Card 
          title={
            <span className="flex items-center gap-2 text-lg">
              <FileText size={20} className="text-orange-600" />
              Purchase Order & Vehicle Details
            </span>
          }
          className="shadow-sm"
        >
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label="PO Number"
                name="poNumber"
              >
                <Input placeholder="Enter PO Number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="PO Date"
                name="poDate"
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  suffixIcon={<Calendar size={16} />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Vehicle Number"
                name="vehicleNo"
              >
                <Input 
                  prefix={<Truck size={16} className="text-gray-400" />}
                  placeholder="Enter vehicle number" 
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Items */}
        <Card
          title={
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-lg">
                <Package size={20} className="text-green-600" />
                Items
              </span>
              <Button
                type="dashed"
                icon={<Plus size={16} />}
                onClick={addItem}
                className="flex items-center gap-2"
              >
                Add Item
              </Button>
            </div>
          }
          className="shadow-sm"
        >
          <Table
            columns={columns}
            dataSource={items}
            pagination={false}
            rowKey="key"
            size="middle"
            scroll={{ x: 800 }}
            className="mb-4"
          />
          
          {ValidationAlert}
        </Card>

        {/* Calculations */}
        <Card
          title={
            <span className="flex items-center gap-2 text-lg">
              <Calculator size={20} className="text-purple-600" />
              Calculations
            </span>
          }
          className="shadow-sm"
        >
          <Row gutter={24}>
            <Col xs={24} sm={8}>
              <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-200">
                <Text className="text-blue-600 font-medium block mb-2">Sub Total</Text>
                <Title level={3} className="text-blue-700 mb-0">
                  {formatCurrency.format(calculations.subTotal)}
                </Title>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <Text className="text-orange-600 font-medium block mb-2">GST (%)</Text>
                <InputNumber
                  min={0}
                  max={100}
                  precision={2}
                  value={calculations.gstPercentage}
                  onChange={handleGSTChange}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                  style={{ width: '100%', marginBottom: 8 }}
                />
                <Text className="text-orange-700 font-semibold text-lg block text-center">
                  {formatCurrency.format(calculations.gstAmount)}
                </Text>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <Text className="text-green-600 font-medium block mb-2">Total Amount</Text>
                <Title level={2} className="text-green-700 mb-0">
                  {formatCurrency.format(calculations.totalAmount)}
                </Title>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Additional Fields */}
        <Card 
          title={
            <span className="flex items-center gap-2 text-lg">
              <CheckSquare size={20} className="text-indigo-600" />
              Additional Information
            </span>
          }
          className="shadow-sm"
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Receiver Signature"
                name="receiverSign"
              >
                <Input placeholder="Enter receiver name/signature" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="eoe"
                valuePropName="checked"
                style={{ marginTop: '30px' }}
              >
                <Checkbox>
                  <Text>End of Entry (EOE)</Text>
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Submit Button */}
        <Card className="shadow-sm">
          <div className="flex justify-end gap-4">
            <Button size="large" onClick={resetForm}>
              Reset
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              icon={<Save size={16} />}
              loading={loading}
              disabled={items.length === 0 || calculations.totalAmount === 0}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              {loading ? 'Creating...' : 'Create Challan'}
            </Button>
          </div>
        </Card>
      </Form>

      {/* Add Customer Modal */}
      <Modal
        title="Add New Customer"
        open={customerModalVisible}
        onCancel={() => {
          setCustomerModalVisible(false);
          customerForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={customerForm}
          layout="vertical"
          onFinish={handleAddCustomer}
          className="mt-4"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="User Name"
                name="userName"
                rules={[{ required: true, message: 'User name is required' }]}
              >
                <Input placeholder="Enter user name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Firm Name"
                name="firmName"
                rules={[{ required: true, message: 'Firm name is required' }]}
              >
                <Input placeholder="Enter firm name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: 'Phone is required' },
                  { pattern: /^[0-9+\-\s()]{10,15}$/, message: 'Enter valid phone number' }
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Alternative Phone"
                name="alternativePhone"
                rules={[
                  { required: true, message: 'Alternative phone is required' },
                  { pattern: /^[0-9+\-\s()]{10,15}$/, message: 'Enter valid phone number' }
                ]}
              >
                <Input placeholder="Enter alternative phone" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="GST Number"
                name="gst"
                rules={[{ required: true, message: 'GST number is required' }]}
              >
                <Input placeholder="Enter GST number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Firm Address"
            name="firmAddress"
            rules={[{ required: true, message: 'Firm address is required' }]}
          >
            <TextArea rows={3} placeholder="Enter firm address" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Description is required' }]}
          >
            <TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-6">
            <Button 
              onClick={() => {
                setCustomerModalVisible(false);
                customerForm.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={customerLoading}
              icon={<Save size={16} />}
            >
              {customerLoading ? 'Adding...' : 'Add Customer'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateChallanForm;