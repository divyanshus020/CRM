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
import { useParams } from 'react-router-dom';
import { getChallanById } from '../../api/api';

const { Title, Text } = Typography;

const ChallanView = ({ onBack, onEdit }) => {

  const {challanId} = useParams()
  console.log("Challan ID from params:", challanId);
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
       const response = await getChallanById(challanId);
       console.log("Fetched Challan:", response);
      setChallan(response || mockChallan);
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
      width: 60,
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
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'center',
      render: (qty) => <Tag color="blue" size="small">{qty}</Tag>
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      width: 100,
      align: 'right',
      render: (rate) => <Text code>{formatCurrency(rate)}</Text>
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 120,
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
    <div className="min-h-screen bg-gray-50 p-6 print:p-0 print:bg-white print:min-h-0">
      {/* Header - Hidden in print */}
      <div className="mb-6 print:hidden">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Button
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => window.location.href = '/dashboard'}
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
      <div className="max-w-5xl mx-auto print:max-w-full print:mx-0">
        <Card className="shadow-lg print:shadow-none print:border-none print:m-0 print:p-0">
          {/* Challan Header */}
          <div className="text-center mb-4 print:mb-3">
            <Title level={1} className="mb-1 print:text-2xl print:mb-1">DELIVERY CHALLAN</Title>
            <div className="flex justify-center items-center gap-4 print:gap-2">
              <Tag color="blue" className="px-3 py-1 print:px-2 print:py-1 print:text-sm">
                <Hash className="w-3 h-3 inline mr-1" />
                {challan.challanNumber}
              </Tag>
              <Tag color="green" className="px-3 py-1 print:px-2 print:py-1 print:text-sm">
                <Calendar className="w-3 h-3 inline mr-1" />
                {formatDate(challan.date)}
              </Tag>
            </div>
          </div>

          {/* Customer & Business Info */}
          <Row gutter={[24, 16]} className="mb-4 print:mb-3">
            <Col xs={24} md={12}>
              <Card size="small" title={
                <span className="flex items-center gap-2 print:text-sm">
                  <User className="w-3 h-3" />
                  Customer Details
                </span>
              } className="print:border print:border-gray-300">
                <Descriptions column={1} size="small" className="print:text-xs">
                  <Descriptions.Item label="Name" labelStyle={{ fontSize: '12px' }} contentStyle={{ fontSize: '12px' }}>
                    <Text strong>{challan?.customer?.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email" labelStyle={{ fontSize: '12px' }} contentStyle={{ fontSize: '12px' }}>
                    {challan?.customer?.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone" labelStyle={{ fontSize: '12px' }} contentStyle={{ fontSize: '12px' }}>
                    {challan?.customer?.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address" labelStyle={{ fontSize: '12px' }} contentStyle={{ fontSize: '12px' }}>
                    {challan?.customer?.address}
                  </Descriptions.Item>
                  {challan?.customer?.gstNumber && (
                    <Descriptions.Item label="GST Number" labelStyle={{ fontSize: '12px' }} contentStyle={{ fontSize: '12px' }}>
                      <Text code>{challan?.customer?.gstNumber}</Text>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            </Col>
            
            <Col xs={24} md={12}>
              <Card size="small" title={
                <span className="flex items-center gap-2 print:text-sm">
                  <FileText className="w-3 h-3" />
                  Challan Information
                </span>
              } className="print:border print:border-gray-300">
                <Descriptions column={1} size="small" className="print:text-xs">
                  <Descriptions.Item label="Created By" labelStyle={{ fontSize: '12px' }} contentStyle={{ fontSize: '12px' }}>
                    <Text strong>{challan.user.name}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Created On" labelStyle={{ fontSize: '12px' }} contentStyle={{ fontSize: '12px' }}>
                    {formatDate(challan.createdAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Updated" labelStyle={{ fontSize: '12px' }} contentStyle={{ fontSize: '12px' }}>
                    {formatDate(challan.updatedAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status" labelStyle={{ fontSize: '12px' }} contentStyle={{ fontSize: '12px' }}>
                    <Tag color="success" size="small">Active</Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

          <Divider className="print:my-2" />

          {/* Items Table */}
          <div className="mb-4 print:mb-3">
            <Title level={4} className="mb-2 flex items-center gap-2 print:text-base print:mb-2">
              <Calculator className="w-4 h-4" />
              Items Details
            </Title>
            <Table
              columns={itemColumns}
              dataSource={challan.items}
              rowKey="_id"
              pagination={false}
              size="small"
              className="print:text-xs"
              summary={() => (
                <Table.Summary>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4}>
                      <Text strong className="print:text-xs">Sub Total</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">
                      <Text strong className="print:text-sm">
                        {formatCurrency(challan.subTotal)}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-50 p-3 rounded-lg print:bg-gray-100 print:p-2 mb-4 print:mb-3">
            <Title level={4} className="mb-2 flex items-center gap-2 print:text-base print:mb-2">
              <IndianRupee className="w-4 h-4" />
              Financial Summary
            </Title>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={8}>
                <div className="text-center p-2 bg-white rounded print:p-1">
                  <Text type="secondary" className="block mb-1 print:text-xs">Sub Total</Text>
                  <Text className="text-lg font-bold text-blue-600 print:text-sm">
                    {formatCurrency(challan.subTotal)}
                  </Text>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="text-center p-2 bg-white rounded print:p-1">
                  <Text type="secondary" className="block mb-1 print:text-xs">
                    GST ({challan.gstPercentage}%)
                  </Text>
                  <Text className="text-lg font-bold text-orange-600 print:text-sm">
                    {formatCurrency(challan.gstAmount)}
                  </Text>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div className="text-center p-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded print:bg-green-600 print:p-1">
                  <Text className="block mb-1 text-white/90 print:text-xs print:text-white">Grand Total</Text>
                  <Text className="text-xl font-bold text-white print:text-base">
                    {formatCurrency(challan.grandTotal)}
                  </Text>
                </div>
              </Col>
            </Row>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-200 print:mt-3 print:pt-2">
            <Row gutter={[16, 8]}>
              <Col xs={24} md={12}>
                <Text type="secondary" className="block mb-1 print:text-xs">Terms & Conditions:</Text>
                <ul className="text-xs text-gray-600 space-y-0 print:text-xs print:leading-tight">
                  <li>• Goods delivered are subject to verification</li>
                  <li>• Any discrepancy should be reported within 24 hours</li>
                  <li>• This is a delivery challan, not an invoice</li>
                </ul>
              </Col>
              <Col xs={24} md={12} className="text-right print:text-left">
                <div className="mt-4 print:mt-2">
                  <div className="border-t border-gray-300 pt-1 inline-block min-w-[150px] print:min-w-[120px]">
                    <Text strong className="print:text-xs">Authorized Signature</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </div>

      {/* Enhanced Print Styles */}
      <style jsx>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          @page {
            size: A4;
            margin: 0.5in;
          }
          
          body { 
            margin: 0; 
            font-size: 12px !important;
            line-height: 1.2 !important;
          }
          
          .ant-card { 
            box-shadow: none !important; 
            border: none !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .ant-card-body {
            padding: 0 !important;
          }
          
          .ant-table-tbody > tr > td { 
            padding: 4px 8px !important; 
            font-size: 11px !important;
            line-height: 1.2 !important;
          }
          
          .ant-table-thead > tr > th {
            padding: 4px 8px !important;
            font-size: 11px !important;
            font-weight: bold !important;
          }
          
          .ant-descriptions-item-label { 
            font-weight: 600 !important; 
            font-size: 10px !important;
            padding: 2px 0 !important;
          }
          
          .ant-descriptions-item-content {
            font-size: 10px !important;
            padding: 2px 0 !important;
          }
          
          .ant-tag {
            margin: 0 !important;
            padding: 1px 4px !important;
            font-size: 10px !important;
            line-height: 1.2 !important;
          }
          
          .ant-divider {
            margin: 8px 0 !important;
          }
          
          .ant-typography h1 {
            font-size: 24px !important;
            margin: 0 0 8px 0 !important;
          }
          
          .ant-typography h4 {
            font-size: 14px !important;
            margin: 0 0 8px 0 !important;
          }
          
          .ant-card-head {
            padding: 0 8px !important;
            min-height: auto !important;
          }
          
          .ant-card-head-title {
            font-size: 12px !important;
            padding: 4px 0 !important;
          }
          
          .ant-card-small > .ant-card-head {
            font-size: 12px !important;
          }
          
          .ant-card-small > .ant-card-body {
            padding: 8px !important;
          }
          
          .ant-row {
            margin: 0 !important;
          }
          
          .ant-col {
            padding: 0 4px !important;
          }
          
          /* Prevent page breaks */
          .ant-card,
          .ant-table-wrapper,
          .ant-descriptions {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Force single page */
          html, body {
            height: auto !important;
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChallanView;