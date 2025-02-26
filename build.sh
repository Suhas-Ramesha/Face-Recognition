#!/usr/bin/env bash
# exit on error
set -o errexit

# Install system dependencies
apt-get update && apt-get install -y cmake build-essential pkg-config libx11-dev libatlas-base-dev libgtk-3-dev libboost-python-dev

# Upgrade pip
python -m pip install --upgrade pip

# Install Python packages
pip install -r requirements.txt 