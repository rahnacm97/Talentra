
import express from 'express';
import cors from 'cors';
import { database } from './config/database';
import { logger } from './utils/logger';
import { errorMiddleware } from './middleware/errorMiddleware';
import { Server } from 'socket.io';
import http from 'http';
import { config } from './config/env';
import { initializeDependencies, AppDependencies } from './appDependency';
import adminRoutes from './routes/admin/adminRoute';
import candidateRoutes from './routes/candidate/candidateRoute';
import employerRoutes from './routes/employer/employerRoute';
import authRoutes from './routes/auth/authRoute';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  },
});

// Middleware
const corsOptions = {
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize dependencies
const dependencies = initializeDependencies(io, logger);

// Routes
app.use('/api/admin', adminRoutes(dependencies));
app.use('/api/candidate', candidateRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await database.connect();
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;