import { Router, Request, Response, NextFunction } from 'express';
import checkAuth from '../middlewares/attachCurrentUser';
import UserController from '../controllers/userController';
import { Driver, auth, driver } from 'neo4j-driver';
import config from '../../config';
  
const route = Router();

// 1. Get user
// 2. Register user
// 3. Update User
// 4. Delete User

export default (app: Router) => {
  app.use('/user', route);

  const db: Driver = driver(config.dbHost, auth.basic(config.dbUser, config.dbPass),
  {/* encrypted: 'ENCRYPTION_OFF' */ },);

  const userController = new UserController(db);
    
  //* GET CALLS
  route.get('/test', checkAuth, userController.test);
  route.get('/auth/google', checkAuth, userController.googleAuthenticate);
  route.get('/auth/google/callback', checkAuth, userController.googleAuthenticateCallback);
  route.get('/all', checkAuth, userController.getAllUsers);
  route.get('/', checkAuth, userController.getUserBySessionID);
  route.get('/exists', checkAuth, userController.userExists);
  route.get('/usernameexists', checkAuth, userController.usernameExists);
  route.get('/linkGenres', checkAuth, userController.getLinkedGenres);

  //* POST CALLS
  route.post('/', userController.registerUser);
  route.post('/linkGenres', checkAuth, userController.linkGenres);

  //* PUT CALLS
  route.put('/', checkAuth, userController.updateUser);

  //* DELETE CALLS
  route.delete('/', checkAuth, userController.deleteUser);
  route.delete('/linkGenres', checkAuth, userController.deleteLinkedGenres);
};