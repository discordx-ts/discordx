#!/usr/bin/env sh

set -e

cd src/.vuepress/dist
npm run build


git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:OwenCalvin/discord.ts.git master:gh-pages

cd ..
rm -rf dist
