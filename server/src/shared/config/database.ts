import { Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import type { DynamicModule } from '@nestjs/common';
import type { Connection } from 'mongoose';
import type { MongooseModuleOptions } from '@nestjs/mongoose';

const logger = new Logger('Database');

const isDevelopment = (process.env.NODE_ENV ?? 'development') === 'development';

export function getMongoUri(): string {
  return process.env.MONGO_URI ?? 'mongodb://localhost:27017/test';
}

export function createMongooseOptions(): MongooseModuleOptions {
  return {
    serverSelectionTimeoutMS: 5000,
    autoIndex: isDevelopment,
    onConnectionCreate: (connection: Connection) => {
      connection.on('connected', () => {
        logger.log('MongoDB connection established');
      });

      connection.on('error', (error: unknown) => {
        logger.error(
          error instanceof Error
            ? `MongoDB connection error: ${error.message}`
            : 'MongoDB connection error',
        );
      });

      connection.on('disconnected', () => {
        logger.warn('MongoDB connection disconnected');
      });
    },
    connectionFactory: async (connection: Connection) => {
      if (isDevelopment) {
        await connection.syncIndexes();
        logger.log('MongoDB indexes synced');
      }

      return connection;
    },
  };
}

export function connectToMongo(): DynamicModule {
  return MongooseModule.forRoot(getMongoUri(), createMongooseOptions());
}
