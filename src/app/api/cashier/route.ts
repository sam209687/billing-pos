import { NextResponse } from 'next/server';
import Cashier from '@/models/cashier';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    await dbConnect();
    const cashiers = await Cashier.find();
    return NextResponse.json(cashiers);
  } catch (error) {
    console.error('Error fetching cashiers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}