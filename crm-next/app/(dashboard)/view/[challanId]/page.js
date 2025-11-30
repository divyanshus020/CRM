'use client';
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { getChallanById } from "@/lib/api";

const ViewChallan = () => {
    const router = useRouter();
    const params = useParams();
    const { challanId } = params;

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
        address: "Plot No.130, Rishabh Nagar, Doli Jhanwar Road, Boranada - JODHPUR (Raj.) - 342001",
        specialization: "Specialist For :- Plastic Dyes & Molds, Iron Cutting Dye and Plastic Molding & Iron Job works",
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
        if (challanId) {
            fetchChallan();
        }
    }, [challanId]);

    const fetchChallan = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("Fetching challan with ID:", challanId);

            const response = await getChallanById(challanId);

            if (response && response.success) {
                setChallan(response.data);
            } else {
                // If API fails or returns no data, try to use mock data for demonstration if needed
                // But for production, we should show error
                throw new Error(response?.message || "Failed to fetch challan");
            }
        } catch (err) {
            console.error("Error fetching challan:", err);
            setError(err.message);
            // setChallan(mockChallan); // Uncomment to use mock data on error
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

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

    if (error && !challan) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => router.push("/dashboard")}
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
                    onClick={() => router.push("/dashboard")}
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
                    onClick={() => router.push("/dashboard")}
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
                        {/* Header - Fixed Company Name */}
                        <div className="text-center border-b border-black pb-2 mb-3">
                            <h1 className="text-xl font-bold">
                                {challan.firmName || "RIDHI SIDHI ENTERPRISES"}
                            </h1>
                            <p className="text-xs italic">
                                {challan.specialization || "Specialist For :- Plastic Dyes & Molds, Iron Cutting Dye and Plastic Molding & Iron Job works"}
                            </p>
                            <p className="text-xs">
                                {challan.address || "Plot No.130, Rishabh Nagar, Doli Jhanwar Road, Boranada - JODHPUR (Raj.) - 342001"}
                            </p>
                            <div className="flex justify-between mt-2">
                                <span>GSTIN: {challan.gstin || "08AABCR1234M1ZB"}</span>
                                <span>PAN: {challan.pan || "AABCR1234M"}</span>
                                <span>Ph: {challan.contact || "9829012345"}</span>
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

                        {/* Customer Info with Firm Name */}
                        <div className="mb-1">
                            M/S: <strong>{challan.customerName}</strong>
                            {challan.firmName && (
                                <span> ({challan.firmName})</span>
                            )}
                        </div>
                        <div className="mb-1">
                            Address: <span>{challan.customerAddress}</span>
                        </div>
                        <div className="mb-1">
                            Party GSTIN: <span>{challan.gstNumber || "N/A"}</span>
                        </div>

                        {/* PO/Vehicle Info */}
                        <div className="flex justify-between mb-2">
                            <div>
                                P.O. No. & Date:{" "}
                                {challan.poNumber
                                    ? `${challan.poNumber}${challan.poDate ? ` - ${formatDate(challan.poDate)}` : ""
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
                                        SUB TOTAL
                                    </td>
                                    <td className="border border-black p-1 text-right font-bold">
                                        ₹{challan.subTotal?.toFixed(2) || totalAmount.toFixed(2)}
                                    </td>
                                </tr>
                                <tr className="border-t border-black">
                                    <td
                                        className="border border-black text-right p-1"
                                        colSpan={4}
                                    >
                                        CGST @ {(challan.gstPercentage || 18) / 2}%
                                    </td>
                                    <td className="border border-black p-1 text-right">
                                        ₹{(challan.gstAmount / 2)?.toFixed(2) || cgst.toFixed(2)}
                                    </td>
                                </tr>
                                <tr className="border-t border-black">
                                    <td
                                        className="border border-black text-right p-1"
                                        colSpan={4}
                                    >
                                        SGST @ {(challan.gstPercentage || 18) / 2}%
                                    </td>
                                    <td className="border border-black p-1 text-right">
                                        ₹{(challan.gstAmount / 2)?.toFixed(2) || sgst.toFixed(2)}
                                    </td>
                                </tr>
                                <tr className="border-t-2 border-black">
                                    <td
                                        className="border border-black text-right font-bold p-1"
                                        colSpan={4}
                                    >
                                        GRAND TOTAL
                                    </td>
                                    <td className="border border-black p-1 text-right font-bold">
                                        ₹{challan.totalAmount?.toFixed(2) || grandTotal.toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>

                        {/* Footer */}
                        <div className="flex justify-between mt-8">
                            <div>
                                <p className="mb-1">E.&O.E</p>
                                <p>Receiver Sign. {challan.receiverSign || "____________________"}</p>
                            </div>
                            <div className="text-right">
                                <p>
                                    For:{" "}
                                    <strong>{challan.firmName || "RIDHI SIDHI ENTERPRISES"}</strong>
                                </p>
                                <p className="mt-8">
                                    {challan.issuedBy
                                        ? `${challan.issuedBy}`
                                        : "Prop./Manager"}
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
