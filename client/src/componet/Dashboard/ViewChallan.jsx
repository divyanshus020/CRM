import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Printer, Download, Share2, Eye } from "lucide-react";
import { getChallanById } from "../../api/api";

const ViewChallan = () => {
  const navigate = useNavigate();
  const {challanId } = useParams();
  
  const [isPreviewMode, setIsPreviewMode] = useState(false);
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
        throw new Error("ChallanchallanIdnot provided");
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

  if (error && !challan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="group bg-white text-gray-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 mb-6 flex items-center gap-2 font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Dashboard
          </button>
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-red-800 font-medium text-lg">
              Error Loading Challan
            </h3>
            <p className="text-red-700 mt-2">{error}</p>
            <button
              onClick={fetchChallan}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition mt-4"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!challan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="group bg-white text-gray-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 mb-6 flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Dashboard
        </button>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg">
          <p className="text-gray-600 text-center">Challan not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 print:bg-white print:p-0">
      {/* Modern Professional Buttons */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <button
          onClick={() => navigate("/dashboard")}
          className="group bg-white text-gray-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center gap-4">
          {error && (
            <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-xl text-sm font-medium border border-amber-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              Using fallback data
            </div>
          )}
          <button
            onClick={handlePrint}
            className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 flex items-center gap-2 font-medium"
          >
            <Printer className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            Print Challan
          </button>
        </div>
      </div>

      {/* Challan Content with Enhanced Container */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden print:shadow-none print:border-none print:rounded-none">
          <div className="p-8 print:p-6 border border-gray-700 print:border-none bg-white text-black text-sm print:text-[11px] font-sans leading-tight">
            {/* Header */}
            <div className="text-center border-b border-black pb-2 mb-3">
              <h1 className="text-xl font-bold">
                {challan.firmName || "RIDHI SIDHI ENTERPRISES"}
              </h1>
              <p className="text-xs italic">
                Specialist For :- Plastic Dyes & Molds, Iron Cutting Dye and Plastic
                Molding & Iron Job works
              </p>
              <p className="text-xs">
                Plot No.130, Rishabh Nagar, Doli Jhanwar Road, Boranada - JODHPUR
                (Raj.) - 342001
              </p>
              <div className="flex justify-between mt-2">
                <span>GSTIN: {challan.gstin || "N/A"}</span>
                <span>PAN: {challan.pan || "N/A"}</span>
                <span>Ph: {challan.contact || "N/A"}</span>
              </div>
            </div>

            {/* Challan Info */}
            <div className="flex justify-between mb-2">
              <div>
                Challan No: <strong>{challan.challanNo}</strong>
              </div>
              <div>
                Date: <strong>{formatDate(challan.date)}</strong>
              </div>
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
                  ? `${challan.poNumber}${
                      challan.poDate ? ` - ${formatDate(challan.poDate)}` : ""
                    }`
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
                {challan.items?.map((item, index) => (
                  <tr key={index} className="border border-black">
                    <td className="border border-black p-1">{item.particulars}</td>
                    <td className="border border-black p-1">{item.hsnCode}</td>
                    <td className="border border-black p-1 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-black p-1 text-right">
                      ₹{item.rate}
                    </td>
                    <td className="border border-black p-1 text-right">
                      ₹{item.amount}
                    </td>
                  </tr>
                )) || []}
                {[...Array(Math.max(0, 10 - (challan.items?.length || 0)))].map(
                  (_, i) => (
                    <tr key={`empty-${i}`}>
                      <td className="border border-black p-3" colSpan={5}></td>
                    </tr>
                  )
                )}
              </tbody>
              <tfoot>
                <tr className="border-t border-black">
                  <td
                    className="border border-black text-right font-bold p-1"
                    colSpan={4}
                  >
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
                <p>
                  For:{" "}
                  <strong>{challan.firmName || "Ridhi Sidhi Enterprises"}</strong>
                </p>
                <p>
                  {challan.issuedBy
                    ? `${challan.issuedBy} ____________________`
                    : "Prop./Manager ____________________"}
                </p>
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
      </div>
    </div>
  );
};

export default ViewChallan;