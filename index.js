#!/usr/bin/env node

const input = require('./lib/input')

process.GLOBAL = {}
let env = process.env.NODE_ENV || 'production'
if(env === 'test') {
  console.log = function() {}
}

input()
