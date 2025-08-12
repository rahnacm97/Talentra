import dotenv from 'dotenv';

dotenv.config();

const config = {
  mongodbUri: process.env.MONGO_URI,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  jwtExpiresIn: process.env.JWT_ACCESS_EXPIRY,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRY,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  frontendUrl: process.env.FRONTEND_URL,
  corsOrigin: process.env.CORS_ORIGIN,
  clientSecret: process.env.CLIENT_SECRET,
};

export { config };