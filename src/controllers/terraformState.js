import logger from 'winston';

import terraformStateRepository from '../dataaccess/terraformStateRepository';

function getState(request, response) {
  logger.debug(`GET request for: ${request.params.name}`);
  return terraformStateRepository.getStateByName(request.params.name)
    .then((stateRecord) => {
      // Even if null is being returned still return a 200 as this is what Terraform expects
      response.status(200);
      if (stateRecord && stateRecord.state) {
        return response.send(stateRecord.state);
      }

      return response.send('');
    })
    .catch((error) => {
      logger.error(error);
      return response.status(500).send({ message: `Unable to load state for: ${request.params.name}` });
    });
}

function putState(request, response) {
  logger.debug(`POST request for: ${request.params.name}`);
  return terraformStateRepository.createOrUpdate(request.params.name, request.body)
    .then(state => response.status(201).send(state))
    .catch((error) => {
      logger.error(error);
      return response.status(500).send({ message: `Unable to store state for: ${request.params.name}` });
    });
}

function deleteState(request, response) {
  logger.debug(`DELETE request for: ${request.params.name}`);
  return terraformStateRepository.deleteState(request.params.name)
    .then((result) => {
      if (result.n > 0) {
        response.status(204).send();
      } else {
        response.status(404).send();
      }
    })
    .catch((error) => {
      logger.error(error);
      return response.status(500).send({ message: `Unable to delete state for: ${request.params.name}` });
    });
}

function lock(request, response) {
  logger.debug(`LOCK request for: ${request.params.name}`);
  return terraformStateRepository.lockState(request.params.name)
    .then(() => response.status(200).send())
    .catch(err => response.status(423).send(err));
}

function unlock(request, response) {
  logger.debug(`UNLOCK request for: ${request.params.name}`);
  return terraformStateRepository.unlockState(request.params.name)
    .then(() => response.status(200).send())
    .catch(err => response.status(500).send(err));
}

export default {
  getState,
  putState,
  deleteState,
  lock,
  unlock,
};
