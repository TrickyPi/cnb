const fs = require("fs-extra");
const { program } = require("commander");
const chalk = require("chalk");
const inquirer = require("inquirer");
const sharp = require("sharp");

const log = console.log;
const regExImg = /(.jpeg|.jpg|.png)$/;

const preJudge = async (preImg) => {
    if (!preImg) {
        log(`❌  ${chalk.red("请选择需要处理的图片")}`);
        return false;
    }
    if (!regExImg.test(preImg)) {
        log(`⚠️  ${chalk.red("只能处理jpeg，png，jpg图片")}`);
        return false;
    }
    const isExist = await fs
        .stat(`${process.cwd()}/${preImg}`)
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });

    if (!isExist) {
        log(`❌  ${chalk.red("不存在需要转化的图片")}`);
        return false;
    }

    return true;
};

const transFormat = async (preImg, endImg = "", background = "#ffffff") => {
    if (!(await preJudge(preImg))) return;
    const [endImgSuffix] = endImg.match(regExImg) || [];
    const [preImgSuffix] = preImg.match(regExImg) || [];
    if (!endImgSuffix) {
        return log("不支持转化后的格式");
    }
    if (endImgSuffix === preImgSuffix) {
        return log("文件格式一样，无需转化");
    }
    if (endImgSuffix === "png") {
        await sharp(preImg).png(endImg);
    } else {
        await sharp(preImg).flatten({ background }).toFile(endImg);
    }

    log("🚗  转换成功");
};

const scaleHandler = async (preImg, ...option) => {
    if (!(await preJudge(preImg))) return;
    const [width] = option;
    if (!width) {
        return log(`❌  ${chalk.red("未提供压缩后的宽度")}`);
    }
    const [suffix] = preImg.match(regExImg) || [];
    await sharp(preImg)
        .resize({ width: width * 1 })
        .toFile(
            preImg.replace(regExImg, "scale" + new Date().valueOf() + suffix)
        );
    log(`🚗  ${chalk.green("处理成功！")}`);
};

const toProgressiveHandler = async (preImg, endImg) => {
    if (!(await preJudge(preImg))) return;
    if (!/(.jpg|.jpeg)$/.test(preImg)) {
        return log(`❌  ${chalk.red("不能处理jpeg和jpg以外的图片")}`);
    }
    if (preImg === endImg) {
        return log("转化后的图片不能和之前图片的文件名相同");
    }
    if (!endImg) {
        endImg = preImg.replace(
            /(.jpg|.jpeg)$/,
            `progressive${new Date().valueOf()}.jpeg`
        );
    } else {
        endImg = /(.jpg|.jpeg)$/.test(endImg) ? endImg : endImg + ".jpeg";
    }
    await sharp(preImg)
        .jpeg({
            quality: 80,
            progressive: true
        })
        .toFile(endImg);

    log("🚗  图片转化成功");
};

const ctAction = {
    transform: transFormat,
    scale: scaleHandler,
    toProgressive: toProgressiveHandler
};

module.exports = async ({ args }) => {
    const [action, ...rest] = args;
    if (!Object.keys(ctAction).includes(action)) {
        log(chalk.red("请选择处理方式"));
        return;
    }
    await ctAction[action](...rest);
};
