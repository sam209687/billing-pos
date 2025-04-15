import { NextResponse } from 'next/server';
import Cashier from '@/models/cashier';
import dbConnect from '@/lib/db';


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;
    const result = await Cashier.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ error: 'Cashier not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cashier:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}