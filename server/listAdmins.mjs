import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './Models/Admin.js';

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admins = await Admin.find().lean();
    console.log('ADMINS', admins);
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
