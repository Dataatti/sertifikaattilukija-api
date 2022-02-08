import Bree, { JobOptions } from 'bree';
import scrapers from '../jobs/scrapers/scrapers.json';
import { scraper } from '../jobs/scrapers/scraper';

const getJobs = (): Array<JobOptions> => {
  return scrapers.map((el) => ({
    name: el.scraper,
    path: async () => await scraper(el.id),
    cron: '30 21 * * 0',
  }));
};

// https://www.npmjs.com/package/bree
export const scheduler = new Bree({
  jobs: getJobs(),
});
