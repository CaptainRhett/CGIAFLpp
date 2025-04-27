#!/bin/sh


ACTION=$1

if [ -z "$ACTION" ]; then
    echo "Usage: $0 ACTION"
    exit 1
fi

NTPD_BIN="ntpd"
NTP_BIN="/usr/sbin/"$NTPD_BIN
NTP_SYNC_PERIOD=1
PROCESS_TERMINATE_COUNTDOWN=5
NTP_SERVICE="*/$NTP_SYNC_PERIOD * * * * /bin/ntp.sh sync"

CRONTAB="/usr/bin/crontab"

SYNC_STATUS="/tmp/ntpSyncStatus"
SYNC_FAIL_FLAG="/tmp/ntpSyncFailed"
SYNC_IN_PROGRESS_LOCK="/tmp/ntpSyncing.lock"
FIRST_SYNC_NTP_TIME="/tmp/FIRST_SYNC_NTP"

function check_NTP_BIN_Process() {
    result=""
    result=`ps | grep "$NTPD_BIN" | grep -v grep | wc -l`
    echo $result
}


function syncNTP() {
    echo "start syncing..." > $SYNC_STATUS
    $NTP_BIN -nq &> $SYNC_STATUS && rm -f $SYNC_FAIL_FLAG || touch $SYNC_FAIL_FLAG
}

RETURN=0
case "$ACTION" in
    "status")
        # schedule ntp task fail
        $CRONTAB -u root -l 2> /dev/null | grep -q ntp || RETURN=$((RETURN + 0x10))
        state=$(cat $SYNC_STATUS | grep -q "syncing")
        if cat $SYNC_STATUS | grep -q "syncing"; then
            # ntp processing
            RETURN=$((RETURN + 0x80))
        elif cat $SYNC_STATUS | grep -q "offset"; then
            # ntpd set time success
            RETURN=$((RETURN + 0x40))
        elif [ ! -s $SYNC_STATUS ]; then
            # ntpd has no output, set time success
            RETURN=$((RETURN + 0x40))
        elif cat $SYNC_STATUS | grep -q "Network is unreachable"; then
            # ntp server is unreachable
            RETURN=$((RETURN + 0x20))
        elif cat $SYNC_STATUS | grep -q "bad address"; then
            # ntp server is unreachable
            RETURN=$((RETURN + 0x20))
        fi

        exit $RETURN
        ;;

    "sync")
        exec 9> "$SYNC_IN_PROGRESS_LOCK"
        if ! flock -n 9
        then
            RETURN=$((RETURN + 0x80))
            exit $RETURN
        fi
        #Wait 60 sec for web initial when first sync in boot process
        if [ -f $FIRST_SYNC_NTP_TIME ]; then
            PROCESS_TERMINATE_COUNTDOWN=60
            rm $FIRST_SYNC_NTP_TIME
        else
            PROCESS_TERMINATE_COUNTDOWN=20
        fi

        bfr_sec=`date +%s`
        syncNTP &

        #Check ntpd process in PROCESS_TERMINATE_COUNTDOWN sec, if exist, means might bad address, kill ntpd process and touch fail log file.
        ntpd_exist=`check_NTP_BIN_Process`
        count=0
        while [[ $ntpd_exist -gt 0 ]] && [[ $count -lt $PROCESS_TERMINATE_COUNTDOWN ]] ; do
            echo "exist idx:$count process-count:$ntpd_exist"
            if [ $count -eq $(( $PROCESS_TERMINATE_COUNTDOWN - 1 )) ] ; then
                killall $NTPD_BIN
                #echo "last kill process, touhc $SYNC_FAIL_FLAG"
                touch $SYNC_FAIL_FLAG
            else
                sleep 1
            fi
            count=$(( count+1 ))
            ntpd_exist=`check_NTP_BIN_Process`
        done
        #echo "finished of sync"
        #If SYNC_FAIL_FLAG not existed, write system time
        if [ ! -f $SYNC_FAIL_FLAG ]; then
            CMDTOOL_BIN=/usr/bin/cmdtool
            cur_time=`date '+%Y %m %d %H %M %S'`
            cur_sec=`date +%s`

            if [ ${cur_sec} -gt ${bfr_sec} ] ; then
                diff_sec=$(( cur_sec-bfr_sec ))
            else
                diff_sec=$(( bfr_sec-cur_sec ))
            fi

            if [ ${diff_sec} -ge 60 ] ; then
                res=`awk -v str="$cur_time" 'BEGIN {print mktime(str)}'`
                req0=`printf "%x" $(( ($res >> 0) & 0xff ))`
                req1=`printf "%x" $(( ($res >> 8) & 0xff ))`
                req2=`printf "%x" $(( ($res >> 16) & 0xff ))`
                req3=`printf "%x" $(( ($res >> 24) & 0xff ))`
                #IPMI command Set Sel time
                $CMDTOOL_BIN 20 28 49 "$req0" "$req1" "$req2" "$req3"
            else
                echo "time change less then 60 , skip set sel time ."
            fi

        fi
        ;;

    "start")
        if $CRONTAB -u root -l 2> /dev/null | grep -q ntp
        then
            exit 0
        fi

        $CRONTAB -u root -l 2> /dev/null | { cat; echo "$NTP_SERVICE"; } | $CRONTAB -u root -
        ;;

    "stop")
        $CRONTAB -u root -l | sed '/ntp/d' | $CRONTAB -u root -
        rm -rf $SYNC_FAIL_FLAG
        ;;
esac
