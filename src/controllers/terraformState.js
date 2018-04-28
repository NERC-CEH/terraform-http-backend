import logger from 'winston';

import terraformStateRepository from '../dataaccess/terraformStateRepository';

function getState(request, response) {
  logger.debug(`GET request for: ${request.params.name}`);
  return terraformStateRepository.getStateByName(request.params.name)
    .then((state) => {
      // Even if null is being returned still return a 200 as this is what Terraform expects
      return response.send(state ? state.state : null);
    });
}

function putState(request, response) {
  logger.debug(`POST request for: ${request.params.name}`);
  return terraformStateRepository.createOrUpdate({ name: request.params.name, state: request.body })
    .then((state) => response.status(201).send(state));
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
    });
}

function lock(request, response) {
  logger.debug(`LOCK request for: ${request.params.name}`);
  return terraformStateRepository.lockState(request.params.name)
    .then(() => response.status(200).send())
    .catch((err) => {
      return response.status(423).send(err)
    })
}

function unlock(request, response) {
  logger.debug(`UNLOCK request for: ${request.params.name}`);
  return terraformStateRepository.unlockState(request.params.name)
    .then(() => response.status(200).send())
    .catch((err) => response.status(500).send(err))
}

export default {
  getState,
  putState,
  deleteState,
  lock,
  unlock,
};
