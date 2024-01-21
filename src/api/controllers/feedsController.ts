import { Request, Response, NextFunction } from 'express';
import { Driver } from 'neo4j-driver';
import debugError from '../../services/debug_error';
import s3Uploadv2 from '../../services/upload_s3_service';
import runPythonScript from '../../services/music_python_classify';
import config from '../../config';
import { FeedFactory, IFeed } from '../../interfaces/IFeed';
import axios from 'axios';

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

  //TODO: API KEY NOT WORKING, FIRST REGISTER
  public locationDetect = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const apiKey = config.googleLocationApiKey;
      const lat = req.body.latitude;
      const long = req.body.longitude;

      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`);
      const locationData = response.data;
      return res.status(200).json({ status: 200, data: locationData });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };


  public uploadVideo = async (req: Request, res: Response, next: NextFunction) => {
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
    const session = this.db.session({ database: config.dbName });
    try {
      const genre: string = req.body.genre;
      const max: number = +req.query.max || 10;
      const offset: number = +req.query.offset || 0;
      const skip: number = offset * max;

    const query = `
      MATCH (g:Genre {name: ${genre}})-[:RELATED_TO]->(n:Feed)
      RETURN n.id AS id, n.dateTime AS dateTime, n.music AS music,
             n.location AS location, n.likes AS likes, n.coordinates as coordinates
      SKIP ${skip} LIMIT ${max};
    `;

      const result = await session.run(query);

      const resultList = result.records.map(record => {
        const user = FeedFactory.createFeedFromRecord(record, config.secretKey);
        return user;
      });

      return res.status(200).json({ status: 200, data: resultList });
    } catch (error) {
      debugError(error.toString());
      return next(error);
    } finally {
      session.close();
    }
  };

  public getAllFeeds = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: config.dbName });
    try {
      const max: number = +req.query.max || 10;
      const offset: number = +req.query.offset || 0;
      const skip: number = offset * max;

      const query = `
        MATCH (n:Feed)
        RETURN n.id AS id, n.dateTime AS dateTime, n.music AS music,
        n.location AS location, n.likes AS likes, n.coordinates as coordinates
        SKIP ${skip} LIMIT ${max};
      `;

      const result = await session.run(query);

      const resultList = result.records.map(record => {
        const user = FeedFactory.createFeedFromRecord(record, config.secretKey);
        return user;
      });

      return res.status(200).json({ status: 200, data: resultList });
    } catch (error) {
      debugError(error.toString());
      return next(error);
    } finally {
      session.close();
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
    const session = this.db.session({ database: config.dbName });
    const feed: IFeed = req.body;
    const genres: string = req.body.genre;
    try {
      const createQuery = `
      CREATE (f:Feed 
        {
          music: "${feed.music}",
          dateTime: "${feed.dateTime}",
          likes: "${feed.likes}",
          location: "${feed.location}",
          coordinates: [-90, 0]
        })
        WITH f
        MATCH (g:Genre { name: '${genres}' })
        MERGE (f)-[:HAS_GENRE]->(g)
      `;
      const createResult = await session.run(createQuery);

      return res.status(200).json({ status: 200, data: 'Feed created successfully!' });
    } catch (error) {
      debugError(error.toString());
      return next(error);
    } finally {
      session.close();
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
