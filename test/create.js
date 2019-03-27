const chai = require('chai')
chai.use(require('chai-fs'))
const expect = chai.expect
const assert = chai.assert
const {execSync} = require('child_process')
const path = require('path')
const run = require('./helpers/inquirer')
const { ENTER } = require('./helpers/inquirer')

describe('Create', () => {
  const testDirname = 'test-project'
  const testDirectory = path.join(process.cwd(), 'test')
  const testPath = path.join(testDirectory, testDirname)
  const cliPath = path.join(process.cwd(), 'index.js')

  // Deletes created test directory after every test case
  afterEach(() => {
    execSync('rm -r ' + testDirname, {
      cwd: testDirectory
    })
  })

  it('should create a new scene named test-scene', async () => {
    let sceneNumber = '0'
    let newSceneName = 'test-scene'

    execSync('sombrero init ' + testDirname + ' -n', {
      cwd: testDirectory,
      stdio: 'inherit'
    })

    await run([cliPath, 'create', 'scene'], [sceneNumber, ENTER, newSceneName, ENTER], testPath)

    expect(path.join(testPath, `scenes/${newSceneName}`)).to.be.a.directory()
  })

  it('should not create a new component named test-component in root scenes directory', async () => {
    let sceneNumber = '0'
    let newComponentName = 'test-component'

    execSync('sombrero init ' + testDirname + ' -n', {
      cwd: testDirectory,
      stdio: 'inherit'
    })

    await run([cliPath, 'create', 'component'], [sceneNumber, ENTER, newComponentName, ENTER], testPath)

    expect(path.join(testPath, `scenes/${newComponentName}`)).to.not.be.a.path()
  })

  it('should create a new scene named test-scene and a new component children of test-scene', async () => {
    let sceneNumber = '0'
    let newSceneName = 'test-scene'
    let newComponentName = 'test-component'

    execSync('sombrero init ' + testDirname + ' -n', {
      cwd: testDirectory,
      stdio: 'inherit'
    })

    await run([cliPath, 'create', 'scene'], [sceneNumber, ENTER, newSceneName, ENTER], testPath)

    expect(path.join(testPath, `scenes/${newSceneName}`)).to.be.a.directory()

    await run([cliPath, 'create', 'component'], [sceneNumber, ENTER, newComponentName, ENTER], testPath)

    expect(path.join(testPath, `scenes/${newSceneName}/components/${newComponentName}`)).to.be.a.directory()
  })
})
