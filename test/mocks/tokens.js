module.exports = {
  'userToken': {
    scope: ['user', 'projects'],
    id: '1',
    username: 'chris_testing',
    prefLocale: 'en-US',
    moderator: false,
    staff: false
  },
  'userToken2': {
    scope: ['user', 'projects'],
    id: '2',
    username: 'jon_testing',
    prefLocale: 'en-US',
    moderator: false,
    staff: false
  },
  'moderatorToken': {
    scope: ['user', 'projects'],
    id: '3',
    username: 'andrew_testing',
    prefLocale: 'en-US',
    moderator: true,
    staff: false
  },
  'adminToken': {
    scope: ['user', 'projects'],
    id: '4',
    username: 'kate_testing',
    prefLocale: 'en-US',
    moderator: false,
    staff: true
  }
};
