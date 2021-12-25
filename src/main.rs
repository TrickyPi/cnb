use structopt::StructOpt;
use tnb_cli::ip::show_ip;
use tnb_cli::relax::get_close_relax_time;

#[derive(StructOpt)]
enum Command {
    Ip,
    Relax,
}

#[derive(StructOpt)]
struct Cli {
    #[structopt(subcommand)]
    cmd: Command,
}

fn main() {
    let args = Cli::from_args();
    let cmd = args.cmd;
    match cmd {
        Command::Ip => {
            show_ip();
        }
        Command::Relax => {
            get_close_relax_time()
        }
    }
}
