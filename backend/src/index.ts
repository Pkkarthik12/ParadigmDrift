import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import driftRoutes from './routes/drift.js';

// Initialize environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/drift', driftRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'active', message: 'ParadigmDrift API is operational' });
});

app.listen(PORT, () => {
  console.log(`[ParadigmDrift] Server running on port ${PORT}`);
});
