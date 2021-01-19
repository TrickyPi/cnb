const fs = require("fs-extra");
const chalk = require("chalk");
const inquirer = require("inquirer");
const sharp = require("sharp");

const log = console.log;
const processPath = process.cwd();

const entireFile = async () => {
    const fsCollection = await fs.readdir(processPath);
    return fsCollection.filter((file) =>
        ["jpg", "png", "jpeg"].includes(file.split(".")[1])
    );
};

const gtImage = async (files) => {
    let iframeWidth = 0;
    let iframeHeight = 0;
    const syncOutImageMetadata = files.map((file) => sharp(file).metadata());
    const imagesMetadata = await Promise.all(syncOutImageMetadata).then(
        (res) => {
            return res.map(({ width, height }, index) => {
                iframeWidth = Math.max(iframeWidth, width);
                iframeHeight = Math.max(iframeHeight, height);
                return {
                    width,
                    height,
                    fileName: files[index]
                };
            });
        }
    );
    const { col } = await inquirer.prompt([
        {
            type: "input",
            name: "col",
            message: "entry composited image col length",
            validate: (answer) => {
                if (!/^[1-9][0-9]*$/.test(answer)) {
                    return "please enter number";
                }
                return true;
            }
        }
    ]);
    const bgWidth = iframeWidth * col;
    const bgHight = Math.ceil(files.length / col) * iframeHeight;
    const bgPng = sharp({
        create: {
            width: bgWidth,
            height: bgHight,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    }).png();

    const [compositeImage] = imagesMetadata.reduce(
        ([tmp, left, top], { width, height, fileName }) => {
            let offsetX = Math.floor((iframeWidth - width) / 2);
            let offsetY = Math.floor((iframeHeight - height) / 2);
            tmp.push({
                input: fileName,
                left: left + offsetX,
                top: top + offsetY
            });
            left += iframeWidth;
            if (left >= bgWidth) {
                left = 0;
                top = top + iframeHeight;
            }
            return [tmp, left, top];
        },
        [[], 0, 0]
    );

    const compsitedImageName = `gt${new Date().valueOf()}.png`;

    await bgPng
        .composite(compositeImage)
        .sharpen()
        .withMetadata()
        .webp({ quality: 90 })
        .toFile(compsitedImageName);

    return compsitedImageName;
};

module.exports = async () => {
    const files = await entireFile();
    if (!files.length) return log(chalk.yellow("not exist image"));
    const choices = files.map((file) => ({ name: file }));
    const { composite } = await inquirer.prompt([
        {
            type: "checkbox",
            message: "please check which you want composite",
            name: "composite",
            choices,
            validate: (answer) => {
                if (answer.length < 1)
                    return "you must choose at least one choice";
                return true;
            }
        }
    ]);
    const compsitedImage = await gtImage(composite);
    log(`composited image：${chalk.green(compsitedImage)}`);
};
