use std::fs::File;
use std::io::{prelude::*, BufReader};
use std::path::Path;
use structopt::StructOpt;

#[derive(StructOpt)]
pub struct HostOptions {
    #[structopt(short, long, help = "enable host config")]
    open: bool,
    #[structopt(short, long, help = "disable host config")]
    disable: bool,
    #[structopt(
        short,
        long,
        help = "processing for all config, will skip default config by default"
    )]
    all: bool,
}

const HOST_FILE_LOCATION: &str = "/etc/hosts";
const OS_HOST: [&str; 2] = ["localhost", "broadcasthost"];

fn lines_from_file(filename: impl AsRef<Path>) -> Vec<String> {
    let file = File::open(filename).expect("no such file");
    let buf = BufReader::new(file);
    buf.lines()
        .map(|l| l.expect("Could not parse line"))
        .collect()
}

fn remove_config_prefix(char: char, text: String) -> String {
    let mut idx: usize = 0;
    let mut is_comment = true;
    let len = text.len();
    for (i, c) in text.chars().enumerate() {
        idx = i;
        if c != char {
            if c.is_numeric() || c == ':' {
                is_comment = false;
            }
            break;
        }
    }
    if len == idx + 1 {
        return String::new();
    }
    if is_comment {
        return text;
    }
    return text[idx..].to_string();
}

pub fn host_change(host_options: HostOptions) {
    let HostOptions { open, disable, all } = host_options;
    let lines = lines_from_file(HOST_FILE_LOCATION);
    let mut output_config: String = String::new();
    if disable {
        for mut line in lines {
            if !line.starts_with('#') {
                let mut line_split = line.split_whitespace();
                line_split.next();
                let host = line_split.next();
                if let Some(host_value) = host {
                    if !OS_HOST.contains(&host_value) || all {
                        line.insert_str(0, "#")
                    }
                }
            }
            line.push_str("\n");
            output_config.push_str(&line);
        }
    } else if open {
        for line in lines {
            let mut config = remove_config_prefix('#', line).trim().to_string();
            config.push_str("\n");
            output_config.push_str(&config);
        }
    }
    let mut f = File::create(HOST_FILE_LOCATION).expect("");
    f.write_all(output_config.as_bytes()).expect("msg");
}
