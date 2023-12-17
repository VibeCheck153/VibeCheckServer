import { Request, Response, NextFunction } from 'express';
import debugError from '../../services/debug_error';

export default class VenueController {
  constructor() {}

  public test = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'User Routes Working!' });
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
    try {
      return res.status(200).json({ status: 200, data: 'User Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
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
