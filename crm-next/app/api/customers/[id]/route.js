import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Customer } from '@/models/Customer';

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const customer = await Customer.findById(id);

        if (!customer) {
            return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: customer });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const body = await req.json();

        const customer = await Customer.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: false,
        });

        if (!customer) {
            return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: customer });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const customer = await Customer.findByIdAndDelete(id);

        if (!customer) {
            return NextResponse.json({ success: false, message: 'Customer not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
