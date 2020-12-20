#!/usr/bin/env node

const {program} = require('commander')
const {version,description} = require('../package.json')
const ip = require('../lib/ip.js')
const gt = require('../lib/gt.js')

program
    .version(version)
    .description(description)

// appear you ip
program
    .command('ip')
    .description('appear your ip')
    .action(ip)

//composite image to sprite
program
    .command('gt')
    .description('composite image to sprite')
    .action(gt)

program.parse(process.argv)