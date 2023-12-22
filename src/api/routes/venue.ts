import { Router, Request, Response, NextFunction } from 'express';
import { Driver, auth, driver } from 'neo4j-driver';
import VenueController from '../controllers/venueController';
import config from '../../config';
import checkAdmin from '../middlewares/check_admin';
  
const route = Router();


export default (app: Router) => {
  app.use('/venue', route);

  const db: Driver = driver(config.dbHost, auth.basic(config.dbUser, config.dbPass),
  {/* encrypted: 'ENCRYPTION_OFF' */ },);

  const venueController = new VenueController(db);

  //* GET CALLS
  route.get('/test', checkAdmin, venueController.test);
  route.get('/', checkAdmin, venueController.getAllVenues);
  route.get('/name', checkAdmin, venueController.getVenueByName);
  route.get('/search', checkAdmin, venueController.searchVenue);
  route.get('/id', checkAdmin, venueController.getVenueByID);
  

  //* POST CALLS
  route.post('/', checkAdmin, venueController.registerVenue);

  //* PUT CALLS
  route.put('/', checkAdmin, venueController.updateVenue);

  //* DELETE CALLS
  route.delete('/', checkAdmin, venueController.deleteVenue);
};