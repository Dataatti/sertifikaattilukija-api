import express from 'express';
import cors from 'cors';
import httpLogger from 'pino-http';
import { scheduler } from './services/scheduler';
import { handler } from './services/data';
import { initDatabase, sendDatabaseRequest } from './utils/database';
import { logger } from './utils/logger';

const startApi = async () => {
  const app = express();
  const port = process.env.PORT || 4242;

  await sendDatabaseRequest(async (db) => {
    await initDatabase(db);
    console.info('DB initialized');
  });
  app.use(cors());
  app.use(
    httpLogger({
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
      serializers: {
        req: (req) => ({
          method: req.method,
          url: req.url,
          query: req.query,
          params: req.params,
          host: req.host,
        }),
      },
    })
  );

  app.get('/data', async (req, res) => await handler(req, res));

  // Start cron scheduler
  scheduler.start();

  app.listen(port, () => {
    console.info(`App listening on port ${port}`);
  });
};

try {
  startApi();
} catch (err) {
  logger.error('Unable to start server');
}
