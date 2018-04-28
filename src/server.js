import express from 'express';
import http from 'http';
import chalk from 'chalk';
import bodyParser from 'body-parser';
import logger from 'winston';
import config from './config/config';
import routes from './routes';
import database from './config/database';

const port = config.get('apiPort');

logger.level = config.get('logLevel');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { timestamp: true, colorize: true });

const app = express();
app.use(bodyParser.json());

routes.configureRoutes(app);

function listen() {
  const server = http.Server(app);
  server.listen(port);
  logger.info(chalk.green(`Terraform State API listening on port ${port}`));
}

database.createConnection()
  .then(listen)
  .catch(error => logger.error(chalk.red(`Error connecting to the database ${error}`)));
