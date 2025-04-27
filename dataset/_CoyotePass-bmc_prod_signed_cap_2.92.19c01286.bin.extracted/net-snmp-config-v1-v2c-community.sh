#!/bin/sh

communityRW=rwcommunity
communityRO=rocommunity
communityRWIPv6=rwcommunity6
communityROIPv6=rocommunity6
actFlag=""
actDup=0
writeFlag=0
addUser=""
communityStr=""
strLen=0
delUser=""
configdir="/nv/snmp/share/snmp"
configfile="${configdir}/snmpd.conf"
lineNum=0
line=""
line6=""

while test "x$done" = "x" -a "x$1" != "x" -a "x$usage" != "xyes"; do
case "$1" in
    -*=*) optarg=`echo "$1" | sed 's/[-_a-zA-Z0-9]*=//'` ;;
    *) optarg= ;;
esac

unset shifted
case $1 in
    --help)
      usage="yes"
      ;;
    -g)
        if test "x$actFlag" != "x" ; then
            actDup=1
        fi
        actFlag="get"
    shift
    ;;
    -s)
    shift
    if test "x$1" = "x" ; then
        echo "You must specify a community string for v1/v2c"
        exit 1
    fi
        addUser=$1
        communityStr="'$1'"
        strLen=${#addUser}
    if [ $strLen -gt 32 ]; then
        echo "Community string length too long"
        exit 1
    fi
        if test "x$actFlag" != "x" ; then
            actDup=1
        fi
        actFlag="set"
    shift
    ;;
    -w)
        writeFlag=1
    shift
    ;;
    -d)
    shift
    if test "x$1" = "x" ; then
        echo "You must specify a community string to delete"
        exit 1
    fi
        if test "x$actFlag" != "x" ; then
            actDup=1
        fi
        actFlag="del"
        delUser="'$1'"
    shift
    ;;
     -e)
        shift
        if test "x$actFlag" != "x" ; then
            actDup=1
        fi
        actFlag="enable"
        enableValue=$1
        if test "x$enableValue" != "xenable" -a "x$enableValue" != "xdisable" -a "x$enableValue" != "x" ; then
            usage="yes"
        fi
    shift
    ;;
    -*)
    echo "unknown suboption to $0: $1"
    usage=yes
    done=1
    ;;
    *)
        done=1
        ;;
    esac
done

if test "x$actFlag" = "x" -o "x$usage" = "xyes"; then
    echo ""
    echo "Usage:"
    echo "  net-snmp-config-v1-v2c-community [-s community] [-w]"
    echo "  net-snmp-config-v1-v2c-community [-g] [-w]"
    echo "  net-snmp-config-v1-v2c-community [-d community] [-w]"
    echo "  net-snmp-config-v1-v2c-community [-e] [enable|disable]"
    echo ""
    exit
fi

if test $actDup -eq 1 ; then
    echo ""
    echo "Don't use set/delete/enable at the same time"
    echo ""
    exit
fi

rwCommunityNum=$(awk "/$communityRW / {print FNR}" $configfile)
roCommunityNum=$(awk "/$communityRO / {print FNR}" $configfile)
rwCommunity6Num=$(awk "/$communityRWIPv6 / {print FNR}" $configfile)
roCommunity6Num=$(awk "/$communityROIPv6 / {print FNR}" $configfile)

checkCommunityValid () {
    if [ "$(echo $1 | grep "'" )"  != "" ]; then
        echo "Invalid community string"
        return 1
    fi
    return 0
}

checkCommunityDuplicated () {
    if [ $writeFlag -eq 1 ]; then
        if test "x$roCommunityNum" = "x" -a "x$roCommunity6Num" = "x" ; then
            echo "No community duplicated"
        else
            roLine=$(grep -Fno "$communityRO $1" $configfile | head -n 1 | cut -d: -f1)
            roLine6=$(grep -Fno "$communityROIPv6 $1" $configfile | head -n 1 | cut -d: -f1)
            if test "x$roLine" = "x" -a "x$roLine6" = "x" ; then
                echo "No community duplicated"
            else
                return 1
            fi
        fi
    else
        if test "x$rwCommunityNum" = "x" -a "x$rwCommunity6Num" = "x" ; then
            echo "No community duplicated"
        else
            rwLine=$(grep -Fno "$communityRW $1" $configfile | head -n 1 | cut -d: -f1)
            rwLine6=$(grep -Fno "$communityRWIPv6 $1" $configfile | head -n 1 | cut -d: -f1)
            if test "x$rwLine" = "x" -a "x$rwLine6" = "x" ; then
                echo "No community duplicated"
            else
                return 1
            fi
        fi
    fi
    return 0
}

communityEnable() {
    communitys="$communityRW $communityRO $communityRWIPv6 $communityROIPv6"
    enableValue=$1
    if [ "$enableValue" = "" ]; then
        markNum=$(grep -c "^r[ow]community" $configfile)
        if [ $markNum -gt 0 ]; then
            echo "enable"
        else
            echo "disable"
        fi
        return 0
    elif [ "$enableValue" = "enable" ]; then
        oldMark="#"
        newMark=""
    elif [ "$enableValue" = "disable" ]; then
        oldMark=""
        newMark="#"
    fi
    for w in $communitys; do
        sed -i "s/^$oldMark$w /$newMark$w /g" $configfile
    done
}

if [ "$actFlag" =  "set" ]; then
    checkCommunityValid "${addUser}"
    if [ $? -eq 1 ]; then
        echo "Community string invalid"
        exit 1
    fi
    enableStr=$(communityEnable)
    markStr="#"
    if [ "$enableStr" = "enable" ]; then
        markStr=""
    fi

    if [ $writeFlag -eq 1 ]; then
        line="$communityRW $communityStr"
        line6="$communityRWIPv6 $communityStr"
        checkCommunityDuplicated "${communityStr}"
        if [ $? -eq 1 ]; then
            echo "Community string duplicated"
            exit 1
        fi
        if test "x$rwCommunityNum" = "x" -a "x$rwCommunity6Num" = "x" ; then
            echo "new community string"
        elif test "x$rwCommunityNum" = "x" ; then
            if test $rwCommunity6Num -gt 0 ; then
                echo "replace community string"
                sed -i "${rwCommunity6Num}d" $configfile
            else
                echo "Remove exist community fail"
                exit 1
            fi
        elif test "x$rwCommunity6Num" = "x" ; then
            if test $rwCommunityNum -gt 0 ; then
                echo "replace community string"
                sed -i "${rwCommunityNum}d" $configfile
            else
                echo "Remove exist community fail"
                exit 1
            fi
        else
            if test $rwCommunityNum -gt 0 -a $rwCommunity6Num -gt 0 ; then
                echo "replace community string"
                sed -i "${rwCommunityNum}d;${rwCommunity6Num}d" $configfile
            else
                echo "Remove exist community fail"
                exit 1
            fi
        fi
    else
        line="$communityRO $communityStr"
        line6="$communityROIPv6 $communityStr"
        checkCommunityDuplicated "${communityStr}"
        if [ $? -eq 1 ]; then
            echo "Community string duplicated"
            exit 1
        fi
        if test "x$roCommunityNum" = "x" -a "x$roCommunity6Num" = "x" ; then
            echo "new community string"
        elif test "x$roCommunityNum" = "x" ; then
            if test $roCommunity6Num -gt 0 ; then
                echo "replace community string"
                sed -i "${roCommunity6Num}d" $configfile
            else
                echo "Remove exist community fail"
                exit 1
            fi
        elif test "x$roCommunity6Num" = "x" ; then
            if test $roCommunityNum -gt 0 ; then
                echo "replace community string"
                sed -i "${roCommunityNum}d" $configfile
            else
                echo "Remove exist community fail"
                exit 1
            fi
        else
            if test $roCommunityNum -gt 0 -a $roCommunity6Num -gt 0 ; then
                echo "replace community string"
                sed -i "${roCommunityNum}d;${roCommunity6Num}d" $configfile
            else
                echo "Remove exist community fail"
                exit 1
            fi
        fi
    fi
    sed -i "/#SNMPv1_v2c/a $markStr$line6" $configfile
    sed -i "/#SNMPv1_v2c/a $markStr$line" $configfile
elif [ "$actFlag" =  "del" ]; then
        lineNum=$(grep -Fno "$delUser" $configfile | head -n 1 | cut -d: -f1)
        if test "x$lineNum" = "x" ; then
            echo "No community exist to delete"
            exit
        fi
        checkCommunityDuplicated "${delUser}"
        if [ $? -eq 1 ]; then
            echo "Community string duplicated"
            exit 1
        fi
        if [ $writeFlag -eq 1 ]; then
            delLine=$(grep -Fno "$communityRW $delUser" $configfile | head -n 1 | cut -d: -f1)
            delLine6=$(grep -Fno "$communityRWIPv6 $delUser" $configfile | head -n 1 | cut -d: -f1)
        else
            delLine=$(grep -Fno "$communityRO $delUser" $configfile | head -n 1 | cut -d: -f1)
            delLine6=$(grep -Fno "$communityROIPv6 $delUser" $configfile | head -n 1 | cut -d: -f1)
        fi
        if test "x$delLine" = "x" -a "x$delLine6" = "x" ; then
            echo "Delete exist community fail"
            exit 1
        elif test "x$delLine" = "x" ; then
            if test $delLine6 -gt 0 ; then
                sed -i "${delLine6}d" $configfile
            else
                echo "Delete exist community fail"
                exit 1
            fi
        elif test "x$delLine6" = "x" ; then
            if test $delLine -gt 0 ; then
                sed -i "${delLine}d" $configfile
            else
                echo "Delete exist community fail"
                exit 1
            fi
        else
            if test $delLine -gt 0 -a $delLine6 -gt 0 ; then
                sed -i "${delLine}d;${delLine6}d" $configfile
            else
                echo "Delete exist community fail"
                exit 1
            fi
        fi
elif [ "$actFlag" =  "get" ]; then
        if [ $writeFlag -eq 1 ]; then
            if test "x$rwCommunityNum" = "x" -a "x$rwCommunity6Num" = "x" ; then
                exit 0
            else
                if test "x$rwCommunityNum" = "x" ; then
                    communityKey=$communityRWIPv6
                elif test "x$rwCommunityNum6" = "x" ; then
                    communityKey=$communityRW
                else
                    communityKey=$communityRW
                fi
            fi
        else
            if test "x$roCommunityNum" = "x" -a "x$roCommunity6Num" = "x" ; then
                exit 0
            else
                if test "x$roCommunityNum" = "x" ; then
                    communityKey=$communityROIPv6
                elif test "x$roCommunityNum6" = "x" ; then
                    communityKey=$communityRO
                else
                    communityKey=$communityRO
                fi
            fi
        fi
        communityStr=$(awk -F"'" "/$communityKey / {print\$2}" $configfile)
        echo "$communityStr"

elif [ "$actFlag" =  "enable" ]; then
    communityEnable $enableValue
fi



