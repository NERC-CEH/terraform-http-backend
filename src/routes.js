import status from './controllers/status';
import terraformState from './controllers/terraformState';

function configureRoutes(app) {
  app.get('/status', status.status);
  app.get('/state/:name', terraformState.getState);
  app.post('/state/:name', terraformState.putState);
  app.delete('/state/:name', terraformState.deleteState);
  app.lock('/state/:name', terraformState.lock);
  app.unlock('/state/:name', terraformState.unlock);
}

export default {
  configureRoutes
};
