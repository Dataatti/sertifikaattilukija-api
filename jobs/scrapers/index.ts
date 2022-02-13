import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

export const processGreenKeyAland = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];

  $('.entry-content > ul > li a, .entry-content > ul > li span').each((index, node) => {
    // Trim and collapse whitespace
    const companyName = $(node).text().trim().replace(/\s\s+/g, ' ');

    if (companyName) {
      output.push({ companyName, certificateId: 'green-key' });
    }
  });
  const uniqueOutput = output.filter(
    (value, index, self) => index === self.findIndex((t) => t.companyName === value.companyName)
  );

  return uniqueOutput;
};

export const processGreenKeyMain = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];

  $(
    'article:not(.green-activities) .fusion-portfolio-content-wrapper > .fusion-portfolio-content > .fusion-post-title > a'
  ).each((index, node) => {
    // Trim and collapse whitespace
    const companyName = $(node).text().trim().replace(/\s\s+/g, ' ');
    if (companyName) {
      output.push({ companyName, certificateId: 'green-key' });
    }
  });

  return output;
};

export const processGreenActivities = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];

  $(
    'article.green-activities .fusion-portfolio-content-wrapper > .fusion-portfolio-content > .fusion-post-title > a'
  ).each((index, node) => {
    // Trim and collapse whitespace
    const companyName = $(node).text().trim().replace(/\s\s+/g, ' ');
    if (companyName) {
      output.push({ companyName, certificateId: 'green-activities' });
    }
  });

  return output;
};

export const processTourCert = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];

  $('.ajax_posts > .community-card .community-card-content h4.red.centered').each((index, node) => {
    // Trim whitespace
    const companyName = $(node).text().trim();
    if (companyName) {
      output.push({ companyName, certificateId: 'tour-cert' });
    }
  });

  return output;
};

export const processWWFGreenOffice = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];

  $(
    '#content .container-fluid.text-block.go-pillar .text-block__text > p:nth-of-type(-n+2) > a'
  ).each((index, node) => {
    // Trim whitespace and trailing comma
    const companyName = $(node).text().trim().replace(/(,$)/g, '');
    if (companyName) {
      output.push({ companyName, certificateId: 'wwf-green-office' });
    }
  });

  return output;
};

type GEOGolfDataType = {
  id: number;
  club_name: string;
  lat: string;
  lng: string;
  category: string;
  certified: number;
  certF: number;
  certT: number;
  certD: number;
  feature_img: string;
  country_name: string;
  country: string;
  region: string;
  city: string;
  uri: string;
};

export const processGEOGolf = (json: GEOGolfDataType[]): ApiCompanyCertificate[] => {
  console.log(typeof json);
  const data = json?.filter((company) => company.certified === 1 && company.country === 'Finland');

  const output: ApiCompanyCertificate[] = data.map((d) => ({
    companyName: d.club_name,
    certificateId: 'geo-golf',
  }));

  return output;
};

export const processEkokompassi = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];
  const nodes = $('.customers-list > li.customer > p.name');

  nodes.each((index, node) => {
    const name = $(node)
      .text()
      .trim()
      .replace(/(\r\n|\n)/gm, '')
      // Replace extra spaces if there is multiple spaces sequentially
      .replace(/ +(?= )/g, '');

    if (name) {
      output.push({ companyName: name, certificateId: 'ekokompassi' });
    }
  });

  return output;
};

export const processBlueFlag = (html: string): ApiCompanyCertificate[] => {
  // Currently https://greenkey.fi/blue-flag/ can't be scraped in a general way, so return the only certificated company
  return [{ companyName: 'Saaristokeskus Korpoström', certificateId: 'blue-flag' }];
};

export const processECEATSuomi = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];

  $('.content-column.two_third.last_column > ul > li a').each((index, node) => {
    // Trim and collapse whitespace and remove trailing –
    const companyName = $(node).text().trim().replace(/\s\s+/g, ' ').replace(/ –$/gm, '');
    if (companyName) {
      output.push({ companyName, certificateId: 'eceat-suomi' });
    }
  });

  return output;
};

export const processEMAS = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];
  const nodes = $(
    '#Main_Main_divLevelPresentation > div > div > div > div.page-contents > table > tbody > tr > td:nth-child(3) > p:nth-child(1) > a'
  );

  nodes.each((index, node) => {
    // Trim and collapse whitespace
    const rawCompanyName = $(node).text().trim().replace(/\s\s+/g, ' ');
    const companyName = rawCompanyName?.split(',')?.[0];

    if (companyName) {
      output.push({ companyName, certificateId: 'emas' });
    }
  });

  return output;
};

export const processEUEcolabel = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];
  const nodes = $('#post-3793 > div > p:nth-child(1) > a');

  nodes.each((index, node) => {
    // Trim and collapse whitespace
    const rawCompanyName = $(node).text().trim().replace(/\s\s+/g, ' ');
    const companyName = rawCompanyName?.split(',')?.[0];

    if (companyName) {
      output.push({ companyName, certificateId: 'eu-ecolabel' });
    }
  });

  return output;
};

export const processJoutsenmerkki = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];
  const nodes = $(
    '#search-filter-form-28257 > ul > li.sf-field-taxonomy-company > label > select > option.sf-level-0'
  );

  nodes.each((index, node) => {
    // Trim and collapse whitespace
    const companyName = $(node).text().trim().replace(/\s\s+/g, ' ');

    if (companyName) {
      output.push({ companyName, certificateId: 'joutsenmerkki' });
    }
  });

  // Remove first element
  output.shift();

  return output;
};

export const processRoopeSatama = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];
  const nodes = $('main > .content > p  a');

  nodes.each((index, node) => {
    // Trim and collapse whitespace
    const rawCompanyName = $(node).text().trim().replace(/\s\s+/g, ' ');
    const companyName = rawCompanyName?.split(',')?.[0];

    if (companyName) {
      output.push({ companyName, certificateId: 'roope-satama' });
    }
  });

  return output;
};

export const processTravelife = (html: string): ApiCompanyCertificate[] => {
  const $ = cheerio.load(html);
  const output: ApiCompanyCertificate[] = [];
  const nodes = $('#Finland > div.company_info span a');

  nodes.each((index, node) => {
    // Trim and collapse whitespace
    const companyName = $(node).text().trim().replace(/\s\s+/g, ' ');

    if (companyName) {
      output.push({ companyName, certificateId: 'travelife' });
    }
  });

  return output;
};

/**
 * SFT api types
 */
type STFCertificate = {
  id: string;
  name: string;
  address: string;
  zipcode: string;
  url: string;
  public_name: string;
  city: string;
  region: string;
  greater_area: string;
  description: string;
  featured_image: string;
  category: string;
  service_categories: any[];
};

const fetchSTF = async (page: number) => {
  try {
    const res = await fetch(
      `https://api.sustainabletravel.businessfinland.fi/public/accepted-companies/${page}`
    );
    const json = await res.json();
    return json?.data;
  } catch (err) {
    return null;
  }
};

/**
 * Function for fetching all sft sertificates
 * SFT api doesn't have metadata or anything to know
 * how many certificates are there so we have to fetch until
 * api returns 404
 * @returns
 */
const fetchAllSTF = async () => {
  let i = 1;
  let hasMore = true;
  let STFCertificates: STFCertificate[] = [];

  while (hasMore) {
    const data: STFCertificate[] = await fetchSTF(i);
    if (data) {
      STFCertificates = [...STFCertificates, ...data];
    } else {
      hasMore = false;
    }
    i++;
  }

  return STFCertificates;
};

/**
 * Function for fetching and syncing SFT certificates
 * from https://api.sustainabletravel.businessfinland.fi/public/accepted-companies/
 * @returns status as boolean, true = ok
 */
export const processSTF = async (url: string) => {
  const STFCertificates = await fetchAllSTF();
  if (STFCertificates.length <= 0) {
    throw new Error('No STF certificates found');
  }
  const companyCertificates: ApiCompanyCertificate[] = STFCertificates.map((cert) => ({
    companyName: cert.name,
    certificateId: 'stf',
  }));

  return companyCertificates;
};
