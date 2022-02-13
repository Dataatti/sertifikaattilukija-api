import configs from 'jobs/scrapers/scrapers.json';
import * as processors from 'jobs/scrapers';
import { Processors } from 'jobs/scrapers/scraper';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

const testIfCondition = (condition: boolean) => (condition ? it.skip : it);

describe.each(configs)('$id - scraping', (config) => {
  const processor = (processors as Processors)[config.scraper];
  let input: string;
  let target: { [key: string]: any }[];
  let scrapedData: ApiCompanyCertificate[];
  let scrapedCertificateIds: string[];
  let uniqueCertificateIds: string[];

  beforeAll(async () => {
    expect(typeof processor).toBe('function');

    // load data
    if (config.testInput && config.testOutput) {
      const inputFile = await readFile(resolve('tests/fixtures/' + config.testInput));
      const targetFile = await readFile(resolve('tests/fixtures/', config.testOutput));

      if (config.inputType === 'html') {
        input = inputFile.toString();
      } else {
        input = JSON.parse(inputFile.toString());
      }

      target = JSON.parse(targetFile.toString());

      scrapedData = await processor(input);
      scrapedCertificateIds = scrapedData?.map((n) => n.certificateId);
      uniqueCertificateIds = [...new Set(scrapedCertificateIds)];
    }
  });

  it('Should include json data', () => {
    expect(Object.keys(config)).toEqual([
      'id',
      'url',
      'scraper',
      'testInput',
      'testOutput',
      'inputType',
    ]);
  });

  testIfCondition(!config.testInput)(
    `Uses ${config.scraper} to scrape data source "${config.id}" correctly`,
    async () => {
      expect(uniqueCertificateIds[0]).toEqual(config.id);

      target.forEach((t) => {
        const foundData = scrapedData.find(
          (d) => d.companyName === t.companyName && d.certificateId === config.id
        );
        expect(t?.companyName).toEqual(foundData?.companyName);
      });

      expect(scrapedData?.length).toEqual(target?.length);
    }
  );

  testIfCondition(!config.testInput)('Only one certificate id is issued', () => {
    expect(uniqueCertificateIds.length).toEqual(1);
  });
  testIfCondition(!config.testInput)('Correct certificate id is issued', () => {
    expect(uniqueCertificateIds[0]).toEqual(config.id);
  });
});
