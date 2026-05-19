@echo off
setlocal

REM Get the directory of this script
set "SCRIPT_DIR=%~dp0"

REM Remove trailing backslash if needed
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

REM Assign arguments
set "ROLLUP_INPUT=%~1"
set "ROLLUP_OUTPUT=%~2"

@REM echo Running Rollup with input: %ROLLUP_INPUT% and output: %ROLLUP_OUTPUT%
@REM echo Current directory: %CD%
@REM echo Script directory: %SCRIPT_DIR%

node "%SCRIPT_DIR%\run-ts.cjs" "%ROLLUP_INPUT%" "%ROLLUP_OUTPUT%"
