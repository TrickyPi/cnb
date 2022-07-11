#!/usr/bin/env sh

set -e

if ! command -v unzip >/dev/null; then
	echo "Error: unzip is required to install cnb." 1>&2
	exit 1
fi

if [ "$OS" = "Windows_NT" ]; then
	echo "Error: cnb currently only works in macOS" 1>&2
	exit 1
else
	case $(uname -sm) in
	"Darwin x86_64") target="x86_64-apple-darwin"
	;;
	"Darwin arm64") target="aarch64-apple-darwin"
	;;
	*)
	echo "Error: cnb currently only works in macOS" 1>&2
	exit 1
	;;
	esac
fi

cnb_uri="https://github.com/TrickyPi/cnb/releases/latest/download/cnb-${target}.zip"

cnb_install="$HOME/.cnb"
bin_dir="$cnb_install/bin"
exe="$bin_dir/cnb"

if [ ! -d "$bin_dir" ]; then
    mkdir -p "$bin_dir"
fi

curl --fail --location --progress-bar --output "$exe.zip" "$cnb_uri"
tar xfC "$exe.zip" "$bin_dir"
chmod +x "$exe"
rm "$exe.zip"

echo "cnb was installed successfully to $exe"

if command -v cnb >/dev/null; then
	echo "Run 'cnb --help' to get started"
else
	case $SHELL in
	/bin/zsh) shell_profile=".zshrc" ;;
	*) shell_profile=".bashrc" ;;
	esac
	echo "Manually add the following stuff to your \$HOME/$shell_profile (or similar)"
	echo "  export PATH=\"$bin_dir:\$PATH\""
fi