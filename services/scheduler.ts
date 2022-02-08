import Bree from 'bree';
import morgan from 'morgan';

// https://www.npmjs.com/package/bree
// 30 21 * * 0
export const scheduler = new Bree({
  jobs: [
    {
      name: 'stf',
      cron: '1/2 * * * *',
    },
  ],
});
