@ECHO OFF

:: source   : https://stackoverflow.com/a/21606502/6404439
:: cross-env: https://github.com/kentcdodds/cross-env#cross-env-vs-cross-env-shell
:: usage    : set-dev node index.js
:: cross-env-shell NODE_ENV=development %*

:: source   : https://ss64.com/nt/set.html
:: setx     : only affects new command prompts (not those that are already open like the one that is used to run the batch file. You will only see thse changes if you start a completely new command prompt.
:: setx NODE_ENV development
:: set      : applies to the current command prompt only (this is the new command prompt belonging to the batch file not the one that runs the batch file). These changes are lost when the batch file terminates.
set NODE_ENV=development
