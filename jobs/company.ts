import { getErrorMessage, sleep } from 'utils';
import type { Knex } from 'knex';

type ApiCompanyType = {
  businessId: string;
  name: string;
  registrationDate: string;
  companyForm: string;
  detailsUri: string;
  address?: string;
  city?: string;
  postCode?: string;
};

type AddressInfoType = {
  [key: string]: any;
  city: string;
  postCode: string;
  street: string;
};

/**
 * Upsert companies to database. If conflict on company name, update information.
 * @param companies company data to be upserted into database
 */
const upsertCompanies = async (companies: Company[], dbClient: Knex<any, unknown[]>) => {
  const insertableCompanies = companies.map((company) => ({
    address: company?.address,
    city: company?.city,
    name: company?.name,
    vat_number: company?.vatNumber,
    post_code: company?.postCode,
  }));

  if (insertableCompanies?.length > 0) {
    await dbClient('company').insert(insertableCompanies).onConflict('name').merge();
  }
};

/**
 * Get additional company information for single company
 * @param company company data from PRH api
 * @returns company data according our database schema
 */
const getSingleCompanyAdditionalInformation = async (
  company: ApiCompanyType
): Promise<Company | null> => {
  try {
    const res = await fetch(company?.detailsUri);
    const data = await res.json();
    const address: AddressInfoType = data?.results?.[0]?.addresses;
    const addressInfo =
      address.find((n: AddressInfoType) => n.city && n.street && n.postCode) || address?.[0];
    return {
      vatNumber: company?.businessId,
      name: company?.name,
      address: addressInfo?.street,
      city: addressInfo?.city,
      postCode: addressInfo?.postCode,
    };
  } catch (error) {
    console.error(getErrorMessage(error));
    return null;
  }
};

/**
 * Service for fetching travel company information from PRH open api
 * @returns status as boolean, true = ok
 */
export const getCompanyInformation = async (dbClient: Knex<any, unknown[]>) => {
  const dev = process.env.NODE_ENV === 'development';
  console.info('START COMPANY INFORMATION FETCHING');
  try {
    // 55 = Majoitus
    // 56 = Ravitsemistoiminta
    // 79 = Matkatoimistojen ja matkanjärjestäjien toiminta; varauspalvelut
    // 93 = Urheilutoiminta sekä huvi- ja virkistyspalvelut
    const businessLineCodes = ['55', '56', '79', '93'];
    const limit = dev ? 20 : 500;
    for (const lineCode of businessLineCodes) {
      let skip = 0;
      let hasMore = true;
      let errorCount = 0;
      // Only ten errors allowed, otherwise break
      while (hasMore && errorCount < 10) {
        try {
          const output = [];
          // NOTE: PRH API supports only 300 requests per minute for ALL users combined
          const res = await fetch(
            `https://avoindata.prh.fi/bis/v1?totalResults=false&maxResults=${limit}&resultsFrom=${skip}&businessLineCode=${lineCode}`
          );
          const data = await res.json();
          // Address information has to be fetched separately with VAT-number
          for (const d of data?.results) {
            const completeData = await getSingleCompanyAdditionalInformation(d);
            if (completeData) {
              output.push(completeData);
            }
            // Throttle requests to prevent hogging the entire api bandwidth to ourselves
            await sleep(500);
          }
          // Insert data into DB
          for (let i = 0; i < 5; i++) {
            try {
              await upsertCompanies(output, dbClient);
              // All okay, no need to try again
              break;
            } catch (error) {
              // something went wrong, try again after delay
              console.error(getErrorMessage(error));
              await sleep(30 * 1000);
            }
          }
          skip += limit;
          if (data?.results?.length < limit || (dev && skip >= limit)) {
            hasMore = false;
          }
        } catch (error) {
          // something went wrong, try again after delay
          errorCount++;
          await sleep(30 * 1000);
          console.error(getErrorMessage(error));
        }
      }
      if (errorCount >= 10) {
        throw new Error('Too many errors with getCompanyInformation');
      }
    }
    console.info('FINISH COMPANY INFORMATION FETCHING');
    // Everything is ok
    return true;
  } catch (error) {
    console.error('Error occured in getCompanyInformation');
    console.error(getErrorMessage(error));
    return false;
  }
};
