import httpMocks from 'node-mocks-http';
import terraformStateController from './terraformState';
import terraformStateRepository from '../dataaccess/terraformStateRepository';

jest.mock('../dataaccess/terraformStateRepository');

describe('terraform controller', () => {
  describe('get state', () => {
    const request = httpMocks.createRequest({
      method: 'GET',
      params: { name: 'stateName' },
    });

    it('should return the state for the state name in the params', () => {
      const response = httpMocks.createResponse();

      const getStateByName = jest.fn().mockReturnValue(Promise.resolve({ state: { key: 'value' } }));
      terraformStateRepository.getStateByName = getStateByName;

      return terraformStateController.getState(request, response)
        .then(() => {
          expect(getStateByName).toHaveBeenCalledWith('stateName');
          expect(response._getData()).toEqual({ key: 'value' }); // eslint-disable-line no-underscore-dangle
          expect(response.statusCode).toBe(200);
        });
    });

    it('should return null and status code if there is no state', () => {
      const response = httpMocks.createResponse();

      const getStateByName = jest.fn().mockReturnValue(Promise.resolve({ state: null }));
      terraformStateRepository.getStateByName = getStateByName;

      return terraformStateController.getState(request, response)
        .then(() => {
          expect(response._getData()).toBe(''); // eslint-disable-line no-underscore-dangle
          expect(response.statusCode).toBe(200);
        });
    });

    it('should return 500 with error message on error', () => {
      const response = httpMocks.createResponse();

      const getStateByName = jest.fn().mockReturnValue(Promise.reject());
      terraformStateRepository.getStateByName = getStateByName;

      return terraformStateController.getState(request, response)
        .then(() => {
          expect(response._getData()).toEqual({ message: 'Unable to load state for: stateName' }); // eslint-disable-line no-underscore-dangle
          expect(response.statusCode).toBe(500);
        });
    });
  });

  describe('put state', () => {
    const request = httpMocks.createRequest({
      method: 'POST',
      params: { name: 'stateName' },
      body: { key: 'value' },
    });

    it('should store the state as a string using the name in the params', () => {
      const response = httpMocks.createResponse();

      const createOrUpdate = jest.fn().mockReturnValue(Promise.resolve());
      terraformStateRepository.createOrUpdate = createOrUpdate;

      return terraformStateController.putState(request, response)
        .then(() => {
          expect(createOrUpdate).toHaveBeenCalledWith('stateName', { key: 'value' });
          expect(response.statusCode).toBe(201);
        });
    });

    it('should return 500 with error message on error', () => {
      const response = httpMocks.createResponse();

      const createOrUpdate = jest.fn().mockReturnValue(Promise.reject());
      terraformStateRepository.createOrUpdate = createOrUpdate;

      return terraformStateController.putState(request, response)
        .then(() => {
          expect(response.statusCode).toBe(500);
          expect(response._getData()).toEqual({ message: 'Unable to store state for: stateName' }); // eslint-disable-line no-underscore-dangle
        });
    });
  });

  describe('delete state', () => {
    const request = httpMocks.createRequest({
      method: 'DELETE',
      params: { name: 'stateName' },
    });

    it('should delete the state using the name in the params', () => {
      const response = httpMocks.createResponse();

      const deleteState = jest.fn().mockReturnValue(Promise.resolve({ n: 1 }));
      terraformStateRepository.deleteState = deleteState;

      return terraformStateController.deleteState(request, response)
        .then(() => {
          expect(deleteState).toHaveBeenCalledWith('stateName');
          expect(response.statusCode).toBe(204);
        });
    });

    it('should return 404 if nothing was deleted', () => {
      const response = httpMocks.createResponse();

      const deleteState = jest.fn().mockReturnValue(Promise.resolve({ n: 0 }));
      terraformStateRepository.deleteState = deleteState;

      return terraformStateController.deleteState(request, response)
        .then(() => {
          expect(response.statusCode).toBe(404);
        });
    });

    it('should return 500 with a message if there is an error', () => {
      const response = httpMocks.createResponse();

      const deleteState = jest.fn().mockReturnValue(Promise.reject());
      terraformStateRepository.deleteState = deleteState;

      return terraformStateController.deleteState(request, response)
        .then(() => {
          expect(response.statusCode).toBe(500);
          expect(response._getData()).toEqual({ message: 'Unable to delete state for: stateName' }); // eslint-disable-line no-underscore-dangle
        });
    });
  });

  describe('lock stack', () => {
    const request = httpMocks.createRequest({
      method: 'LOCK',
      params: { name: 'stateName' },
    });

    it('should lock the state and return 200 if successful', () => {
      const response = httpMocks.createResponse();

      const lockState = jest.fn().mockReturnValue(Promise.resolve());
      terraformStateRepository.lockState = lockState;

      return terraformStateController.lock(request, response)
        .then(() => {
          expect(response.statusCode).toBe(200);
        });
    });

    it('should return 423 on error locking state', () => {
      const response = httpMocks.createResponse();

      const lockState = jest.fn().mockReturnValue(Promise.reject());
      terraformStateRepository.lockState = lockState;

      return terraformStateController.lock(request, response)
        .then(() => {
          expect(response.statusCode).toBe(423);
        });
    });
  });

  describe('unlock stack', () => {
    const request = httpMocks.createRequest({
      method: 'UNLOCK',
      params: { name: 'stateName' },
    });

    it('should unlock the state and return 200 if successful', () => {
      const response = httpMocks.createResponse();

      const unlockState = jest.fn().mockReturnValue(Promise.resolve());
      terraformStateRepository.unlockState = unlockState;

      return terraformStateController.unlock(request, response)
        .then(() => {
          expect(response.statusCode).toBe(200);
        });
    });

    it('should return 500 on error with message', () => {
      const response = httpMocks.createResponse();

      const unlockState = jest.fn().mockReturnValue(Promise.reject());
      terraformStateRepository.unlockState = unlockState;

      return terraformStateController.unlock(request, response)
        .then(() => {
          expect(response.statusCode).toBe(500);
        });
    });
  });
});
