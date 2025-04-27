#!/bin/sh


# This script will use inotifywait to mointor target directory for close write changes.
# And use rsync to synchronize target directory and backup directory.
   
#sync first time when service is started
cp $2/SOL*.log* $1/

inotifywait -mr -e close_write -e modify $1 | while read date time dir file; do
     rsync -razq $1 $2

done
