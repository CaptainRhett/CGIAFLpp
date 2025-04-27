#!/bin/sh

# Copyright 2015 Intel Corporation.
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

# This may be more complicated in the future. For now just check for a good
# ipmid-ck checker result in the last 60 seconds.

uptime=$(echo $MONIT_DESCRIPTION | sed 's/^.*uptime is \(.*\) seconds.*$/\1/')

if [ -n "$uptime" -a $uptime -ge 90 -a $uptime -lt 120 ];then
    TS_FILE=/tmp/ipmid-ck-ok

    now=$(date +%s)
    if [ -f $TS_FILE ]; then
        last_ok=$(cat $TS_FILE)
        case "${last_ok}" in
            [0-9]*)
                if [ $(($now - $last_ok)) -lt 65 ]; then
                    /usr/bin/boot_progress.sh MB_RUNTM_STABLE_APP
                    rc=0
                else
                    rc=1
                fi
                ;;
            *)
                rc=255
                ;;
        esac
    fi
else
    rc=0
fi
exit $rc
