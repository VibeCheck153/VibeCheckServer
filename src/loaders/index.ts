import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');


  const testModel = {
    name: 'testModel',
    model: require('../models/test').default,
  };

  const userModel = {
    name: 'userModel',
    model: require('../models/user').default,
  };

  const venueModel = {
    name: 'venueModel',
    model: require('../models/venue').default,
  };

  const { logger } = await dependencyInjectorLoader({
    mongoConnection,
    models: [
      testModel,
      userModel,
      venueModel
    ],
  });
  Logger.info('✌️ Dependency Injector loaded');


  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
