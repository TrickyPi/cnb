const fs = require("fs-extra")
const chalk =require("chalk")
const inquirer = require("inquirer")
const sharp = require("sharp")

const log = console.log
const processPath = process.cwd()

const entireFile = async () => {
    const fsCollection = await fs.readdir(processPath)
    return fsCollection.filter((file) => ["jpg","png","jpeg"].includes(file.split('.')[1]))
}

const gtImage = async (files) =>{
    const syncOutImageMetadata = files.map(file=>sharp(file).metadata())
    const imagesMetadata = await Promise.all(syncOutImageMetadata)
    let iframeWidth = 0    
    let iframeHeight = 0
    for(const metadata of imagesMetadata){
        const {width,height} = metadata
        iframeWidth = Math.max(iframeWidth,width)
        iframeHeight = Math.max(iframeHeight,height)
    }
    const {col} = await inquirer
        .prompt([
            {
                type:'input',
                name:'col',
                message:'entry composited image col length',
                validate:(answer)=>{
                    if(!/^[1-9][0-9]*$/.test(answer)){
                        return 'please enter number'
                    }
                    return true
                }
            }
        ])
    const bgWidth = iframeWidth*col
    const bgHight = Math.ceil(files.length/col)*iframeHeight
    const bgPng = sharp({
        create:{
            width:bgWidth,
            height:bgHight,
            channels:4,
            background:{r:0,g:0,b:0,alpha:0}
        }
    }).png()

    const [compositeImage] = files.reduce(([tmp,left,top],curFile)=>{
        tmp.push({
            input:curFile,
            left,
            top
        })
        left += iframeWidth
        if(left>=bgWidth){
            left = 0
            top = top+iframeHeight
        }
        return [tmp,left,top]
    },[[],0,0])
    
    const gtImgName = `gt${new Date().valueOf()}.png`

    await bgPng
        .composite(compositeImage)
        .sharpen()
        .withMetadata()
        .webp( { quality: 90 } )
        .toFile(gtImgName)

    return gtImgName
}

module.exports = async() => {
    const files = entireFile()
    const choices = files.map(file=>({name:file}))
    const {composite} = await inquirer
        .prompt([
            {
                type:'checkbox',
                message:"please check which you want composite",
                name:"composite",
                choices,
                validate:(answer)=>{
                    if(answer.length<1)
                        return 'you must choose at least one choice'
                    return true
                }
            },
        ])
    const compsitedImage = await gtImage(composite)
    console.log(`composited image：${chalk.green(compsitedImage)}`)
}