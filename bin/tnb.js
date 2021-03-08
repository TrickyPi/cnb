#!/usr/bin/env node

const { program } = require("commander");
const { version, description } = require("../package.json");

program
    .version(version)
    .description(description);

// appear you ip
program
    .command("ip")
    .description("appear your ip")
    .action(() => {
        require("../lib/ip.js")()
    });

//composite image to sprite
program
    .command("gt")
    .description("composite image to a sprite image")
    .action(() => {
        require("../lib/gt.js")()
    });

//convert image
program
    .command("ct")
    .description(
        "convert image to a progressive image,scale image,include jpg jpeg png"
    )
    .action((command) => {
        require("../lib/ct.js")(command)
    });

program.parse(process.argv);
