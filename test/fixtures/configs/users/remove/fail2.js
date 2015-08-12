// handles error if the delete op fails
module.exports = {
  url: '/users/3',
  method: 'delete',
  headers: {
    authorization: 'token moderatorToken'
  }
};
