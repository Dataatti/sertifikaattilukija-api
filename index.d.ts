type ApiCompany = {
  id?: number;
  name: string;
  vat_number: string;
  address?: string;
  post_code?: string;
  city?: string;
};

type ApiCompanyCertificate = {
  companyName: string;
  certificateId: string;
};

interface Company {
  companyId?: number;
  name: string;
  vatNumber: string;
  city: string;
  address: string;
  postCode: string;
  certificateId?: string[];
}

interface Certificate {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  description: string;
}
