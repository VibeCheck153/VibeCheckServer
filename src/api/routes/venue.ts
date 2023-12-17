import { Router, Request, Response, NextFunction } from 'express';
import checkAuth from '../middlewares/attachCurrentUser';
import VenueController from '../controllers/venueController';
  
const route = Router();


export default (app: Router) => {
  app.use('/venue', route);

  const venueController = new VenueController();

  //* GET CALLS
  route.get('/test', checkAuth, venueController.test);
  route.get('/all', checkAuth, venueController.getAllVenues);
  route.get('/name', checkAuth, venueController.getVenueByName);
  route.get('/', checkAuth, venueController.searchVenue);
  route.get('/id', checkAuth, venueController.getVenueByID);
  

  //* POST CALLS
  route.post('/', venueController.registerVenue);

  //* PUT CALLS
  route.put('/', checkAuth, venueController.updateVenue);

  //* DELETE CALLS
  route.delete('/', checkAuth, venueController.deleteVenue);
};