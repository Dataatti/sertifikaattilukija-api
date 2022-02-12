import * as processors from '../../services/scrapers';
import configs from '../../services/scrapers/scrapers.json';

for (const config of configs) {
  if (!config.testInput) continue;
  let input;
  let target;
  const processor = processors[config.scraper];

  describe(`${config.id} - scraping`, function () {
    before(() => {
      // check if the import worked correctly
      expect(processor, config.scraper).to.be.a('function');

      // load data
      cy.fixture(config.testInput).then((output) => (input = output));
      cy.fixture(config.testOutput).then((output) => (target = output));
    });

    context('Scrape certificates', () => {
      it(`Uses ${config.scraper} to scrape data source "${config.id}" correctly`, () => {
        const scrapedData = processor(input);
        const scrapedCertificateIds = scrapedData?.map((n) => n.certificateId);
        const uniqueCertificateIds = [...new Set(scrapedCertificateIds)];

        expect(uniqueCertificateIds.length, 'Only one certificate id is issued').to.eq(1);
        expect(uniqueCertificateIds[0], 'Correct certificate id is issued').to.eq(config.id);

        target.forEach((t) => {
          const foundData = scrapedData.find(
            (d) => d.companyName === t.companyName && d.certificateId === config.id
          );
          expect(t?.companyName).to.eq(foundData?.companyName);
        });

        expect(scrapedData?.length, 'Correct number of companies are read').to.eq(target?.length);
      });
    });
  });
}
