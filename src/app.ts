import 'reflect-metadata';

import config from './config';

import express from 'express';

import Logger from './loaders/logger';

import {swaggerDocs} from '../src/utils/swagger';

async function startServer() {
  const app = express();

  await require('./loaders').default({ expressApp: app });

  app.listen(config.port, () => {
    Logger.info(`
    ################################################
    🛡️ Database Server connected on : VibeCheckServer 🛡️
    ################################################
  `);
    
    Logger.info(`
      ################################################
      🛡️ Server listening on port: ${config.port} 🛡️
      ################################################
    `);

    swaggerDocs(app, config.port);
  }).on('error', err => {
    Logger.error(err);
    process.exit(1);
  });

}

startServer();
