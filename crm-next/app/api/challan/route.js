import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Challan } from '@/models/Challan';

export async function GET(req) {
    try {
        await connectDB();
        // Note: customer is embedded, so no need to populate if schema matches what we saw.
        // If there was a customerId ref, we would populate it.
        // Based on challanModel.js, customer is embedded.
        const challans = await Challan.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, count: challans.length, data: challans });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const {
            challanNo, date, customerName, firmName, items, totalAmount,
            gstNumber, customerAddress, gstin, pan, contact, eoe,
            receiverSign, issuedBy, gstAmount, subTotal, gstPercentage,
            poNumber, poDate, vehicleNo, narration
        } = body;

        const challanData = {
            challanNo: challanNo || 'AUTO-' + Date.now(),
            date: date ? new Date(date) : new Date(),
            customer: {
                name: customerName || 'Guest Customer',
                address: customerAddress || '',
                gstin: gstNumber || ''
            },
            firmName: firmName || 'Default Firm',
            gstin: gstin || gstNumber || '',
            pan: pan || '',
            contact: contact || '',
            items: Array.isArray(items) && items.length > 0 ? items : [{
                particulars: 'Default Item',
                hsnCode: '',
                quantity: 1,
                rate: 0,
                amount: 0
            }],
            totalAmount: Number(totalAmount) || 0,
            gstAmount: Number(gstAmount) || 0,
            subTotal: Number(subTotal) || 0,
            gstPercentage: Number(gstPercentage) || 0,
            eoe: Boolean(eoe),
            receiverSign: receiverSign || null,
            issuedBy: issuedBy || 'System',
            narration: narration || '',
            poNumber: poNumber || '',
            poDate: poDate ? new Date(poDate) : null,
            vehicleNo: vehicleNo || ''
        };

        const challan = await Challan.create(challanData);
        return NextResponse.json({ success: true, message: 'Challan created successfully', data: challan }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
