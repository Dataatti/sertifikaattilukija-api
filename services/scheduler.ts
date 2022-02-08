import Bree, { JobOptions } from 'bree';
import path from 'path';
import scrapers from '../jobs/scrapers/scrapers.json';

const getJobs = (jobsPath: string): Array<JobOptions> => {
  return scrapers.map((el) => ({
    name: el.scraper,
    path: path.join(jobsPath, 'scrapers/scraper.js'),
    cron: '1/2 * * * *',
    worker: {
      workerData: {
        dataSource: el,
      },
    },
  })) as any;
};
const jobsPath = path.join(process.cwd(), 'dist', 'jobs');

// https://www.npmjs.com/package/bree
export const scheduler = new Bree({
  root: jobsPath,
  jobs: getJobs(jobsPath),
});
