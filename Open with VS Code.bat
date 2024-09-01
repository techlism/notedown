@echo off
setlocal

REM Get the current directory
set "current_dir=%cd%"

REM Open the current directory in Visual Studio Code
code "%current_dir%"

REM Exit the script
exit /b 0
