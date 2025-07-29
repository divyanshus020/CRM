import React from "react";
import { Form, Input, Button, Card, Row, Col, message } from "antd";
import {
  User,
  Phone,
  MapPin,
  Landmark,
  Mail,
  FileText,
  Building2,
  PhoneCall,
  ArrowLeft,
} from "lucide-react";
import { newCostomer } from "../../api/api";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CustomerRegistrationForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Customer data submitted:", values);
    try {
      const data = await newCostomer(values);
      console.log("Customer created successfully:", data);

      if (data.success) {
        toast.success(data.message || "Customer created successfully!", {
          position: "top-center",
          autoClose: 5000,
        });
        form.resetFields();
      }
    } catch (error) {
      message.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-green-50 py-10 px-4">
      <Card
        className="w-full max-w-4xl shadow-xl rounded-2xl"
        title={
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-blue-700 text-center w-full">
              Register New Customer
            </h2>
          </div>
        }
      >
        {/* 🔙 Back Button */}
        <Button
          type="default"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate(-1)}
          className="mb-4 border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          Back
        </Button>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          className="mt-2"
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                name="userName"
                label="Customer Name"
                rules={[{ required: true, message: "Customer name is required" }]}
              >
                <Input
                  placeholder="Enter customer name"
                  prefix={<User className="text-blue-500" size={18} />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="firmName"
                label="Firm Name"
                rules={[{ required: true, message: "Firm name is required" }]}
              >
                <Input
                  placeholder="Enter firm name"
                  prefix={<Building2 className="text-indigo-500" size={18} />}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="firmAddress"
                label="Firm Address"
                rules={[{ required: true, message: "Firm address is required" }]}
              >
                <Input.TextArea
                  placeholder="Enter firm address"
                  rows={3}
                  prefix={<MapPin className="text-red-400" size={18} />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: "Phone number is required" }]}
              >
                <Input
                  placeholder="Enter phone number"
                  prefix={<Phone className="text-green-500" size={18} />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="alternativePhone"
                label="Alternative Phone"
                rules={[{ required: true, message: "Alternative phone is required" }]}
              >
                <Input
                  placeholder="Enter alternative number"
                  prefix={<PhoneCall className="text-orange-500" size={18} />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email", message: "Valid email is required" }]}
              >
                <Input
                  placeholder="Enter email"
                  prefix={<Mail className="text-pink-500" size={18} />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="gst"
                label="GSTIN"
                rules={[{ required: true, message: "GSTIN is required" }]}
              >
                <Input
                  placeholder="Enter GSTIN"
                  prefix={<Landmark className="text-yellow-500" size={18} />}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Description is required" }]}
              >
                <Input.TextArea
                  placeholder="Enter any additional description"
                  rows={2}
                  prefix={<FileText className="text-gray-500" size={18} />}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="text-center">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-in-out px-8"
            >
              Register Customer
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CustomerRegistrationForm;
