#!/bin/sh

CFG_FILE=/nv/SCHE_CFG
CRON_FILE=/var/cron/crontabs/root
MAX_SETTING=40
CMDTOOL_BIN=/usr/bin/cmdtool
LOG_TAG=sche-cfg

search_tag_res=0

RUN_APPEND=0

RUN_GET=0
GET_INDEX=0

RUN_SET=0
SET_INDEX=0
SET_DATA=0

RUN_POWERDOWN=0
RUN_POWERUP=0
RUN_POWERCYCLE=0
RUN_HARDRESET=0
RUN_SWSHUTDOWN=0

FLAG_BEFORE=1
FLAG_AFTER=1

LV=0

create_cfg(){
    LOGI "Create config file in /nv"

    # if file exist , can not create , need delete first
    if [ -f "$CFG_FILE" ];then
        LOGI "$CFG_FILE found."
        return 1
    fi

    echo "" > $CFG_FILE
    for i in $(seq 01 $MAX_SETTING)
    do
        str="#event"$(printf "%02d" $i)
        echo $str >> $CFG_FILE
        echo "# * * * * * /usr/bin/sche_run.sh action_powerdown" >> $CFG_FILE
        echo "" >> $CFG_FILE
    done
    LOGI "Create config file finish"
}


search_tag(){
    LOGV "serach $1 $2"
    str="#event"$(printf "%02d" $1)

    res=`grep -n $str $2 |  awk 'BEGIN {FS=":"}; {print $1}'`

    if [ "$res" == "" ];then
        logger -t "$LOG_TAG" -p local3.err "search_tag() The tag [$str] didn't exist in $2"
        exit 1
    fi

    LOGV "serach res=$res"
    search_tag_res=$res
}

replace_line(){
    LOGV "replace $1 $2 $3"
    rep="$1c$2"

    sed -i -e "$rep" $3  > /dev/null
}

query_line(){
    LOGV "query $1 $2"
    sed -n $1p $2
}

get_level(){
    lv=`dbgutil print | grep "Log level" | awk 'BEGIN {FS=":"}; {print $2}'`
    LV=$(($lv))
}

LOGV(){
    if [ "$LV" -ge  8 ];then
        logger -t "$LOG_TAG" -p local3.info $1
    fi
}

LOGE(){
    if [ "$LV" -ge  4 ];then
        logger -t "$LOG_TAG" -p local3.err $1
    fi
}

LOGI(){
    if [ "$LV" -ge  4 ];then
        logger -t "$LOG_TAG" -p local3.info $1
    fi
}
#parameter handle
get_level

if [ $# -eq 0 ];then
    LOGV "No parameter , exit script."
    exit 0
fi

NOW_TMP=`date '+%Y'`
NOW_Y="$NOW_TMP"

NOW_TMP=`date '+%m'`
NOW_M="$NOW_TMP"

NOW_TMP=`date '+%d'`
NOW_D="$NOW_TMP"

todate=$(date -d $NOW_Y-$NOW_M-$NOW_D +%s)
LOGV "todate = $NOW_Y-$NOW_M-$NOW_D = $todate"

LOGV "Date $NOW_Y-$NOW_M-$NOW_D "

i=1
while [ "$i" -le "$#" ]; do
    eval "arg=\${$i}"
    #printf '%s\n' "Arg $i: $arg"

    case "$arg" in

        append)
            RUN_APPEND=1
        ;;

        get)
            RUN_GET=1

            n=$((i + 1))
            eval "next=\${$n}"
            GET_INDEX=$next
            LOGV "index = $GET_INDEX"

            if [ "$GET_INDEX" == "" ];then
                LOGE "set need index."
                exit 1
            fi
        ;;

        set)
            RUN_SET=1

            n=$((i + 1))
            eval "next=\${$n}"
            SET_INDEX=$next
            LOGV "index = $SET_INDEX"

            if [ "$SET_INDEX" == "" ];then
                LOGE "set need index."
                exit 1
            fi

            m=$((n + 1))
            eval "next=\${$m}"
            SET_DATA=$next
            LOGV "data = $SET_DATA"

            if [ "$SET_DATA" == "" ];then
                LOGE "set need data."
                exit 1
            fi
        ;;

        --start)
            n=$((i + 1))
            eval "next=\${$n}"
            START_DATE=$next

            SD_LENGTH=`echo -n $START_DATE | wc -m`

            FLAG_AFTER=0

            if [ "$SD_LENGTH" -eq  8 ];then
                START_TMP=${START_DATE:0:4}
                START_Y="$START_TMP"

                START_TMP=${START_DATE:4:2}
                START_M="$START_TMP"

                START_TMP=${START_DATE:6:2}
                START_D="$START_TMP"

                todate=$(date -d $NOW_Y-$NOW_M-$NOW_D +%s)
                cond=$(date -d $START_Y-$START_M-$START_D +%s)
                LOGV "todate = $NOW_Y-$NOW_M-$NOW_D = $todate"
                LOGV "cond = $START_Y-$START_M-$START_D = $cond"

                if [ $todate -ge $cond ];
                then
                    LOGV "FLAG_AFTER=1"
                    FLAG_AFTER=1
                else
                    LOGV "FLAG_AFTER=0"
                    FLAG_AFTER=0
                fi

            else
                LOGV "start Date length != 8"
                exit 1
            fi

            if [ "$FLAG_AFTER" -eq  1 ];then
                LOGV "FLAG_AFTER !!!!!!!!!!!!!!!!!!!"
            fi
        ;;

        --end)
            n=$((i + 1))
            eval "next=\${$n}"
            END_DATE=$next

            ED_LENGTH=`echo -n $END_DATE | wc -m`

            FLAG_BEFORE=0

            if [ "$ED_LENGTH" -eq  8 ];then
                END_TMP=${END_DATE:0:4}
                END_Y="$END_TMP"

                END_TMP=${END_DATE:4:2}
                END_M="$END_TMP"

                END_TMP=${END_DATE:6:2}
                END_D="$END_TMP"

                todate=$(date -d $NOW_Y-$NOW_M-$NOW_D +%s)
                cond=$(date -d $END_Y-$END_M-$END_D +%s)
                LOGV "todate = $NOW_Y-$NOW_M-$NOW_D = $todate"
                LOGV "cond = $END_Y-$END_M-$END_D = $cond"

                if [ $todate -le $cond ];
                then
                    LOGV "FLAG_BEFORE=1"
                    FLAG_BEFORE=1
                else
                    LOGV "FLAG_BEFORE=0"
                    FLAG_BEFORE=0
                fi
            else
                LOGE "end Date length != 8"
                exit 1
            fi

            if [ "$FLAG_BEFORE" -eq  1 ];then
                LOGV "FLAG_BEFORE !!!!!!!!!!!!!!!!!!!"
            fi
        ;;

        action_powerdown)
            LOGV "action_powerdown"
            RUN_POWERDOWN=1
        ;;

        action_powerup)
            LOGV "action_powerup"
            RUN_POWERUP=1
        ;;

        action_powercycle)
            LOGV "action_powercycle"
            RUN_POWERCYCLE=1
        ;;

        action_hardreset)
            LOGV "action_hardreset"
            RUN_HARDRESET=1
        ;;

        action_swshutdown)
            LOGV "action_swshutdown"
            RUN_SWSHUTDOWN=1
        ;;


    esac
    i=$((i + 1))
done

# check file exist
if [ -f "$CFG_FILE" ];then
    LOGV "$CFG_FILE found."
else
    LOGI "Config not found , auto create config ."
    create_cfg
fi

#########################
# Append
#########################
if [ $RUN_APPEND -eq  1 ] ;
then
    cat $CFG_FILE >> $CRON_FILE
    LOGI "Append config into crontab"
fi

#########################
# Set
#########################

if [ $RUN_SET -eq  1 ] ;
then
    LOGV "RUN_SET"
    # Check tar exist in both file , before write file
    search_tag $SET_INDEX $CFG_FILE
    search_tag $SET_INDEX $CRON_FILE

    #serach and replace
    search_tag $SET_INDEX $CFG_FILE
    RLN=$(($search_tag_res+1))
    replace_line $RLN "$SET_DATA" $CFG_FILE

    #serach and replace
    search_tag $SET_INDEX $CRON_FILE
    RLN=$(($search_tag_res+1))
    replace_line $RLN "$SET_DATA" $CRON_FILE

    LOGV "RUN_SET Finish"
    exit 0
fi

#########################
# Get
#########################
if [ $RUN_GET -eq  1 ] ;
then
    LOGV "RUN_GET"

    search_tag $GET_INDEX $CFG_FILE
    QLN=$(($search_tag_res+1))
    query_line $QLN $CFG_FILE

    LOGV "RUN_GET Finish"
fi

#########################
# Action
#########################
if [ $RUN_POWERDOWN -eq  1 ] ;
then
    if [ "$FLAG_AFTER" -eq  1  -a "$FLAG_BEFORE" -eq  1  ];then
        LOGI "Host will be Shut down"
        $CMDTOOL_BIN -n 20 0 2 0
    else
        LOGV "RUN_POWERDOWN Out of date"
    fi
fi

if [ $RUN_POWERUP -eq  1 ] ;
then
    if [ "$FLAG_AFTER" -eq  1  -a "$FLAG_BEFORE" -eq  1  ];then
        LOGI "Host will be Power up"
        $CMDTOOL_BIN -n 20 0 2 1
    else
        LOGV "RUN_POWERUP Out of date"
    fi
fi

if [ $RUN_POWERCYCLE -eq  1 ] ;
then
    if [ "$FLAG_AFTER" -eq  1  -a "$FLAG_BEFORE" -eq  1  ];then
        LOGI "Host will be Power Cycle"
        $CMDTOOL_BIN -n 20 0 2 2
    else
        LOGV "RUN_POWERCYCLE Out of date"
    fi
fi

if [ $RUN_HARDRESET -eq  1 ] ;
then
    if [ "$FLAG_AFTER" -eq  1  -a "$FLAG_BEFORE" -eq  1  ];then
        LOGI "Host will be Hard Reset"
        $CMDTOOL_BIN -n 20 0 2 3
    else
        LOGV "RUN_HARDRESET Out of date"
    fi
fi

if [ $RUN_SWSHUTDOWN -eq  1 ] ;
then
    if [ "$FLAG_AFTER" -eq  1  -a "$FLAG_BEFORE" -eq  1  ];then
        LOGI "Host will be SW Shutdown"
        $CMDTOOL_BIN -n 20 0 2 5
    else
        LOGV "RUN_SWSHUTDOWN Out of date"
    fi
fi

exit 0
