const chai = require('chai')
chai.use(require('chai-fs'))
const expect = chai.expect
const assert = chai.assert
const {execSync} = require('child_process')
const path = require('path')
const fs = require('fs')
const run = require('./helpers/inquirer')


describe('Init', () => {
  const testDirname = 'test-project'
  const testDirectory = path.join(process.cwd(), 'test')
  const testPath = path.join(testDirectory, testDirname)
  const cliPath = path.join(process.cwd(), 'index.js')

  // Deletes created test directory after every test case
  afterEach(() => {
    if (fs.existsSync(testPath)) {
      execSync('rm -r ' + testDirname, {
        cwd: testDirectory
      })
    }
  })

  it('should create new project in specified path without installing node_modules', async () => {
    await run([cliPath, 'init', testDirname, '-n'], [], testDirectory)

    expect(testPath).to.be.a.directory()
    expect(testPath).to.have.basename(testDirname)
  })

  it('should not create project in specified path because it already exists', async () => {
    let result

    await run([cliPath, 'init', testDirname, '-n'], [], testDirectory)

    result = await run([cliPath, 'init', testDirname, '-n'], [], testDirectory)

    assert(result !== null, 'Directory created even if it already existed')

  })
})
