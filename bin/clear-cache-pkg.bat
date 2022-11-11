@ECHO OFF

SETLOCAL

rem remove folder package from node_modules
del /F /Q node_modules\%*
