import { Request, Response, NextFunction } from 'express';
import { Driver } from 'neo4j-driver';
import debugError from '../../services/debug_error';
import s3Uploadv2 from '../../services/upload_s3_service';
import runPythonScript from '../../services/music_python_classify';

export default class FeedsController {
  private db: Driver;
  constructor(db: Driver) {
    this.db = db;
  }

  public test = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'Feeds Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.file);
      s3Uploadv2(req.file);
      return res.status(200).json({ status: 200, data: 'Feeds Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };


  public musicClassify = async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    const pythonScriptPath = 'src/FeedsClustering/main.py';

    try {
      const pythonScriptOutput = await runPythonScript(pythonScriptPath);
      console.log(`Python script output: ${pythonScriptOutput}`);
      res.send('Python script executed successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };

  public getFeeds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'Feeds Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public getAllFeeds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'Feeds Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public updateFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'Feeds Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public deleteFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'Feeds Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public addFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'Feeds Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public connectGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'Feeds Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public disconnectGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'Feeds Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };
}
