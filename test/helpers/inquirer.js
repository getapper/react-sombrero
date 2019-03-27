let spawn = require('child_process').spawn
let concat = require('concat-stream')

module.exports = (args, commands, cwd, timeout) => {
  if (!timeout) {
    timeout = 200
  }

  let proc = spawn('node', args, {stdio: [null, null, null], cwd: cwd})
  proc.stdin.setEncoding('utf-8')

  let loop = (commands) => {
    if (commands.length > 0) {
      setTimeout(() => {
        try {
          proc.stdin.write(commands[0])
        } catch (err) {
        }
        loop(commands.slice(1))
      }, timeout)
    } else {
      proc.stdin.end()
    }
  }

  loop(commands)

  return new Promise((resolve) => {
    proc.stdout.pipe(concat((result) => {
      resolve(result.toString())
    }))
  })
}

module.exports.ENTER = '\x0D'
