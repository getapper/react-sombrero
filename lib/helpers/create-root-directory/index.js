const fs = require('fs')
const inquirer = require('inquirer')
const { projectInitValidation } = require('../../models/validations')
const joi = require('joi')


const createRootDirectory = async (path, directories) => {
  let answer
  if (!fs.existsSync(path)) {
    directories.create(path)
  } else {
    answer = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'answer',
          message: 'Directory already exists, init project there? (y/n)',
          validate: (input) => {
            return joi.validate(input, projectInitValidation, (err, val) => {
              if (err) {
                return 'Invalid answer'
              } else {
                return true
              }
            })
          }
        }
      ])
    if (answer.answer === 'n') {
      throw 'Directory already exists'
    }
  }

}

module.exports = {
  createRootDirectory
}
