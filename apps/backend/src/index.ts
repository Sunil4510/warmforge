import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './services/prisma.service';
import { mailboxRoutes } from './modules/mailbox.routes';
import { domainRoutes } from './modules/domain.routes';
import { WarmupScheduler } from './scheduler/warmup.scheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/v1/mailboxes', mailboxRoutes);
app.use('/api/v1/domains', domainRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to Database');

    // Initialize Scheduler
    WarmupScheduler.init();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
