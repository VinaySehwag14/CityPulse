import express from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Body parser
app.use(express.json());

// CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
        credentials: true,
    })
);

// API routes – all under /api
app.use('/api', apiRouter);

// Global error middleware – must be last
app.use(errorHandler);

export default app;
