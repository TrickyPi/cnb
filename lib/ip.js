const os = require("os");
const chalk = require("chalk");
const log = console.log;

module.exports = function () {
    const [ipv6, ipv4] = os.networkInterfaces().en0;
    const text = `
        your ipv4 address is: ${chalk.green(ipv4?.address)} \n
        your ipv6 address is: ${chalk.green(ipv6?.address)}
        `;
    log(text);
};
