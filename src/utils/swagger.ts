import { Express, Request, Response } from 'express';
import swaggerDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import Logger from '../loaders/logger';
import config from '../config';

const version: string = '1.0';

const options: swaggerDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VibeCheck REST APIs',
      version,
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          schema: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['../api/routes/*.ts', '../interfaces/*.ts'],
};

const swaggerSpec = swaggerDoc(options);

export function swaggerDocs(app: Express, port: number) {
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  app.get('docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  Logger.info(`Docs available at http://localhost:${config.port}/docs`);
}
