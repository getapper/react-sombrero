const chai = require('chai')
chai.use(require('chai-fs'))
const expect = chai.expect
const assert = chai.assert
const {execSync} = require('child_process')
const path = require('path')

describe('Init', () => {
  const testDirname = 'test-project'
  const testDirectory = path.join(process.cwd(), 'test')
  const testPath = path.join(testDirectory, testDirname)

  // Deletes created test directory after every test case
  afterEach(() => {
    execSync('rm -r ' + testDirname, {
      cwd: testDirectory
    })
  })

  it('should create new project in specified path without installing node_modules', () => {
    execSync('sombrero init ' + testDirname + ' -n', {
      cwd: testDirectory,
      stdio: 'inherit'
    })

    expect(testPath).to.be.a.directory()
    expect(testPath).to.have.basename(testDirname)
  })

  it('should not create project in specified path because it already exists', () => {
    let result

    execSync('sombrero init ' + testDirname + ' -n', {
      cwd: testDirectory,
      stdio: 'inherit'
    })

    try {
      execSync('sombrero init ' + testDirname + ' -n', {
        cwd: testDirectory,
        stdio: 'inherit'
      })
    } catch (err) {
      result = err
    }
    assert(result.status === 1)
  })
})
