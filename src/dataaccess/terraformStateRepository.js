import logger from 'winston';
import database from '../config/database';

function TerraformState() {
  return database.getModel('TerraformState');
}

function getStateByName(name) {
  return TerraformState().findOne({ name });
}

function createOrUpdate(stateRecord) {
  const query = { name: stateRecord.name };
  const options = { upsert: true, setDefaultsOnInsert: true };
  console.log(stateRecord);
  return TerraformState().findOneAndUpdate(query, stateRecord, options);
}

function deleteState(name) {
  return TerraformState().remove({ name });
}

function lockState(name) {
  return getStateByName(name)
    .then((state) => {
      if (state) {
        logger.debug(`Existing state ${state}`);
        if (state.locked) {
          throw new Error(`State ${name} already locked`);
        }
        state.locked = true;
        return state.save();
      } else {
        logger.debug(`Creating new state`);
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
