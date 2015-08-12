// can handle errors while rolling back the transaction.
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
          title: 'handles error if rollback fails'
        }
      }
    ]
  }
};
