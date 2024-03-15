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
    const session = this.db.session({ database: config.dbName });
    try {
      const max: number = +req.query.max || 10;
      const offset: number = +req.query.offset || 0;
      const skip: number = offset * max;

      const query = `
        MATCH (n:Venue)
        RETURN id(n) AS id, n.type AS type, n.name AS name, n.desc as desc,
          n.gmap_link AS gmap_link, n.instagram_link AS instagram_link, n.address AS address,
          n.location AS location, n.latitude AS latitude, n.longitude AS longitude
        SKIP ${skip} LIMIT ${max};
      `;

      const result = await session.run(query);

      const resultList = result.records.map(record => {
        const user = VenueFactory.createVenueFromRecord(record, config.secretKey);
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
  

  public searchVenue = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: config.dbName });
    try {
      const name = req.body.name.trim();
      const escapedName = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`.*${escapedName}.*`, 'i');
      
      const query = `
      MATCH (n:Venue)
      WHERE toLower(n.name) =~ $nameRegex
      RETURN id(n) AS id, n.type AS type, n.name AS name, n.desc AS desc,
        n.gmap_link AS gmap_link, n.instagram_link AS instagram_link, n.address AS address,
        n.location AS location, n.coordinates AS coordinates;
      `;
    
      const result = await session.run(query, { nameRegex: `(?i).*${escapedName}.*` });
  
      const resultList = result.records.map(record => {
        const venue = VenueFactory.createVenueFromRecord(record, config.secretKey);
        return venue;
      });
  
      if (resultList.length === 0) {
        return res.status(404).json({ status: 404, data: 'No Venue with this name' });
      }
  
      return res.status(200).json({ status: 200, data: resultList });
    } catch (err) {
      debugError(err);
      return next(err);
    } finally {
      session.close();
    }
  };

  public getVenueByID = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: 'neo4j' });
    try {
      const query = `
        MATCH (n:Venue)
        WHERE id(n) = ${req.body.id}
        RETURN id(n) AS id, n.type AS type, n.name AS name, n.desc AS desc,
        n.gmap_link AS gmap_link, n.instagram_link AS instagram_link, n.address AS address,
        n.location AS location, n.coordinates AS coordinates;
      `;
      const result = await session.run(query);
      if (result.records.length > 0) {
        const record = result.records[0];
        const data = VenueFactory.createVenueFromRecord(record, config.secretKey);
        return res.status(200).json({ status: 200, data: data });
      } else {
        return res.status(404).json({ status: 404, data: 'Sorry, No Venue Exists with this id !' });
      }
    } catch (e) {
      debugError(e.toString());
      return next(e);
    } finally {
      session.close();
    }
  };

  public registerVenue = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: config.dbName });
    const venueInput = req.body;
    try {
      const createQuery = `
        CREATE (:Venue 
          {{
            type: "${venueInput.type}",
            name: "${venueInput.name}",
            desc: "${venueInput.desc}",
            location: "${venueInput.location}",
            gmap_link: "${venueInput.gmap_link}",
            instagram_link: "${venueInput.instagram_link}",
            address: "${venueInput.address}",
            coordinates: ${venueInput.coordinates}
          }})
        `;
      const createResult = await session.run(createQuery);

      return res.status(200).json({ status: 200, data: 'Venue created successfully!' });
    } catch (error) {
      debugError(error.toString());
      return next(error);
    } finally {
      session.close();
    }
  };

  public updateVenue = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({database: config.dbName});
    try {
      const { id, ...params } = req.body;

      const existingVenue = await session.run(
        `
        MATCH (n:Venue)
        WHERE id(n) = ${req.body.id}
        RETURN n;
    `,
        { id },
      );

      if (!existingVenue.records.length) {
        console.log('Sorry, No such venue exists!');
        return res.status(404).json({ status: 404, data: 'Venue not found' });
      }

      const setStatements = Object.entries(params).map(([key, value]) => `u.${key} = $${key}`);
      const setQuery = setStatements.join(', ');

      const updateQuery = `
        MATCH (n:Venue)
        WHERE id(n) = ${req.body.id}
        SET ${setQuery}
        RETURN id(n) AS id, n.type AS type, n.name AS name, n.desc AS desc,
        n.gmap_link AS gmap_link, n.instagram_link AS instagram_link, n.address AS address,
        n.location AS location, n.coordinates AS coordinates;`;

      const result = await session.run(updateQuery, { id, ...params });
      return res.status(200).json({ status: 200, data: 'Venue updated!' });
    } catch (err) {
      debugError(err);
      return next(err);
    } finally {
      session.close();
    }
  };

  public deleteVenue = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: config.dbName });
    try {
      const id = req.body.id;
      const query = `
        MATCH (n:Venue)
        WHERE id(n) = ${id}
        DETACH DELETE n;
      `;

      const result = await session.run(query);
      const deleted = result.records[0].get('deleted').toNumber();
      if (deleted === 0) {
        return res.status(404).json({ status: 404, data: 'Venue does not exist and cannot be deleted.' });
      } else {
        return res.status(201).json({ status: 201, data: 'Venue Deleted Successfully !' });
      }
    } catch (err) {
      debugError(err);
      return next(err);
    } finally {
      session.close();
    }
  };
}
