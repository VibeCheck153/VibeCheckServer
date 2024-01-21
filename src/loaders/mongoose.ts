import mongoose from 'mongoose';
import config from '../config';

export default async (): Promise<any> => {
  const connection = await mongoose.connect(config.databaseURL, {
    appName: 'VibeCheck',
    autoIndex: true,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // ssl: true,
    // checkKeys: true,
    // tls: true,

    // cert: require('fs').readFileSync(`${__dirname}/mongocerts.crt`)
  });

  return connection.connection.db;
};
