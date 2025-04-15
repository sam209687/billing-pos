import mongoose, { Schema, Document, Model } from 'mongoose';

interface ICashier extends Document {
  cashierName: string;
  userName: string;
  mobile: string;
  aadhaar: string;
  storeLocation: string;
  address: string;
  email: string;
  password: string;
  createdAt: Date;
}

const cashierSchema: Schema<ICashier> = new Schema({
  cashierName: {
    type: String,
    required: true,
    trim: true,
    
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\d{10}$/, 'Mobile must be a 10-digit number'],
  },
  aadhaar: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\d{12}$/, 'Aadhaar must be a 12-digit number'],
  },
  storeLocation: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model is already registered, if not, create it
const Cashier: Model<ICashier> = mongoose.models.Cashier || mongoose.model<ICashier>('Cashier', cashierSchema);

export default Cashier;