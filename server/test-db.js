import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  console.log('Testing MongoDB Connection...');
  console.log('Connection String:', process.env.MONGO_URI?.replace(/:[^:]*@/, ':****@'));
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  } catch (error) {
    console.log('❌ MongoDB Connection Failed!');
    console.log('Error:', error.message);
    console.log('\n📋 Troubleshooting Steps:');
    console.log('1. Login to MongoDB Atlas: https://cloud.mongodb.com');
    console.log('2. Go to Network Access (left sidebar)');
    console.log('3. Click "ADD IP ADDRESS"');
    console.log('4. Click "ALLOW ACCESS FROM ANYWHERE"');
    console.log('5. Click "Confirm"');
    console.log('6. Wait 1-2 minutes and run this test again');
    process.exit(1);
  }
};

testConnection();
