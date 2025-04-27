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

# Monitor for web activity. If discovered, lock down OEM EWS.

LOG_TAG=monitor-oemws-lock.sh
PORTS_FILE=/nv/port.conf
OEM_DIR=/pnv/oem-region
LOCK_FILE=$OEM_DIR/region-web.crt

# Print number of sockets using the https or http port not originating from
# an external network (not localhost)
web_in_use() {
    local port=$(sed -n 's/HTTP Port=//p' $PORTS_FILE)
    local ssl_port=$(sed -n 's/HTTPS Port=//p' $PORTS_FILE)
    case "$ssl_port" in
      ''|*[!0-9]*) ssl_port=443;; # Default to 443 if cannot get from config
      *);;
    esac
    case "$port" in
      ''|*[!0-9]*) port=80;;     # Default to 80 if cannot get from config
      *);;
    esac
    # matching lines like this:
    # tcp     0      0 2002:4:8::180:443     2002:4:8::1:40556       ESTABLISHED
    # tcp     0      0 1.1.1.180:80         2.3.4.56:40556          ESTABLISHED
    # but not like this:
    # Active Internet connections (w/o servers)
    # Proto Recv-Q Send-Q Local Address      Foreign Address         State
    # tcp     0      0 ::1:443               ::1:48938               ESTABLISHED
    # tcp     0      0 ::ffff:127.0.0.1:443  ::ffff:127.0.0.1:55362  ESTABLISHED
    #
    # awk script is as follows:
    # set count to 0
    # match lines that contain the port at the end of field 4 (Local Address)
    #   AND don't match localhost addresses (ipv4 and ipv6) in field 4
    local ports="$ssl_port|$port"
    netstat -tn |
        awk 'BEGIN { c=0; }
             $4 ~ /:('$ports')$/ &&                                 \
                     $4 !~ /^((::ffff:)?127.0.0.1|::1):('$ports')$/ \
                 { c++; }
             END { print c; }'
}

if [ -f $LOCK_FILE ]; then
    logger -t "$LOG_TAG" -p user.info "OEMWS Region locked previously."
    exit 0;
fi

# Loop indefinately until web access locks it or the region is loaded with IPMI.
while [ ! -f $LOCK_FILE ]; do
    if [ $(web_in_use) -ne 0 ]; then
        logger -t "$LOG_TAG" -p user.info "OEMWS Region locked by web access!"
        netstat -tn | awk '$4 !~ /(127.0.0.1|::1):[0-9]+$' |
            logger -t $LOG_TAG -p user.info

        # Lock OEM Region UUID
        # NETFN_INTEL_OEM_APP = 0x20 (shift 8)
        # CMD_OEM_REGION_CMD = 0x11
        # FWUPD_OEM_REGION_LOCK_REGION = 0x3
        # regionid IMAGE_TYPE_OEM_WEB 0x5357454f (4f 45 57 53)
        # keyword 'OEMLOCK' (4f 45 4D 4c 4f 43 4b)
        cmdtool 20 20 11 3 4f 45 57 53 4f 45 4D 4c 4f 43 4b
    fi
    # sockets timeout after 60. Checking every 5 sec. will be sufficient.
    sleep 5
done

if [ -s $LOCK_FILE ]; then
    logger -t "$LOG_TAG" -p user.info "OEMWS Region locked with OEM data."
fi

exit 0
