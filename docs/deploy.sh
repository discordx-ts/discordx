#!/usr/bin/env sh

set -e

npm run build

cd src/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:OwenCalvin/discord.ts.git master:gh-pages

cd ..
rm -rf dist
