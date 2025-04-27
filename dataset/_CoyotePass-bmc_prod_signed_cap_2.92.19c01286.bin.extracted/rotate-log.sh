#!/bin/sh

# Copyright 2015 Intel Corporation.
#
# The source code, information and material ("Material") contained herein is
# owned by Intel Corporation or its suppliers or licensors, and title to such
# Material remains with Intel Corporation or its suppliers or licensors. The
# Material contains proprietary information of Intel or its suppliers and
# licensors. The Material is protected by worldwide copyright laws and treaty
# provisions. No part of the Material may be used, copied, reproduced,
# modified, published, uploaded, posted, transmitted, distributed or disclosed
# in any way without Intel's prior express written permission. No license under
# any patent, copyright or other intellectual property rights in the Material
# is granted to or conferred upon you, either expressly, by implication,
# inducement, estoppel or otherwise. Any license under such intellectual
# property rights must be express and approved by Intel in writing.

# Rotate single log file

MAXLOGS=3

usage() {
    echo "Usage: $0 [-n numlogs] log-file-path"
    exit 1;
}

OPTS=$(getopt -n "$0" n: "$@") || usage
eval set -- "$OPTS"
while true; do
    case "$1" in
    -n)  MAXLOGS=$2; shift 2;;
    --)  shift; break;;
    esac
done

# Check usage
if [ $# -ne 1 ]; then
    usage
fi

logpath=$1

if [ ! -f $logpath ]; then
    echo "'$logpath' does not exist"
    exit 2
fi

rm -f ${logpath}.${MAXLOGS}*

num=$((MAXLOGS-1))
while [ $num -gt 0 ]; do
    rotate=$((num+1))
    [ -f ${logpath}.${num}.gz ] && mv ${logpath}.${num}.gz ${logpath}.${rotate}.gz
    num=$((num - 1))
done

gzip -c $logpath > $logpath.1.gz
echo "`date`: TRUNCATED" > $logpath
