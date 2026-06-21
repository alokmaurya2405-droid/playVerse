import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import authRoutes from './routes/auth';
import { connectDatabase } from './config/db';
const devSwaggerPath = path.join(process.cwd(), 'src', 'swagger-output.json');
const prodSwaggerPath = path.join(__dirname, 'swagger-output.json');
dotenv.config();

const app = express();
app.use(express.json());

connectDatabase();

// Mount API Routes
app.use('/api/auth', authRoutes);

// Compiler-safe dynamic loading for Swagger
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`\n🚀 Server roaring on: http://localhost:${PORT}`);
});

export default app;