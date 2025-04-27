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

# Record runtime boot progress in mailbox register

# Linux runtime uses mailbox register 8
MAILBOX_RUNTM_PROGRESS1=8

LPC=/usr/bin/lpc_cmds
MB_READ="$LPC mailbox read $MAILBOX_RUNTM_PROGRESS1"
MB_WRITE="$LPC mailbox write $MAILBOX_RUNTM_PROGRESS1"

BITDEFS=/usr/lib/boot_progress_bits.sh
. $BITDEFS

LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/lib:/usr/lib:/usr/local/lib:/lib/sfcb
export LD_LIBRARY_PATH

# Check usage
case $# in
0) $MB_READ | sed 's/^.*0x//'
   exit 0
   ;;
1) cmd='set'
   ;;
2) cmd=$2
   ;;
*) echo "Usage: $0 BITNAME"
   exit 255
   ;;
esac

# Convert bit name to bit number
BITNAME=$1
BITNUM=`eval echo \\$$BITNAME`

# If bit number not valid, usage
if [ -z "$BITNUM" -o `echo $BITNAME | grep -c MB_RUNTM` -ne 1 ]; then
    echo "Invalid bitname $BITNAME"
    cat $BITDEFS
    exit 255
fi

# Get the current value of the mailbox register.
REGVAL=`$MB_READ | sed 's/^.*0x/0x0/'`
if [ `echo $REGVAL | grep -c 0x` -ne 1 ]; then
    REGVAL=0x0
fi

if [ "$cmd" = "get" ]; then
    let "rc = $REGVAL & (1<<$BITNUM)"
    if [ $rc -ne 0 ]; then
        rc=1
    fi
    echo $rc
    exit 0
fi

# Bitwise or the new bit with the previous value
let "REGVAL |= 1<<$BITNUM"

REGHEX=$(printf "%x" $REGVAL)
# Write the new value to the mailbox register.
$MB_WRITE $REGHEX >/dev/null 2>&1
exit $?
