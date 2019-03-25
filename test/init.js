const chai = require('chai')
chai.use(require('chai-fs'))
const expect = chai.expect
const { execSync } = require('child_process')
const path = require('path')

describe('Init',  () => {
  const testDirname = 'test-project'
  const testDirectory = path.join(process.cwd(), 'test')
  const testPath = path.join(testDirectory, testDirname)

  // Deletes created test directory after every test case
  afterEach(() => {
    execSync('rm -r ' + testDirname, {
      cwd: testDirectory
    })
  })

  it('should create new project in specified path',  () => {
     execSync('sombrero init ' + testDirname, {
      cwd: testDirectory,
      stdio: 'inherit'
    })

    expect(testPath).to.be.a.directory()
    expect(testPath).to.have.basename(testDirname)
  })

  it('should not create project in specified path because it already exists',  () => {
    execSync('sombrero init ' + testDirname, {
      cwd: testDirectory,
      stdio: 'inherit'
    })

    expect(testPath).to.be.a.directory()
    expect(testPath).to.have.basename(testDirname)
  })
})
