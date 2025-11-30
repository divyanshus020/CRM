import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import { getChallanById } from "../../api/api";

const ViewChallan = () => {
  const navigate = useNavigate();
  const { challanId } = useParams();

  const [challan, setChallan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock Data as fallback
  const mockChallan = {
    challanNo: "CH-2025/001",
    date: "2025-07-28",
    firmName: "RIDHI SIDHI ENTERPRISES",
    gstin: "08AABCR1234M1ZB",
    pan: "AABCR1234M",
    contact: "9829012345",
    customer: {
      name: "ABC Industries",
      firmName: "ABC Traders Pvt Ltd",
      address: "Plot 21, Industrial Area, Jodhpur, Rajasthan",
      gstin: "08ABCD1234E1Z2",
    },
    poNumber: "PO-4567",
    poDate: "2025-07-25",
    vehicleNo: "RJ19CG4567",
    items: [
      {
        particulars: "Plastic Mold",
        hsnCode: "84807100",
        quantity: 2,
        rate: 2500,
        amount: 5000,
      },
      {
        particulars: "Cutting Die",
        hsnCode: "82073000",
        quantity: 3,
        rate: 1200,
        amount: 3600,
      },
    ],
  };

  useEffect(() => {
    fetchChallan();
  }, [challanId]);

  const fetchChallan = async () => {
    try {
      setLoading(true);
      setError("");

      if (!challanId) {
        throw new Error("Challan ID not provided");
      }

      console.log("Fetching challan with ID:", challanId);

      const data = await getChallanById(challanId);
      setChallan(data || mockChallan);
    } catch (err) {
      console.error("Error fetching challan:", err);
      setError(err.message);
      setChallan(mockChallan); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const totalAmount =
    challan?.totalAmount ||
    challan?.items?.reduce((sum, item) => sum + (item.amount || 0), 0) ||
    0;

  const cgst = totalAmount * 0.09;
  const sgst = totalAmount * 0.09;
  const grandTotal = totalAmount + cgst + sgst;

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading challan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 print:bg-white print:p-0">
      {/* Modern Professional Buttons - Hidden on Print */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <button
          onClick={() => navigate("/dashboard")}
          className="group bg-white text-gray-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Dashboard
        </button>

        <button
          onClick={handlePrint}
          className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 flex items-center gap-2 font-medium"
        >
          <Printer className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
          Print Challan
        </button>
      </div>

      {/* A4 Size Container */}
      <div className="flex justify-center print:block">
        <div
          className="bg-white rounded-lg shadow-2xl border border-gray-200 print:shadow-none print:border-none print:rounded-none"
          style={{
            width: "210mm",
            height: "297mm",
            padding: "20mm",
            boxSizing: "border-box",
            fontFamily: "Arial, sans-serif",
            fontSize: "11px",
            lineHeight: "1.2",
          }}
        >
          {/* Header - Company Name */}
          <div className="text-center border-b-2 border-black pb-3 mb-3">
            <h1 className="text-lg font-bold mb-1">RIDHI SIDHI ENTERPRISES</h1>
            <p className="text-xs italic mb-1">
              Specialist For :- Plastic Dyes & Molds, Iron Cutting Dye and Plastic
              Molding & Iron Job works
            </p>
            <p className="text-xs mb-2">
              Plot No.130, Rishabh Nagar, Doli Jhanwar Road, Boranada - JODHPUR
              (Raj.) - 342001
            </p>
            <div className="flex justify-between text-xs">
              <span>GSTIN: {challan?.gstin || "N/A"}</span>
              <span>PAN: {challan?.pan || "N/A"}</span>
              <span>Ph: {challan?.contact || "N/A"}</span>
            </div>
          </div>

          {/* Challan No & Date */}
          <div className="flex justify-between mb-2 text-xs">
            <div>
              Challan No: <strong>{challan?.challanNo}</strong>
            </div>
            <div>
              Date:{" "}
              <strong>
                {new Date(challan?.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </strong>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-3 text-xs">
            <div className="mb-1">
              M/S: <strong>{challan?.customer?.name}</strong>
            </div>
            <div className="mb-1">
              Firm Name: <strong>{challan?.firmName || "N/A"}</strong>
            </div>
            <div className="mb-1">
              Address: <span>{challan?.customer?.address}</span>
            </div>
            <div className="mb-1">
              Party GSTIN: <span>{challan?.customer?.gstin || "N/A"}</span>
            </div>
          </div>

          {/* PO & Vehicle Info */}
          <div className="flex justify-between mb-3 text-xs">
            <div>
              P.O. No. & Date:{" "}
              {challan?.poNumber
                ? `${challan.poNumber} - ${new Date(
                    challan.poDate
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}`
                : "N/A"}
            </div>
            <div>Vehicle No: {challan?.vehicleNo || "N/A"}</div>
          </div>

          {/* Items Table */}
          <table
            className="w-full border border-black border-collapse text-xs mb-4"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-left">
                  PARTICULARS
                </th>
                <th
                  className="border border-black p-2 text-center"
                  style={{ width: "70px" }}
                >
                  HSN CODE
                </th>
                <th
                  className="border border-black p-2 text-center"
                  style={{ width: "50px" }}
                >
                  QTY.
                </th>
                <th
                  className="border border-black p-2 text-right"
                  style={{ width: "60px" }}
                >
                  RATE
                </th>
                <th
                  className="border border-black p-2 text-right"
                  style={{ width: "70px" }}
                >
                  AMOUNT
                </th>
              </tr>
            </thead>
            <tbody>
              {challan?.items?.map((item, index) => (
                <tr key={index}>
                  <td className="border border-black p-2">{item.particulars}</td>
                  <td className="border border-black p-2 text-center">
                    {item.hsnCode}
                  </td>
                  <td className="border border-black p-2 text-center">
                    {item.quantity}
                  </td>
                  <td className="border border-black p-2 text-right">
                    ₹{item.rate}
                  </td>
                  <td className="border border-black p-2 text-right">
                    ₹{item.amount}
                  </td>
                </tr>
              ))}
              {[...Array(Math.max(0, 8 - (challan?.items?.length || 0)))].map(
                (_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="border border-black p-4" colSpan={5}></td>
                  </tr>
                )
              )}
            </tbody>
            <tfoot>
              <tr>
                <td className="border border-black p-2 text-right font-bold" colSpan={4}>
                  SUB TOTAL
                </td>
                <td className="border border-black p-2 text-right font-bold">
                  ₹{(challan?.totalAmount || 0).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-right" colSpan={4}>
                  CGST @ 9%
                </td>
                <td className="border border-black p-2 text-right">
                  ₹{((challan?.totalAmount || 0) * 0.09).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 text-right" colSpan={4}>
                  SGST @ 9%
                </td>
                <td className="border border-black p-2 text-right">
                  ₹{((challan?.totalAmount || 0) * 0.09).toFixed(2)}
                </td>
              </tr>
              <tr className="font-bold">
                <td className="border border-black p-2 text-right" colSpan={4}>
                  GRAND TOTAL
                </td>
                <td className="border border-black p-2 text-right">
                  ₹{((challan?.totalAmount || 0) * 1.18).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div className="flex justify-between mt-6 text-xs" style={{ justifyContent: 'space-between', gap: '40px' }}>
            <div>
              <p className="mb-20">E.&O.E</p>
              <p>Receiver Sign. ____________________</p>
            </div>
            <div className="text-right">
              <p className="mb-21">
                For: <strong>RIDHI SIDHI ENTERPRISES</strong>
              </p>
              <p className="mb-12">
                {challan?.issuedBy
                  ? `${challan.issuedBy} ____________________`
                  : "Prop./Manager ____________________"}
              </p>
            </div>
          </div>

          <style>{`
            @media print {
              @page {
                size: A4;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .print\\:hidden {
                display: none !important;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default ViewChallan;