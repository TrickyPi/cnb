use chrono::prelude::*;
use std::collections::HashMap;
use std::str;

fn inital_festival_map() -> HashMap<&'static str, &'static str> {
    HashMap::from([
        ("Yuandan", "2023-01-01"),
        ("Chunjie", "2022-02-01"),
        ("Qingmin", "2022-04-05"),
        ("Wuyi", "2022-05-01"),
        ("Duanwu", "2022-06-03"),
        ("Zhongqiu", "2022-09-10"),
        ("Guoqing", "2022-10-1"),
    ])
}

pub fn get_close_relax_time() {
    let now = Local::now();
    let festival = inital_festival_map();
    let mut closed_festival = "";
    let mut festival_time = "";
    let mut min_max = i64::MAX;
    for (key, value) in festival {
        let mut temp = value.to_string();
        temp.push_str(" 00:00:00");
        let time = match Local.datetime_from_str(&temp, "%Y-%m-%d %H:%M:%S") {
            Ok(t) => t,
            Err(e) => {
                panic!("{}", e);
            }
        };
        if time < now {
            continue;
        }
        let diff = time.timestamp() - now.timestamp();
        if diff > min_max {
            continue;
        }
        min_max = diff;
        closed_festival = key;
        festival_time = value;
    }
    println!(
        "the closed relax time is {}, time is {}",
        closed_festival, festival_time
    );
}
