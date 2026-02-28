import express from 'express';
import cors from 'cors';
import { config } from './config';
import authRoutes from './routes/auth.routes';
import contactRoutes from './routes/contact.routes';
import relationshipRoutes from './routes/relationship.routes';
import noteRoutes from './routes/note.routes';
import tagRoutes from './routes/tag.routes';
import customFieldRoutes from './routes/customField.routes';
import reminderRoutes from './routes/reminder.routes';
import searchRoutes from './routes/search.routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(requestLogger);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/contacts', contactRoutes);
app.use('/api/v1/relationships', relationshipRoutes);
app.use('/api/v1/notes', noteRoutes);
app.use('/api/v1/tags', tagRoutes);
app.use('/api/v1/custom-fields', customFieldRoutes);
app.use('/api/v1/reminders', reminderRoutes);
app.use('/api/v1/search', searchRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
});

export default app;
