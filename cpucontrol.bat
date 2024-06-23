@echo off
REM Define the CPU usage limit by percentage below which the script will not kill the processes
set "cpuLimit=50"
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running with administrator privileges
) else (
    echo Please run the script as an administrator
    pause
    exit /b
)

for /f "skip=1" %%p in ('wmic cpu get loadpercentage') do set /a "cpuUsage=%%p"
if %cpuUsage% gtr %cpuLimit% (
    echo CPU usage is over %cpuLimit%%% , killing all chromium-browser and Xvfb instances
    taskkill /IM chrome.exe /F /T
) else (
    echo CPU usage is under %cpuLimit%%%
)