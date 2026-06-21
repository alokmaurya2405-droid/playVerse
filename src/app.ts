import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/auth';
import { connectDatabase } from './config/db';

dotenv.config();

const app = express();
app.use(express.json());

connectDatabase();

// Mount API Routes
app.use('/api/auth', authRoutes);

// Compiler-safe dynamic loading for Swagger
const swaggerPath = path.join(__dirname, 'swagger-output.json');
if (fs.existsSync(swaggerPath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log('⚠️ Swagger documentation file not found yet. Running in background generation mode.');
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`\n🚀 Server roaring on: http://localhost:${PORT}`);
});

export default app;