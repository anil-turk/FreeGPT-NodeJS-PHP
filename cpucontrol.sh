#!/bin/bash
# Define the CPU usage limit by percentage below which the script will not kill the processes
cpuLimit=50

# Get CPU usage and round it to an integer
cpuUsage=$(awk -v a="$(grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage}')" 'BEGIN{printf "%.0f\n", a}')

if (( cpuUsage > cpuLimit )); then
    echo "CPU usage is over $cpuLimit%, killing all chromium-browser and Xvfb instances"

    # Kill all instances of chromium-browser
    pkill -f chromium-browser
    if [ $? -eq 0 ]; then
        echo "All chromium-browser instances have been killed."
    else
        echo "Error killing chromium-browser instances."
    fi

    # Kill all instances of Xvfb
    pkill -f Xvfb
    if [ $? -eq 0 ]; then
        echo "All Xvfb instances have been killed."
    else
        echo "Error killing Xvfb instances."
    fi
else
    echo "CPU usage is under $cpuLimit%"
fi