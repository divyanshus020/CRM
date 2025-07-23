import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Table, 
  Divider, 
  Button, 
  Space, 
  Tag, 
  Spin,
  Alert,
  Descriptions,
  message
} from 'antd';
import { 
  ArrowLeft, 
  Edit3, 
  Printer, 
  Download, 
  Calendar,
  User,
  FileText,
  Hash,
  Calculator,
  IndianRupee
} from 'lucide-react';

const { Title, Text } = Typography;

const ChallanView = ({ challanId, onBack, onEdit }) => {
  const [challan, setChallan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock challan data based on your schema
  const mockChallan = {
    _id: challanId || '1',
    challanNumber: 'CH001',
    date: '2025-01-15T10:30:00Z',
    customer: {
      _id: 'cust1',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 98765 43210',
      address: '123 Main Street, Jodhpur, Rajasthan - 342001',
      gstNumber: '08AAAAA0000A1Z5'
    },
    user: {
      _id: 'user1',
      name: 'Business Owner',
      email: 'owner@business.com'
    },
    items: [
      {
        _id: 'item1',
        name: 'Premium Cotton Fabric',
        quantity: 50,
        rate: 250,
        total: 12500
      },
      {
        _id: 'item2',
        name: 'Silk Blend Material',
        quantity: 25,
        rate: 450,
        total: 11250
      },
      {
        _id: 'item3',
        name: 'Designer Buttons Set',
        quantity: 100,
        rate: 15,
        total: 1500
      },
      {
        _id: 'item4',
        name: 'Thread Rolls (Assorted)',
        quantity: 20,
        rate: 75,
        total: 1500
      }
    ],
    subTotal: 26750,
    gstPercentage: 18,
    gstAmount: 4815,
    grandTotal: 31565,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  };

  useEffect(() => {
    fetchChallan();
  }, [challanId]);

  const fetchChallan = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation:
      // const response = await getChallanById(challanId);
      setChallan(mockChallan);
      setError('');
    } catch (err) {
      console.error('Error fetching challan:', err);
      setError(err.message || 'Failed to load challan details');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
    message.success('Print dialog opened');
  };

  const handleDownload = () => {
    // Implementation for PDF download
    message.success('Download will be implemented');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
  };

  const itemColumns = [
    {
      title: 'S.No.',
      key: 'serial',
      width: 80,
      render: (_, __, index) => index + 1,
      align: 'center'
    },
    {
      title: 'Item Description',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      align: 'center',
      render: (qty) => <Tag color="blue">{qty}</Tag>
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      width: 120,
      align: 'right',
      render: (rate) => <Text code>{formatCurrency(rate)}</Text>
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 150,
      align: 'right',
      render: (total) => <Text strong style={{ color: '#52c41a' }}>{formatCurrency(total)}</Text>
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4">
            <Text>Loading challan details...</Text>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Alert
          message="Error Loading Challan"
          description={error}
          type="error"
          showIcon
          action={
            <Space>
              <Button size="small" onClick={fetchChallan}>
                Retry
              </Button>
              <Button size="small" onClick={onBack}>
                Go Back
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  if (!challan) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Alert
          message="Challan Not Found"
          description="The requested challan could not be found."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={onBack}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 print:p-0 print:bg-white">
      {/* Header - Hidden in print */}
      <div className="mb-6 print:hidden">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Button
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={onBack}
              size="large"
            >
              Back to Dashboard
            </Button>
            <div>
              <Title level={2} className="mb-1">Challan Details</Title>
              <Text type="secondary">
                View and manage challan information
              </Text>
            </div>
          </div>
          <Space>
            <Button
              icon={<Edit3 className="w-4 h-4" />}
              onClick={() => onEdit(challan)}
              type="default"
              size="large"
            >
              Edit
            </Button>
            <Button
              icon={<Download className="w-4 h-4" />}
              onClick={handleDownload}
              size="large"
            >
              Download PDF
            </Button>
            <Button
              icon={<Printer className="w-4 h-4" />}
              onClick={handlePrint}
              type="primary"
              size="large"
            >
              Print
            </Button>
          </Space>
        </div>
      </div>

      {/* Challan Content */}
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-lg print:shadow-none print:border-none">
          {/* Challan Header */}
          <div className="text-center mb-8 print:mb-6">
            <Title level={1} className="mb-2 print:text-3xl">DELIVERY CHALLAN</Title>
            <div className="flex justify-center items-center gap-4 print:gap-2">
              <Tag color="blue" className="px-4 py-2 text-lg print:text-base">
                <Hash className="w-4 h-4 inline mr-1" />
                {challan.challanNumber}
              </Tag>
              <Tag color="green" className="px-4 py-2 text-lg print:text-base">
                <Calendar className="w-4 h-4 inline mr-1" />
                {formatDate(challan.date)}
              </Tag>
            </div>
          </div>

          {/* Customer & Business Info */}
          <Row gutter={[32, 24]} className="mb-8">
            <Col xs={24} md={12}>
              <Card size="small" title={
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Details
                </span>
              }>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Name">
                    <Text strong>{challan.customer.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {challan.customer.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {challan.customer.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {challan.customer.address}
                  </Descriptions.Item>
                  {challan.customer.gstNumber && (
                    <Descriptions.Item label="GST Number">
                      <Text code>{challan.customer.gstNumber}</Text>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            </Col>
            
            <Col xs={24} md={12}>
              <Card size="small" title={
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Challan Information
                </span>
              }>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Created By">
                    <Text strong>{challan.user.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Created On">
                    {formatDate(challan.createdAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Updated">
                    {formatDate(challan.updatedAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color="success">Active</Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

          <Divider />

          {/* Items Table */}
          <div className="mb-8">
            <Title level={4} className="mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Items Details
            </Title>
            <Table
              columns={itemColumns}
              dataSource={challan.items}
              rowKey="_id"
              pagination={false}
              size="middle"
              className="print:text-sm"
              summary={() => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4}>
                      <Text strong>Sub Total</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <Text strong className="text-lg">
                        {formatCurrency(challan.subTotal)}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-50 p-6 rounded-lg print:bg-gray-100">
            <Title level={4} className="mb-4 flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Financial Summary
            </Title>
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={8}>
                <div className="text-center p-4 bg-white rounded-lg">
                  <Text type="secondary" className="block mb-1">Sub Total</Text>
                  <Text className="text-2xl font-bold text-blue-600">
                    {formatCurrency(challan.subTotal)}
                  </Text>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="text-center p-4 bg-white rounded-lg">
                  <Text type="secondary" className="block mb-1">
                    GST ({challan.gstPercentage}%)
                  </Text>
                  <Text className="text-2xl font-bold text-orange-600">
                    {formatCurrency(challan.gstAmount)}
                  </Text>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="text-center p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg">
                  <Text className="block mb-1 text-white/90">Grand Total</Text>
                  <Text className="text-3xl font-bold text-white">
                    {formatCurrency(challan.grandTotal)}
                  </Text>
                </div>
              </Col>
            </Row>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 print:mt-6">
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Text type="secondary" className="block mb-2">Terms & Conditions:</Text>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Goods delivered are subject to verification</li>
                  <li>• Any discrepancy should be reported within 24 hours</li>
                  <li>• This is a delivery challan, not an invoice</li>
                </ul>
              </Col>
              <Col xs={24} md={12} className="text-right print:text-left">
                <div className="mt-8">
                  <div className="border-t border-gray-300 pt-2 inline-block min-w-[200px]">
                    <Text strong>Authorized Signature</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body { margin: 0; }
          .ant-card { box-shadow: none !important; border: none !important; }
          .ant-table-tbody > tr > td { padding: 8px !important; }
          .ant-descriptions-item-label { font-weight: 600 !important; }
        }
      `}</style>
    </div>
  );
};

export default ChallanView;