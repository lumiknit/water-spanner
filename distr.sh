#!/bin/sh

# Build for chrome
rm -rf ./dist ./ext-chrome.zip
TARGET=chrome pnpm build
web-ext build -s ./dist -a . -n ext-chrome.zip

# Build for firefox
rm -rf ./dist ./ext-firefox.zip
TARGET=firefox pnpm build
web-ext build -s ./dist -a . -n ext-firefox.zip
