import terraformStateRepository from './terraformStateRepository';
import database from '../config/database';
import databaseMock from './testUtil/databaseMock';

jest.mock('../config/database');

const testStates = [
  {
    name: 'State1',
    state: '{\"key\":\"value1\"}', // eslint-disable-line no-useless-escape
    locked: false,
  },
  {
    name: 'State2',
    state: '{\"key\":\"value2\"}', // eslint-disable-line no-useless-escape
    locked: true,
  },
];

const mockDatabase = databaseMock(testStates);
database.getModel = mockDatabase;

terraformStateRepository.database = mockDatabase;

describe('terraformStateRepository', () => {
  beforeEach(() => {
    mockDatabase().clear();
  });

  describe('getStateByName', () => {
    it('should return deserialised JSON', () =>
      terraformStateRepository.getStateByName('State1').then((stateRecord) => {
        expect(mockDatabase().query()).toEqual({ name: 'State1' });
        expect(stateRecord).toEqual({ name: 'State1', state: { key: 'value1' }, locked: false });
      }));
  });

  describe('createOrupdate', () => {
    it('should stringify JSON', () =>
      terraformStateRepository.createOrUpdate('State1', { key: 'value1' }).then(() => {
        expect(mockDatabase().query()).toEqual({ name: 'State1' });
        expect(mockDatabase().entity()).toEqual({ name: 'State1', state: '{\"key\":\"value1\"}' }); // eslint-disable-line no-useless-escape
        expect(mockDatabase().params()).toEqual({ upsert: true, setDefaultsOnInsert: true });
      }));
  });

  describe('deleteState', () => {
    it('should remove the entity', () =>
      terraformStateRepository.deleteState('State1').then(() => {
        expect(mockDatabase().query()).toEqual({ name: 'State1' });
      }));
  });

  describe('lockState', () => {
    it('should set the state to locked if not already locked', () =>
      terraformStateRepository.lockState('State1').then(() => {
        expect(mockDatabase().query()).toEqual({ name: 'State1' });
        expect(mockDatabase().entity()).toEqual({ name: 'State1', state: '{\"key\":\"value1\"}', locked: true }); // eslint-disable-line no-useless-escape
      }));

    it('should return an error id already locked', () =>
      expect(terraformStateRepository.lockState('State2'))
        .rejects.toThrow('State State2 already locked'));

    it('should create and lock state if no state exists', () =>
      terraformStateRepository.lockState('unknown').then(() => {
        expect(mockDatabase().query()).toEqual({ name: 'unknown' });
        expect(mockDatabase().entity()).toEqual({ name: 'unknown', state: undefined, locked: true }); // eslint-disable-line no-useless-escape
      }));
  });

  describe('unlockState', () => {
    it('should set the state to unlocked', () =>
      terraformStateRepository.unlockState('State2').then(() => {
        expect(mockDatabase().query()).toEqual({ name: 'State2' });
        expect(mockDatabase().entity()).toEqual({ locked: false }); // eslint-disable-line no-useless-escape
      }));

    it('should return undefined if state does not exist', () =>
      expect(terraformStateRepository.lockState('State2'))
        .rejects.toThrow('State State2 already locked'));
  });
});
