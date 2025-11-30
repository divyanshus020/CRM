import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Challan } from '@/models/Challan';

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const challan = await Challan.findById(id);

        if (!challan) {
            return NextResponse.json({ success: false, message: 'Challan not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: challan });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const challan = await Challan.findByIdAndDelete(id);

        if (!challan) {
            return NextResponse.json({ success: false, message: 'Challan not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Challan deleted successfully', data: challan });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
