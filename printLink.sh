#!/bin/bash

cd "$1" || exit

for file in *.js; do
  echo -n "$file"
  head -n 1 "$file"
done
