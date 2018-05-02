import logger from 'winston';
import database from '../config/database';

function TerraformState() {
  return database.getModel('TerraformState');
}

function getStateByName(name) {
  return TerraformState().findOne({ name }).exec()
    .then((stateRecord) => {
      if (stateRecord) {
        return {
          name: stateRecord.name,
          state: stateRecord.state ? JSON.parse(stateRecord.state) : null,
          locked: stateRecord.locked,
        };
      }
      return undefined;
    });
}

function createOrUpdate(name, state, locked) {
  const stateRecord = { name, state: state ? JSON.stringify(state) : '' };
  if (locked) {
    stateRecord.locked = locked;
  }
  const query = { name };
  const options = { upsert: true, setDefaultsOnInsert: true };
  return TerraformState().findOneAndUpdate(query, stateRecord, options).exec();
}

function deleteState(name) {
  return TerraformState().remove({ name }).exec();
}

function lockState(name) {
  return getStateByName(name)
    .then((stateRecord) => {
      if (stateRecord) {
        logger.debug(`Existing state found for ${name}`);
        if (stateRecord.locked) {
          return Promise.reject(new Error(`State ${name} already locked`));
        }
        return createOrUpdate(name, stateRecord.state, true);
      }

      logger.debug(`Creating new state for ${name}`);
      return createOrUpdate(name, undefined, true);
    });
}

function unlockState(name) {
  return getStateByName(name)
    .then((state) => {
      if (state) {
        return TerraformState().findOneAndUpdate({ name }, { locked: false });
      }
      return undefined;
    });
}

export default {
  getStateByName,
  deleteState,
  createOrUpdate,
  lockState,
  unlockState,
};
