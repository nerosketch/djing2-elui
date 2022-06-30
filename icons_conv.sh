#!/bin/bash

# imagemagick required

if [ $# -eq 0 ]; then
    echo 'Source images path required'
    exit
fi

orig="$1"

convert -resize 192X192 "$orig" "android-chrome-192x192.png"
convert -resize 512X512 "$orig" "android-chrome-512x512.png"
convert -resize 512X512 "$orig" "android-chrome-512x512.png"
cp android-chrome-192x192.png android-chrome-maskable-192x192.png
cp android-chrome-512x512.png android-chrome-maskable-512x512.png
convert -resize 60X60 "$orig" "apple-touch-icon-60x60.png"
convert -resize 76X76 "$orig" "apple-touch-icon-76x76.png"
convert -resize 120X120 "$orig" "apple-touch-icon-120x120.png"
convert -resize 152X152 "$orig" "apple-touch-icon-152x152.png"
convert -resize 180X180 "$orig" "apple-touch-icon-180x180.png"
cp apple-touch-icon-180x180.png apple-touch-icon.png
convert -resize 16X16 "$orig" "favicon-16x16.png"
convert -resize 32X32 "$orig" "favicon-32x32.png"
convert -resize 144X144 "$orig" "msapplication-icon-144x144.png"
convert -resize 150X150 "$orig" "mstile-150x150.png"

rm -v "$orig"
