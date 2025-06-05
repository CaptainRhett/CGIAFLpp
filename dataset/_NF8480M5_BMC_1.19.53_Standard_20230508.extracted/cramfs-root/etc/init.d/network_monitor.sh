#!/bin/sh
# /etc/init.d/network_monitor.sh: Enable network-monitor port
#
#Running at RCS.d
#Runlevel : 3 = S42
#Runlevel : 6 = K36
#Runlevel : 7 = K36
#Runlevel : 8 = K36

if [ -x /usr/local/bin/network_monitor ]
then
	echo ""
else
	exit 0
fi

# Options for start/restart the daemons
#


#


case "$1" in
  start)
    echo -n "Enabling User Network monitor function ..." 
    /usr/local/bin/network_monitor &
#    start-stop-daemon --start --quiet --exec $PATHFUL_IPMIINIT
    echo "."
    ;;
  stop)
    echo -n "Stopping network_monitor"
    PID=`ps -A | grep "network_monitor" | awk -F ' ' '{print $1}'`
    kill -9 $PID
    PID=`ps -A | grep "network_config" | awk -F ' ' '{print $1}'`
    kill $PID
#    start-stop-daemon --stop --quiet --exec $PATHFUL_IPMIINIT
    echo "."
    exit 0
    ;;
    reload)
	echo -n "Reloading network_monitor"
	echo "dont know what to do with reload right now"
#	start-stop-daemon --stop --quiet --exec $PATHFUL_IPMIINIT --signal 1
	echo "."
	exit 0
	;;
    force-reload)
#	$0 reload
	exit 0
	;;
    restart)
	echo -n "Restarting network_monitor"
        PID=`ps -A | grep "network_monitor" | awk -F ' ' '{print $1}'`
        kill $PID
        PID=`ps -A | grep "network_config" | awk -F ' ' '{print $1}'`
        kill $PID
	sleep 1
	/usr/local/bin/network_monitor &
#	start-stop-daemon --stop --quiet --oknodo --exec $PATHFUL_IPMIINIT
#	start-stop-daemon --start --quiet --exec $PATHFUL_IPMIINIT
	echo "."
	exit 0
	;;
   *)
    echo "Usage: /etc/init.d/ipmistack {start|stop|reload|restart|force-reload}"
    exit 1
esac

exit 0
