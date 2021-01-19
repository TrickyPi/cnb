#!/usr/bin/env node

const { program } = require("commander");
const { version, description } = require("../package.json");
const ip = require("../lib/ip.js");
const gt = require("../lib/gt.js");
const ct = require("../lib/ct.js");

program.version(version).description(description);

// appear you ip
program.command("ip").description("appear your ip").action(ip);

//composite image to sprite
program
    .command("gt")
    .description("composite image to a sprite image")
    .action(gt);

//convert image
program
    .command("ct")
    .description(
        "convert image to a progressive image,scale image,include jpg jpeg png"
    )
    .action(ct);

program.parse(process.argv);
