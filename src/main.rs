use cnb::img::{process_img, ImageOptions};
use cnb::ip::show_ip;
use cnb::relax::get_close_relax_time;
use structopt::StructOpt;

#[derive(StructOpt)]
pub enum Command {
    #[structopt(name = "ip", about = "get your local ip")]
    Ip,
    #[structopt(name = "relax", about = "know the upcoming festival")]
    Relax,
    #[structopt(name = "img", about = "manipulate img")]
    Img(ImageOptions),
}

#[derive(StructOpt)]
struct Cli {
    #[structopt(subcommand)]
    cmd: Command,
}

fn main() {
    let args = Cli::from_args();
    let Cli { cmd } = args;
    match cmd {
        Command::Ip => {
            show_ip();
        }
        Command::Relax => get_close_relax_time(),
        Command::Img(image_options) => process_img(image_options)
    }
}
