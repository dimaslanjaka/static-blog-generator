@echo off
setlocal enableextensions enabledelayedexpansion
if not exist "tmp" md "tmp"
if not exist "tmp/commits" md "tmp/commits"

git rev-list HEAD --oneline -- src > tmp/commits/src.txt
git rev-list HEAD --oneline -- package.json > tmp/commits/package.txt
endlocal