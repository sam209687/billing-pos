import { NextResponse } from 'next/server';
import Cashier from '@/models/cashier';
import dbConnect from '@/lib/db';

// Generate random password
const generateRandomPassword = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
};

// Generate username from cashier name (first two letters + @nature.com) with uniqueness check
const generateUniqueUserName = async (name: string): Promise<string> => {
  const words = name.trim().split(' ');
  let baseUserName: string;
  if (words.length === 1) {
    baseUserName = `${words[0].slice(0, 2)}@nature.com`.toLowerCase();
  } else {
    baseUserName = `${words[0].slice(0, 1)}${words[words.length - 1].slice(0, 1)}@nature.com`.toLowerCase();
  }

  let userName = baseUserName;
  let counter = 1;

  // Check for uniqueness and append counter if needed
  while (await Cashier.findOne({ userName })) {
    userName = `${baseUserName.split('@')[0]}${counter}@nature.com`.toLowerCase();
    counter++;
  }

  return userName;
};

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { cashierName, mobile, aadhaar, storeLocation, address, email } = body;

    // Validate required fields
    if (!cashierName || !mobile || !aadhaar || !storeLocation || !address || !email) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check for duplicates (mobile, aadhaar, email)
    const existingCashier = await Cashier.findOne({ $or: [{ mobile }, { aadhaar }, { email }] });
    if (existingCashier) {
      const errors = [];
      if (existingCashier.mobile === mobile) errors.push('Mobile number already exists');
      if (existingCashier.aadhaar === aadhaar) errors.push('Aadhaar number already exists');
      if (existingCashier.email === email) errors.push('Email already exists');
      return NextResponse.json({ error: 'Duplicate entry found', details: errors }, { status: 400 });
    }

    // Generate unique username and password
    const userName = await generateUniqueUserName(cashierName);
    const password = generateRandomPassword(8);

    // Create new cashier
    const newCashier = new Cashier({
      cashierName,
      userName,
      mobile,
      aadhaar,
      storeLocation,
      address,
      email,
      password,
    });

    await newCashier.save();

    return NextResponse.json({ success: true, id: newCashier._id, userName, password }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ error: 'Validation failed', details: errorMessages }, { status: 400 });
    }
    console.error('Error adding cashier:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}