import convict from 'convict';

const config = convict({
  logLevel: {
    doc: 'The logging level',
    format: 'String',
    default: 'debug',
    env: 'LOG_LEVEL',
  },
  databaseHost: {
    doc: 'The database hostname',
    format: 'String',
    default: 'localhost',
    env: 'DATABASE_HOST',
  },
  apiPort: {
    doc: 'The port for the API service',
    format: 'port',
    default: 8000,
    env: 'API_PORT',
  },
  username: {
    doc: 'The username for basic auth',
    format: 'String',
    default: 'username',
    env: 'USERNAME',
  },
  password: {
    doc: 'The password for basic auth',
    format: 'String',
    default: 'password',
    env: 'PASSWORD',
  },
  userName: {

  }
});

export default config;
