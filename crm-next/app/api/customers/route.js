import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Customer } from '@/models/Customer';

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, email, phone, address, gstNumber, firmName, alternativePhone, description } = body;

        const customer = await Customer.create({
            id: 'CUST-' + Date.now(),
            userName: name || 'New Customer',
            firmName: firmName || '',
            firmAddress: address || '',
            phone: phone || '',
            alternativePhone: alternativePhone || '',
            email: email || '',
            gst: gstNumber || '',
            description: description || '',
        });

        return NextResponse.json({ success: true, data: customer }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connectDB();
        const customers = await Customer.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, count: customers.length, data: customers });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
