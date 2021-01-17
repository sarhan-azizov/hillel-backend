// eslint-disable-next-line
const env = require('dotenv');

env.config({
  path: `${__dirname}/.env/.development`,
});

module.exports = {
  type: 'mongodb',
  port: 27017,
  host: process.env.MONGO_CONNECTION_HOST,
  username: process.env.MONGO_CONNECTION_USERNAME,
  password: process.env.MONGO_CONNECTION_PASSWORD,
  database: process.env.MONGO_CONNECTION_DATABASE,
  entities: [`${__dirname}/**/*.entity.js`],
  seeds: [`${__dirname}/**/*.seed.js`],
  factories: [`${__dirname}/**/*.factory.js`],
  synchronize: Boolean(process.env.MONGO_SYNCHRONIZE),
  useUnifiedTopology: true,
  options: {
    useUTC: true,
  },
};
