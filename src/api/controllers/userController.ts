import { Request, Response, NextFunction } from 'express';
import { Driver } from 'neo4j-driver';
import debugError from '../../services/debug_error';
import passport from 'passport';
import config from '../../config';
import { UserFactory } from '../../interfaces/IUser';
import Jwt from 'jsonwebtoken';

export default class UserController {
  private db: Driver;
  constructor(db: Driver) {
    this.db = db;
  }

  public test = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json({ status: 200, data: 'User Routes Working!' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public googleAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      passport.authenticate('google', { scope: ['email', 'profile'] });
      return res.status(200).json({ status: 200, data: 'User Authenticate' });
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public googleAuthenticateCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      passport.authenticate('google', {
        fail: (request: Request, response: Response) => {
          return response.status(400).json({ status: 200, data: 'User Authentication Failed' });
        },
      }),
        (request: Request, response: Response) => {
          return response.status(200).json({ status: 200, data: 'User Authenticated Successfully!' });
        };
    } catch (err) {
      debugError(err);
      return next(err);
    }
  };

  public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: config.dbName });
    try {
      const max: number = +req.query.max || 10;
      const offset: number = +req.query.offset || 0;
      const skip: number = offset * max;

      const query = `
        MATCH (n:User)
        RETURN n.uid AS uid, n.username AS username, n.email AS email, n.age AS age,
          n.dob AS dob, n.photoURL AS photoURL, n.level AS level,
          n.location AS location, n.likes AS likes, n.vibePoints AS vibePoints
        SKIP ${skip} LIMIT ${max};
      `;

      const result = await session.run(query);

      const resultList = result.records.map(record => {
        const user = UserFactory.createUserFromRecord(record, config.secretKey);
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

  public getUserBySessionID = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: 'neo4j' });
    try {
      const query = `
        MATCH (n:User {uid:"${req.body.uid}"})
        RETURN n.uid AS uid, n.username AS username, n.email AS email, n.age AS age,
          n.dob AS dob, n.photoURL AS photoURL, n.level AS level,
          n.location AS location, n.likes AS likes, n.vibePoints AS vibePoints
      `;
      const result = await session.run(query);
      if (result.records.length > 0) {
        const record = result.records[0];
        const data = UserFactory.createUserFromRecord(record, config.secretKey);
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

  public userExists = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: config.dbName });
    try {
      const query = `
      MATCH (n:User {uid:"${req.body.uid}"})
      RETURN n.uid AS uid;
    `;
      const result = await session.run(query);
      const record = result.records[0];
      if (record != null) {
        return res.status(200).json({ status: 200, data: true });
      }
      return res.status(404).json({ status: 404, data: false });
    } catch (err) {
      debugError(err);
      return next(err);
    } finally {
      session.close();
    }
  };

  public usernameExists = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: config.dbName });
    try {
      const username = req.body.username.replace(/\s+/g, '').toLowerCase();
      const query = `
        MATCH (n:User)
        WHERE replace(toLower(n.username), " ", "") = '${username}'
        RETURN n.uid AS uid;
      `;
      const result = await session.run(query);
      const record = result.records[0];
      if (record != null) {
        return res.status(200).json({ status: 200, data: true });
      }
      return res.status(404).json({ status: 404, data: false });
    } catch (err) {
      debugError(err);
      return next(err);
    } finally {
      session.close();
    }
  };

  public registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: config.dbName });
    const userInput = req.body;
    try {
      const createQuery = `
          CREATE (u:User {
            uid: "${userInput.uid}",
            username: "${userInput.username}",
            email: "${userInput.email}",
            photoURL: "${
              userInput.photoURL ||
              'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
            }",
            age: ${userInput.age !== undefined ? userInput.age : 18},
            location: [${userInput.location[0]}, ${userInput.location[1]}],
            dob: "${userInput.dob}",
            likes: ${userInput.likes !== undefined ? userInput.likes : 0},
            vibePoints: ${userInput.vibePoints !== undefined ? userInput.vibePoints : 0},
            level: ${userInput.level !== undefined ? userInput.level : 1}
          })
          RETURN u.uid as uid, u.email as email, u.username as username;
        `;
      const createResult = await session.run(createQuery);
      console.log(createResult.records[0]);
      const token = Jwt.sign(
        { uid: createResult.records[0]['_fields'][0], email: createResult.records[0]['_fields'][1] },
        config.jwtAccessTokenSecret,
        {
          expiresIn: '120d',
        },
      );
      console.log(token);

      return res.status(200).json({ status: 200, data: 'User created successfully!' });
    } catch (error) {
      debugError(error.toString());
      return next(error);
    } finally {
      session.close();
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: config.dbName });
    try {
      const { id, ...params } = req.body;
      console.log(params);
      if (params.hasOwnProperty('username')) {
        const username = params['username'].replace(/\s+/g, '').toLowerCase();
        const usernameCheckQuery = `
        MATCH (n:User)
        WHERE toLower(REPLACE(n.username, ' ', '')) = $username AND n.uid <> $id
        RETURN n.uid AS uid;
      `;
        const usernameCheckResult = await session.run(usernameCheckQuery, { username, id });

        if (usernameCheckResult.records.length > 0) {
          return res.status(400).json({ status: 400, data: 'Username already exists' });
        }
      }

      const existingUser = await session.run(
        `
      MATCH (u:User {uid: "${req.body.uid}"})
      RETURN u
    `,
        { id },
      );

      if (!existingUser.records.length) {
        console.log('Sorry, No such user exists!');
        return res.status(404).json({ status: 404, data: 'User not found' });
      }

      const setStatements = Object.entries(params).map(([key, value]) => `u.${key} = $${key}`);
      const setQuery = setStatements.join(', ');

      const updateQuery = `
      MATCH (u:User {uid: "${req.body.uid}"})
      SET ${setQuery}
      RETURN u.username AS username, u.age AS age, u. photoURL as photoURL, u.latitude AS latitude, u.longitude AS longitude, u.gender AS gender
    `;

      const result = await session.run(updateQuery, { id, ...params });
      return res.status(200).json({ status: 200, data: 'User updated!' });
    } catch (err) {
      debugError(err);
      return next(err);
    } finally {
      session.close();
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: config.dbName });
    try {
      const uid = req.body.uid;
      const query = `
        MATCH (user:User {uid: ${uid}})
        DETACH DELETE user;
      `;

      const result = await session.run(query);
      const deleted = result.records[0].get('deleted').toNumber();
      if (deleted === 0) {
        return res.status(404).json({ status: 404, data: 'User does not exist and cannot be deleted.' });
      } else {
        return res.status(201).json({ status: 201, data: 'User Profile Deleted Successfully !' });
      }
    } catch (err) {
      debugError(err);
      return next(err);
    } finally {
      session.close();
    }
  };

  public linkGenres = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: config.dbName });
    try {
      const uid = req.body.uid;
      const genres = req.body.genres.map((genre: string) => `"${genre}"`).join(', ');
      const query = `
      WITH [${genres}] AS genres
      UNWIND genres AS genre
      MATCH (s:Genre {name:genre})
      MATCH (u:User {uid:"${uid}"})
      MERGE (u)-[:LIKE_GENRE]->(s)
    `;

      const result = await session.run(query);

      return res.status(200).json({ status: 200, data: 'Users genres added successfully!' });
    } catch (err) {
      debugError(err);
      return next(err);
    } finally {
      session.close();
    }
  };

  public getLinkedGenres = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: config.dbName });
    try {
      const query = `
      MATCH (n:User{uid:"${req.body.uid}"})-[r:LIKE_GENRE]->(g:Genre)
      RETURN COLLECT(DISTINCT g.name) AS genres
    `;
      const result = await session.run(query);
      session.close();
      if (result.records[0]['_fields'][0].length > 0) {
        return res.status(200).json({ status: 200, data: result.records[0]['_fields'][0] });
      } else {
        return res.status(404).json({ status: 404, data: [] });
      }
    } catch (err) {
      debugError(err);
      return next(err);
    } finally {
      session.close();
    }
  };

  public deleteLinkedGenres = async (req: Request, res: Response, next: NextFunction) => {
    const session = this.db.session({ database: config.dbName });
    try {
      const genres = req.body.genres;

      if (!genres || genres.length === 0) {
        return res.status(400).json({ status: 400, error: 'Genres array is required.' });
      }
  
      const genresString = genres.map((genre: string) => `"${genre}"`).join(', ');
      
      //! CHange this not working
      const query = `
        MATCH (user:User {uid: "${req.body.uid}"})-[r:LIKE_GENRE]->(genre:Genre)
        WHERE genre.name IN [${genresString}]
        DETACH DELETE genre
      `;
      const result = await session.run(query);
      console.log(result);
      return res.status(200).json({ status: 200, data: "Deleted successfully!" });
    } catch (err) {
      debugError(err);
      return next(err);
    } finally {
      session.close();
    }
  };
}
