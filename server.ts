import express from 'express';
import morgan from 'morgan';
import { scheduler } from './services/scheduler';
import { handler } from './services/data';

const app = express();
const port = process.env.PORT || 4242;

app.use(morgan('combined'));

app.get('/data', async (req, res) => await handler(req, res));

scheduler.start();
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
