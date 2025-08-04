@echo off
echo "removing dist"
rm -rf dist
echo "removing tmp"
rm -rf tmp
echo "removing src/public"
rm -rf src/public
echo "building"
npm run build
echo "build finished"