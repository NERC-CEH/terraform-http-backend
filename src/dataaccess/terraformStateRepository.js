import logger from 'winston';
import database from '../config/database';

function TerraformState() {
  return database.getModel('TerraformState');
}

function getStateByName(name) {
  return TerraformState().findOne({ name })
    .then((stateRecord) => ({
      name: stateRecord.name,
      state: stateRecord.state ? JSON.parse(stateRecord.state) : null,
    }));
}

function createOrUpdate(name, state) {
  const stateRecord = { name, state: JSON.stringify(state) };
  const query = { name };
  const options = { upsert: true, setDefaultsOnInsert: true };
  return TerraformState().findOneAndUpdate(query, stateRecord, options);
}

function deleteState(name) {
  return TerraformState().remove({ name });
}

function lockState(name) {
  return getStateByName(name)
    .then((state) => {
      if (state) {
        logger.debug(`Existing state found for ${name}`);
        if (state.locked) {
          throw new Error(`State ${name} already locked`);
        }
        state.locked = true;
        return state.save();
      } else {
        logger.debug(`Creating new state for ${name}`);
        return createOrUpdate({ name, state, locked: true });
      }
    })
}

function unlockState(name) {
  return getStateByName(name)
    .then((state) => {
      state.locked = false;
      return state.save();
    })
}

export default {
  getStateByName,
  deleteState,
  createOrUpdate,
  lockState,
  unlockState,
};
