@ECHO OFF

rem sample https://github.com/npm/cli/blob/latest/bin/npx.cmd

SETLOCAL

SET "NODE_EXE=%~dp0\node.exe"
IF NOT EXIST "%NODE_EXE%" (
  SET "NODE_EXE=node"
)

SET "SBG_CLI=%~dp0\..\scripts\clean-cache.js"

"%NODE_EXE%" "%SBG_CLI%" %*
