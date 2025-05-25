#!/bin/bash
set -euo pipefail

echo "Installing bundler 2.1.4"
gem install bundler -v 2.1.4

bundle _2.1.4_ install
