import mongoose from 'mongoose';
import { config } from './env';
import { logger } from '../utils/logger';

class Database {
  private static instance: Database;
  private connectionString: string;

  private constructor() {
    this.connectionString = config.mongodbUri;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Connect to MongoDB
  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.connectionString, {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
      });
      logger.info('MongoDB connected successfully');
    } catch (error) {
      logger.error('MongoDB connection error:', error);
      throw new Error('Failed to connect to MongoDB');
    }
  }

  // Disconnect from MongoDB
  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      logger.info('MongoDB disconnected successfully');
    } catch (error) {
      logger.error('MongoDB disconnection error:', error);
      throw new Error('Failed to disconnect from MongoDB');
    }
  }

  // Check connection status
  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
}

export const database = Database.getInstance();