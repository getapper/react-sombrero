const joi = require('joi')

const sceneNumberValidation = joi.number()

const sceneNameValidation = joi.string().regex(/^[a-zA-Z0-9-_]*$/)

const projectInitValidation = joi.any().valid('y', 'n')

module.exports = {
  sceneNumberValidation,
  sceneNameValidation,
  projectInitValidation
}
