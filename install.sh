#!/bin/bash
set -e
echo "Installing dependencies..."
cd backend
pip install --upgrade pip
pip install -r requirements.txt
echo "Dependencies installed successfully!"
