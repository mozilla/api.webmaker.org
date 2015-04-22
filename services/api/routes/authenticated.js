var Joi = require('joi');

module.exports = [
  {
    path: '/api/skittles',
    method: 'POST',
    handler: require('../handlers/skittles'),
    config: {
      description: 'create a skittle',
      validate: {
        payload: {
          color: Joi.string().required()
        }
      }
    }
  }
];
