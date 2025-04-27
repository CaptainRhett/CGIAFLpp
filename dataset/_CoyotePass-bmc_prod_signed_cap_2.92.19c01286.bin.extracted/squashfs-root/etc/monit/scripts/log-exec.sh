#!/bin/sh

# This script is used to capture the stdout/stderr of a daemon executed by
# start-stop-daemon. The start-stop-daemon utility closes stdout and stderr
# preventing access to the output.

usage() {
    echo "Usage: $0 -e executable [-l logfile] [-- exe-arguments]"
    exit 1;
}

OPTS=$(getopt -n "$0" e:l: "$@") || usage
eval set -- "$OPTS"
while true; do
    case "$1" in
    -l)  LOG=$2; shift 2;;
    -e)  EXE=$2; shift 2;;
    --)  shift; break;;
    esac
done

if [ -z "$EXE" ]; then
    usage
fi

if [ ! -e "$EXE" ]; then
    echo "Cannot execute '$EXE'"
    usage
fi

if [ -n "$LOG" ]; then
    if [ ! -w $(dirname $LOG) ]; then
        echo "Cannot create '$LOG'"
        usage
    fi

    # By using '>>' instead of '>', the file is opened with O_APPEND so when
    # truncating the file during a rotate, the size will really go to zero
    # instead of keep growing under the covers as is the case when using '>'
    rm -f $LOG
    touch $LOG
    exec $EXE $* >>$LOG 2>&1
else
    exec $EXE $*
fi
