import Bree, { JobOptions } from 'bree';
import path from 'path';
import scrapers from '../jobs/scrapers/scrapers.json';

const getJobs = (): Array<JobOptions> => {
  return scrapers.map((el) => ({
    name: el.scraper,
    path: path.resolve('jobs/scrapers/scraper.js'),
    cron: '59 23 * * 2',
    worker: {
      workerData: {
        dataSource: el.id,
      },
    },
  })) as any;
};
// https://www.npmjs.com/package/bree
export const scheduler = new Bree({
  root: process.cwd(),
  jobs: [
    {
      name: 'company',
      path: path.resolve('jobs/company.js'),
      cron: '29 23 * * 2',
    },
    ...getJobs(),
  ],
});
