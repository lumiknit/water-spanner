#!/bin/sh

# Build for chrome
rm -rf ./dist ./ext-chrome.zip
TARGET=chrome pnpm build
zip -r ./ext-chrome.zip ./dist

# Build for firefox
rm -rf ./dist ./ext-firefox.zip
TARGET=firefox pnpm build
zip -r ./ext-firefox.zip ./dist
