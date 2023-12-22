import { Router, Request, Response, NextFunction } from 'express';
  
const route = Router();

export default (app: Router) => {
  app.use('/tests', route);

  route.get('/status', (req: Request, res: Response) => {
    return res.json({ app: "Server running successfully" }).status(200);
  });
};