import express from 'express';
import cors from 'cors'; 
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/auth';
import { connectDatabase } from './config/db';

dotenv.config();

// 1. Initialize App & Track Paths
const devSwaggerPath = path.join(process.cwd(), 'src', 'swagger-output.json');
const prodSwaggerPath = path.join(__dirname, 'swagger-output.json');

const app = express();

// 2. Global Request Security Middleware (MUST be at the top)
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 3. Establish Core Infrastructure Connections
connectDatabase();

// 4. Mount Application API Routes
app.use('/api/auth', authRoutes);

// 5. Compiler-Safe Dynamic Swagger Registration
let swaggerPath = fs.existsSync(prodSwaggerPath) ? prodSwaggerPath : devSwaggerPath;

if (fs.existsSync(swaggerPath)) {
  try {
    const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log(`✅ Swagger Docs successfully mounted from: ${swaggerPath}`);
  } catch (parseError) {
    console.error('❌ Failed to parse swagger-output.json:', parseError);
  }
} else {
  console.error('❌ CRITICAL: swagger-output.json could not be found anywhere in the deployment tree.');
}

// 6. Launch Execution Thread
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`\n🚀 Server roaring on: http://localhost:${PORT}`);
});

export default app;