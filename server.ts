import express from 'express';
import morgan from 'morgan';
import { scheduler } from './services/scheduler';
import { handler } from './services/data';

const app = express();

app.use(morgan('combined'));

app.get('/data', async (req, res) => await handler(req, res));

scheduler.start();
app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
