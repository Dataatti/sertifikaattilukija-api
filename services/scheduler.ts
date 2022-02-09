import Bree, { JobOptions } from 'bree';
import path from 'path';
import scrapers from '../jobs/scrapers/scrapers.json';

const jobsPath = path.join(process.cwd(), 'dist', 'jobs');

const getJobs = (): Array<JobOptions> => {
  return scrapers.map((el) => ({
    name: el.scraper,
    path: path.join(jobsPath, 'scrapers/scraper.js'),
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
  root: jobsPath,
  jobs: [
    {
      name: 'company',
      path: path.join(jobsPath, 'company.js'),
      cron: '59 23 * * 2',
    },
    ...getJobs(),
  ],
});
