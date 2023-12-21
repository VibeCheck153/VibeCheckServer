import { Request, Response, NextFunction } from 'express';
import { Driver } from 'neo4j-driver';
import debugError from '../../services/debug_error';
import config from '../../config';
import { VenueFactory } from '../../interfaces/IVenue';

export default class VenueController {  
  private db: Driver;
  constructor(db: Driver) {
    this.db = db;
  }


  public test = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'Venue Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public getAllVenues = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'User Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public getVenueByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'User Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public searchVenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'User Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public getVenueByID = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: 'neo4j' });
    try {
      const query = `
        MATCH (n:Venue {uid:"${req.body.id}"})
        RETURN n.id AS id, n.name AS name, n.description AS description
      `;
      const result = await session.run(query);
      if (result.records.length > 0) {
        const record = result.records[0];
        const data = VenueFactory.createVenueFromRecord(record, config.secretKey);
        return res.status(200).json({ status: 200, data: data });
      } else {
        return res.status(404).json({ status: 404, data: 'Sorry, No User Exists with this uid !' });
      }
    } catch (e) {
      debugError(e.toString());
      return next(e);
    } finally {
      session.close();
    }
  };

  public registerVenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'User Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public updateVenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'User Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public deleteVenue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'User Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };
}
