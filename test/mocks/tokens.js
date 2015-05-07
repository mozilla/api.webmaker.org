module.exports = {
  'userToken': {
    scope: ['user', 'projects'],
    user_id: 1,
    moderator: false,
    staff: false
  },
  'userToken2': {
    scope: ['user', 'projects'],
    user_id: 12,
    moderator: false,
    staff: false
  },
  'moderatorToken': {
    scope: ['user', 'projects'],
    user_id: 2,
    moderator: true,
    staff: false
  },
  'adminToken': {
    scope: ['user', 'projects'],
    user_id: 2,
    moderator: false,
    staff: true
  }
};
