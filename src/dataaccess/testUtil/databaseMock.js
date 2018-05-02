import find from 'lodash/find';

function createDatabaseMock(items, state = {}) {
  let lastInvocation = state;

  return () => ({
    findOne: (query) => {
      lastInvocation.query = query;
      const item = find(items, query);
      return createDatabaseMock(item, lastInvocation)();
    },
    findOneAndUpdate: (query, entity, params) => {
      lastInvocation.query = query;
      lastInvocation.entity = entity;
      lastInvocation.params = params;
      return createDatabaseMock(entity, lastInvocation)();
    },
    remove: (query) => {
      lastInvocation.query = query;
      return createDatabaseMock(items, lastInvocation)();
    },
    exec: () => Promise.resolve(items),
    invocation: () => lastInvocation,
    query: () => lastInvocation.query,
    entity: () => lastInvocation.entity,
    params: () => lastInvocation.params,
    user: () => lastInvocation.user,
    clear: () => { lastInvocation = {}; },
  });
}

export default createDatabaseMock;
