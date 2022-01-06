use image::imageops;
use structopt::StructOpt;

#[derive(StructOpt)]
pub struct ImageOptions {
    file_path: String,
    x: u32,
    y: u32,
}

pub fn process_img(image_options: ImageOptions) {
    let ImageOptions { file_path, x, y } = image_options;
    let img = image::open(file_path).unwrap();
    let buffer = img.resize(x, y, imageops::Nearest);
    buffer.save("result.png").unwrap();
}
