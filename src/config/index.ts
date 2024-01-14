import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'development') {
  const envFound = dotenv.config();
  if (envFound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
}

export default {
  port: parseInt(process.env.PORT, 10),

  databaseURL: process.env.MONGODB_URI,
  progressToken: process.env.PROGRESS_TOKEN,
  socketPort: process.env.SOCKET_PORT,

  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleClientID: process.env.GOOGLE_CLIENT_ID,

  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  secretKey: process.env.SECRET_KEY,
  jwtAdminToken: process.env.JWT_ADMIN_TOKEN,

  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,

  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsBucketName: process.env.AWS_BUCKET_NAME,

  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  api: {
    prefix: '',
  },

};
