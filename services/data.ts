import { Request, Response } from 'express';
import { getCompanies, sendDatabaseRequest } from '../utils/database';
import { getErrorMessage } from '../utils';

type ResponseData = {
  totalResults: number;
  resultsFrom: number;
  data: Company[];
};

/**
 * Route for fetching company information
 * @param req Next.js request
 * @param res Next.js response
 */
export const handler = async (req: Request, res: Response) => {
  try {
    const { name, city, certificate, limit, offset } = req.query;
    const _city = city ? (city as string).split(',') : undefined;
    const _certificate = certificate ? (certificate as string).split(',') : undefined;
    const _limit = limit ? parseInt(limit as string) : undefined;
    const _offset = offset ? parseInt(offset as string) : undefined;

    const { companies, total } = await sendDatabaseRequest(
      async (db) => await getCompanies(db, _limit, _offset, name as string, _certificate, _city)
    );

    const resultObject = {
      totalResults: total ? parseInt(total as string) : 0,
      resultsFrom: _offset ?? 0,
      data: companies,
    };

    res.status(200).json(resultObject);
  } catch (error) {
    res.status(500).json({ msg: getErrorMessage(error) });
  }
};

export default handler;
