import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Download, Share2, Eye } from "lucide-react";

const ViewChallan = () => {
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // 👇 Mock Data
  const challan = {
    challanNo: "CH-2025/001",
    date: "2025-07-28",
    firmName: "RIDHI SIDHI ENTERPRISES",
    gstin: "08AABCR1234M1ZB",
    pan: "AABCR1234M",
    contact: "9829012345",
    customer: {
      name: "ABC Industries",
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

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const totalAmount = challan.items.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 print:bg-white print:p-0">
      {/* Buttons */}
      <div className="flex justify-between mb-4 print:hidden">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          ← Back
        </button>
        <button
          onClick={handlePrint}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          🖨️ Print Challan
        </button>
      </div>

      {/* Challan Content */}
      <div className="p-8 print:p-6 max-w-4xl mx-auto border border-gray-700 print:border-none bg-white text-black text-sm print:text-[11px] font-sans leading-tight">
        {/* Header */}
        <div className="text-center border-b border-black pb-2 mb-3">
          <h1 className="text-xl font-bold">RIDHI SIDHI ENTERPRISES</h1>
          <p className="text-xs italic">
            Specialist For :- Plastic Dyes & Molds, Iron Cutting Dye and Plastic Molding & Iron Job works
          </p>
          <p className="text-xs">
            Plot No.130, Rishabh Nagar, Doli Jhanwar Road, Boranada - JODHPUR (Raj.) - 342001
          </p>
          <div className="flex justify-between mt-2">
            <span>GSTIN: {challan.gstin}</span>
            <span>PAN: {challan.pan}</span>
            <span>Ph: {challan.contact}</span>
          </div>
        </div>

        {/* Challan Info */}
        <div className="flex justify-between mb-2">
          <div>Challan No: <strong>{challan.challanNo}</strong></div>
          <div>Date: <strong>{formatDate(challan.date)}</strong></div>
        </div>

        {/* Customer Info */}
        <div className="mb-1">
          M/S: <strong>{challan.customer.name}</strong>
        </div>
        <div className="mb-1">
          Address: <span>{challan.customer.address}</span>
        </div>
        <div className="mb-1">
          Party GSTIN: <span>{challan.customer.gstin || "N/A"}</span>
        </div>

        {/* PO/Vehicle Info */}
        <div className="flex justify-between mb-2">
          <div>
            P.O. No. & Date:{" "}
            {challan.poNumber
              ? `${challan.poNumber} - ${formatDate(challan.poDate)}`
              : "N/A"}
          </div>
          <div>Vehicle No: {challan.vehicleNo || "N/A"}</div>
        </div>

        {/* Table */}
        <table className="w-full border border-black border-collapse mt-2">
          <thead>
            <tr className="border border-black bg-gray-100">
              <th className="border border-black p-1">PARTICULARS</th>
              <th className="border border-black p-1">HSN CODE</th>
              <th className="border border-black p-1">QTY.</th>
              <th className="border border-black p-1">RATE</th>
              <th className="border border-black p-1">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {challan.items.map((item, index) => (
              <tr key={index} className="border border-black">
                <td className="border border-black p-1">{item.particulars}</td>
                <td className="border border-black p-1">{item.hsnCode}</td>
                <td className="border border-black p-1 text-center">{item.quantity}</td>
                <td className="border border-black p-1 text-right">₹{item.rate}</td>
                <td className="border border-black p-1 text-right">₹{item.amount}</td>
              </tr>
            ))}
            {[...Array(10 - challan.items.length)].map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="border border-black p-3" colSpan={5}></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-black">
              <td className="border border-black text-right font-bold p-1" colSpan={4}>
                TOTAL
              </td>
              <td className="border border-black p-1 text-right font-bold">
                ₹{totalAmount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Footer */}
        <div className="flex justify-between mt-8">
          <div>
            <p className="mb-1">E.&O.E</p>
            <p>Receiver Sign. ____________________</p>
          </div>
          <div className="text-right">
            <p>For: <strong>Ridhi Sidhi Enterprises</strong></p>
            <p>Prop./Manager ____________________</p>
          </div>
        </div>

        <style>{`
          @media print {
            body {
              margin: 0;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ViewChallan;
