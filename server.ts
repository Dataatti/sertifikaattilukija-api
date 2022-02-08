import express from 'express';
import morgan from 'morgan';
import { scheduler } from './services/scheduler';

const app = express();

app.use(morgan('combined'));

scheduler.start();
app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
});
