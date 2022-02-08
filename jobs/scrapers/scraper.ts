import { getErrorMessage, sleep } from '../../utils';
import { sendDatabaseRequest, upsertCompanyCertificates } from '../../utils/database';
import * as processors from '.';
import scrapersConfig from './scrapers.json';

type Processors = {
  [key: string]: (input: any) => ApiCompanyCertificate[] | Promise<ApiCompanyCertificate[]>;
};

/**
 * Function for scraping different data sources
 * @param db Database HOC
 * @param dataSource Certificate Id
 * @returns status as boolean, true = ok
 */
export const scraper = async (dataSource: string) => {
  let currentConfig;
  for (let i = 0; i < 5; i++) {
    try {
      const configs = scrapersConfig?.filter((conf) => conf?.id === dataSource);
      for (const config of configs) {
        if (config.url) {
          currentConfig = config;
          const responses = await fetch(config.url);

          let input;
          if (config.inputType === 'html') {
            input = await responses.text();
          } else {
            input = await responses.json();
          }
          const dataProcessor = (processors as Processors)[config.scraper];
          const data = await dataProcessor(input);

          sendDatabaseRequest(async (db) => await upsertCompanyCertificates(data, db));
        } else {
          currentConfig = config;
          const dataProcessor = (processors as Processors)[config.scraper];
          const data = await dataProcessor('');

          sendDatabaseRequest(async (db) => await upsertCompanyCertificates(data, db));
        }
      }
      return true;
    } catch (error) {
      console.error(
        `Something went wrong with data source "${currentConfig?.id}" in processor "${currentConfig?.scraper}", try again after delay`
      );
      console.error(getErrorMessage(error));
      await sleep(30 * 1000);
    }
  }
  return false;
};
