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
# response from get device id.

TS_FILE=/tmp/ipmid-ck-ok

# Get the completion code (1st byte) from get device id response
set -o pipefail
rslt=$(timeout -s 9 20 cmdtool 20 18 1 | sed 's/ .*$//')
rc=$?
if [ $rc -ne 0 ]; then
    rslt=$rc
fi
if [ $rslt -eq 0 ]; then
    date +%s > ${TS_FILE}.tmp
    mv ${TS_FILE}.tmp $TS_FILE
fi
exit $rslt
