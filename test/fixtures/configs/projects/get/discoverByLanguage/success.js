exports.default = {
  url: '/discover/en-US',
  method: 'get'
};

exports.changeLanguageENGB = {
  url: '/discover/en-GB',
  method: 'get'
};

exports.changeLanguageBNBD = {
  url: '/discover/bn-BD',
  method: 'get'
};

exports.changeLanguageIDID = {
  url: '/discover/id-ID',
  method: 'get'
};

exports.changeLanguageLolRofl = {
  url: '/discover/lol-rofl',
  method: 'get'
};

exports.changeCount = {
  url: '/discover/en-US?count=3',
  method: 'get'
};

exports.changePage = {
  url: '/discover/en-US?count=3&page=2',
  method: 'get'
};

exports.returnsNoneWhenPageTooHigh = {
  url: '/discover/en-US?count=50&page=2',
  method: 'get'
};
