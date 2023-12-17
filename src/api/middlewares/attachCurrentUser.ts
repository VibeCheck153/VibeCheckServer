import { Container } from 'typedi';
import { verify } from 'jsonwebtoken';
import { Logger } from 'winston';
import config from '../../config'


const checkAuth = async (req, res, next) => {
  const logger: Logger = Container.get('logger');
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
      throw new Error("no Authorization header found")
    }
    
    try{
      if (authHeader && authHeader.includes('Bearer')) {
        let token =  authHeader.split(' ')[1]
        var decoded = verify(
          token,
          config.jwtAccessTokenSecret
        );
        req.isTokenPresent = true;
        return next();
      }else{
        return res.sendStatus(401).send('Access denied')
      }
    }catch(err ){
      console.log(`ERROR FORM AUTH MIDDLEWARE::${err}`);
        // res.status(400).send('Invalid token')
        logger.error('🔥 Error attaching user to req: %o', err);
        return next(err);
    }

  } catch (e) {
    logger.error('🔥 Error attaching user to req: %o', e);
    return next(e);
  }
};

export default checkAuth;
