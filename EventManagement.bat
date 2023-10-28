@echo off
cd /d ../eventManagement
start http://localhost:3000/
nodemon index.js
pause
pause