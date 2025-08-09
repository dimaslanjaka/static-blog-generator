@echo off
setlocal

:: Check if file argument is provided
if "%~1"=="" (
    echo [X] Error: No file specified
    echo Usage: git-diff filename
    exit /b 1
)

set "FILE=%~1"
set "OUTPUT=.cache\git\diff.txt"

:: Create output directory if it doesn't exist
if not exist .cache\git (
    mkdir .cache\git
)

:: Save the staged diff to file
git --no-pager diff --cached "%FILE%" > "%OUTPUT%"

echo [✓] Staged diff of "%FILE%" saved to "%OUTPUT%"
endlocal
