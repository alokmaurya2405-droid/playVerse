import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      console.error('❌ CRITICAL ERROR: MONGO_URI environment variable is missing inside .env');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('✅ Connected securely to MongoDB Database Cluster.');
  } catch (error) {
    console.error('❌ Failed to establish initial MongoDB connection:', error);
    // Gracefully crash the process so our production container manager knows to reboot it
    process.exit(1); 
  }
};