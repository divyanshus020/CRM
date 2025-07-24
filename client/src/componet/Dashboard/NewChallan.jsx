import React, { useState, useEffect } from 'react';
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
  Alert
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
  Package
} from 'lucide-react';

import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const CreateChallanForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([
    { key: Date.now(), name: '', quantity: 1, rate: 0, total: 0 }
  ]);
  const [calculations, setCalculations] = useState({
    subTotal: 0,
    gstPercentage: 18,
    gstAmount: 0,
    grandTotal: 0
  });

  // Mock customers - replace with your API
  const mockCustomers = [
    {
      _id: '1',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 98765 43210',
      gstNumber: '08AAAAA0000A1Z5'
    },
    {
      _id: '2',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 87654 32109',
      gstNumber: '08BBBBB1111B2Z6'
    },
    {
      _id: '3',
      name: 'Amit Textiles',
      email: 'amit@textiles.com',
      phone: '+91 76543 21098',
      gstNumber: '08CCCCC2222C3Z7'
    }
  ];

  useEffect(() => {
    setCustomers(mockCustomers);
    generateChallanNumber();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [items, calculations.gstPercentage]);

  const generateChallanNumber = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const challanNumber = `CH${date}${random}`;
    form.setFieldsValue({ challanNumber });
  };

  const calculateTotals = () => {
    const subTotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const gstAmount = (subTotal * calculations.gstPercentage) / 100;
    const grandTotal = subTotal + gstAmount;

    setCalculations(prev => ({
      ...prev,
      subTotal,
      gstAmount,
      grandTotal
    }));
  };

  const handleItemChange = (key, field, value) => {
    const newItems = items.map(item => {
      if (item.key === key) {
        const updatedItem = { ...item, [field]: value };
        
        // Calculate total when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          const quantity = field === 'quantity' ? value : updatedItem.quantity;
          const rate = field === 'rate' ? value : updatedItem.rate;
          updatedItem.total = (quantity || 0) * (rate || 0);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setItems(newItems);
  };

  const addItem = () => {
    const newItem = {
      key: Date.now(),
      name: '',
      quantity: 1,
      rate: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (key) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.key !== key));
    } else {
      message.warning('At least one item is required');
    }
  };

  const handleGSTChange = (value) => {
    setCalculations(prev => ({
      ...prev,
      gstPercentage: value || 0
    }));
  };

  const validateItems = () => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.name || !item.name.trim()) {
        message.error(`Item ${i + 1}: Name is required`);
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
  };

  const handleSubmit = async (values) => {
    if (!validateItems()) {
      return;
    }

    try {
      setLoading(true);

      const challanData = {
        user: 'current_user_id', // Replace with actual user ID
        customer: values.customer,
        challanNumber: values.challanNumber,
        date: values.date.toISOString(),
        items: items.map(({ key, ...item }) => item), // Remove key field
        subTotal: calculations.subTotal,
        gstPercentage: calculations.gstPercentage,
        gstAmount: calculations.gstAmount,
        grandTotal: calculations.grandTotal
      };

      console.log('Challan Data:', challanData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success('Challan created successfully!');
      
      // Reset form
      form.resetFields();
      setItems([{ key: Date.now(), name: '', quantity: 1, rate: 0, total: 0 }]);
      generateChallanNumber();
      
    } catch (error) {
      console.error('Error creating challan:', error);
      message.error('Failed to create challan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 50,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Item Name',
      key: 'name',
      render: (_, record) => (
        <Input
          placeholder="Enter item name"
          value={record.name}
          onChange={(e) => handleItemChange(record.key, 'name', e.target.value)}
          status={!record.name ? 'error' : ''}
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
      title: 'Total (₹)',
      key: 'total',
      width: 130,
      align: 'right',
      render: (_, record) => (
        <Text strong className="text-green-600 text-base">
          ₹{(record.total || 0).toLocaleString('en-IN', { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
          })}
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
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
  };

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
                name="challanNumber"
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
                initialValue={dayjs()}
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
                label="Customer"
                name="customer"
                rules={[{ required: true, message: 'Please select a customer' }]}
              >
                <Select
                  placeholder="Select customer"
                  showSearch
                  optionFilterProp="children"
                  suffixIcon={<Users size={16} />}
                >
                  {customers.map(customer => (
                    <Option key={customer._id} value={customer._id}>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.email}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
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
          
          {items.some(item => !item.name || item.quantity <= 0 || item.rate <= 0) && (
            <Alert
              message="Please fill all item details"
              type="warning"
              showIcon
              className="mb-4"
            />
          )}
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
                  {formatCurrency(calculations.subTotal)}
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
                  {formatCurrency(calculations.gstAmount)}
                </Text>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
                <Text className="text-green-600 font-medium block mb-2">Grand Total</Text>
                <Title level={2} className="text-green-700 mb-0">
                  {formatCurrency(calculations.grandTotal)}
                </Title>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Submit Button */}
        <Card className="shadow-sm">
          <div className="flex justify-end gap-4">
            <Button size="large" onClick={() => window.location.reload()}>
              Reset
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              icon={<Save size={16} />}
              loading={loading}
              disabled={items.length === 0 || calculations.grandTotal === 0}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              {loading ? 'Creating...' : 'Create Challan'}
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default CreateChallanForm;