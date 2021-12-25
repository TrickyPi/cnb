use local_ip_address::local_ip;

pub fn show_ip() {
    let my_local_ip = local_ip().unwrap();
    println!("This is my local IP address: {:?}", my_local_ip);
}
