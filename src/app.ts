import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth';
import swaggerDocument from './swagger-output.json';
import { connectDatabase } from './config/db';

// 1. Initialize environment variables immediately
dotenv.config();

const app = express();
app.use(express.json());

// 2. Connect to Database Cluster
connectDatabase();

// 3. Mount API Routes & Documentation
app.use('/api/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`\n🚀 Server roaring on: http://localhost:${PORT}`);
  console.log(`📄 Swagger Docs open at: http://localhost:${PORT}/api-docs\n`);
});

export default app;