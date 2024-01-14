import config from '../../config';
import { Router, Request, Response, NextFunction } from 'express';
import { Driver, auth, driver } from 'neo4j-driver';
import FeedsController from '../controllers/feedsController';
import checkAuth from '../middlewares/attachCurrentUser';
import multer from 'multer';
import {v4 as uuidv4} from 'uuid';

  
const route = Router();

export default (app: Router) => {
  app.use('/feeds', route);

  route.get('/status', (req: Request, res: Response) => {
    return res.json({ app: "Server running successfully" }).status(200);
  });

  const db: Driver = driver(config.dbHost, auth.basic(config.dbUser, config.dbPass),
  {/* encrypted: 'ENCRYPTION_OFF' */ },);

  const feedsController = new FeedsController(db);
    
  //* GET CALLS
  route.get('/test', checkAuth, feedsController.test);
  route.get('/', checkAuth, feedsController.getFeeds);
  route.get('/all', checkAuth, feedsController.getAllFeeds);

  //* POST CALLS
  // const storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "uploads");
  //   },
  //   filename: (req, file, cb) => {
  //     cb(null, `${uuidv4()}`) 
  //   }
  // });

  const storage = multer.memoryStorage();

  const fileFilter = (req: Request, file: { mimetype: string; }, cb) => {
    if (file.mimetype.split('/')[0] === "video"){
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
  }

  const upload = multer({storage, fileFilter, limits: {fileSize: 10000000}});
  
  route.post('/upload', checkAuth, upload.single("file"), feedsController.uploadFile);
  route.post('/detect', checkAuth, upload.single("file"), feedsController.musicClassify);
  route.post('/', checkAuth, feedsController.addFeed);
  route.get('/connect', checkAuth, feedsController.connectGenre);
  

  //* PUT CALLS
  route.put('/', checkAuth, feedsController.updateFeed);

  //* DELETE CALLS
  route.delete('/', checkAuth, feedsController.deleteFeed);
  route.get('/disconnect', checkAuth, feedsController.disconnectGenre);
  
};