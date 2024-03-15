import { Router, Request, Response, NextFunction } from 'express';
import { Driver, auth, driver } from 'neo4j-driver';
import VenueController from '../controllers/venueController';
import config from '../../config';
import checkAuth from '../middlewares/attachCurrentUser';
  
const route = Router();


export default (app: Router) => {
  app.use('/venue', route);

  const db: Driver = driver(config.dbHost, auth.basic(config.dbUser, config.dbPass),
  {/* encrypted: 'ENCRYPTION_OFF' */ },);

  const venueController = new VenueController(db);

  //* GET CALLS
  route.get('/test', checkAuth, venueController.test);
  route.get('/', checkAuth, venueController.getAllVenues);
  route.get('/search', checkAuth, venueController.searchVenue);
  route.get('/id', checkAuth, venueController.getVenueByID);
  

  //* POST CALLS
  route.post('/', checkAuth, venueController.registerVenue);

  //* PUT CALLS
  route.put('/', checkAuth, venueController.updateVenue);

  //* DELETE CALLS
  route.delete('/', checkAuth, venueController.deleteVenue);
};