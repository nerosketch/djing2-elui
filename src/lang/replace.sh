#!/bin/bash -

firststr="$1"
secstr="$2"
echo "Replace '${firststr}' -> '${secstr}'"
find -name "*.vue" -exec sed -i "s/'${firststr}'/'${secstr}'/g" {} \;
