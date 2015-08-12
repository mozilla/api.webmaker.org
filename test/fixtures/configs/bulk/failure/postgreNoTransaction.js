// Handles failure when attempting to create a connection to PG for the transaction
module.exports = {
  url: '/users/1/bulk',
  method: 'post',
  headers: {
    authorization: 'token userToken'
  },
  payload: {
    actions: [
      {
        type: 'projects',
        method: 'create',
        data: {
          title: 'fails when creating a transaction client'
        }
      }
    ]
  }
};
