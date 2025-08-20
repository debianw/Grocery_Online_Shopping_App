export const config = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
};

export const { PORT, DB_URL, APP_SECRET } = config;
