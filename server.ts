import express from 'express';
import morgan from 'morgan';
import { scheduler } from './services/scheduler';
import { handler } from './services/data';
import { initDatabase, sendDatabaseRequest } from './utils/database';

const startApi = async () => {
  const app = express();
  const port = process.env.PORT || 4242;

  await sendDatabaseRequest(async (db) => {
    await initDatabase(db);
    console.info('DB initialized');
  });

  app.use(morgan('combined'));

  app.get('/data', async (req, res) => await handler(req, res));

  // Start cron scheduler
  scheduler.start();

  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
};

startApi();
