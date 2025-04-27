#!/bin/sh
# /etc/init.d/upnp: start UPnP discovery
#
#Starting at rc3.d and stopping at rc6.d
#Runlevel : 3 = S50
#Runlevel : 6 = K50
#Runlevel : 7 = K50
#Runlevel : 8 = K50

. /lib/lsb/init-functions
PATH=/bin:/usr/bin:/sbin:/usr/sbin
PATHFUL_UPNPDISCOVERY=/usr/local/bin/redfish_device
DESC_FILE=/conf/upnp/desc.tmpl

# Options for start/restart the daemons
delete_redfish_desc()
{
	if [ -f $DESC_FILE ]; then
		echo "Delete the /conf/upnp/desc.tmpl for upnp restart"
		rm $DESC_FILE
	fi
}

case "$1" in
    start)
    	log_daemon_msg "Starting Redfish upnp discovery" "upnp"

	delete_redfish_desc
    	export LD_LIBRARY_PATH=/usr/local/lib
    	start-stop-daemon -b --start --quiet --exec $PATHFUL_UPNPDISCOVERY --start -- -webdir /conf/upnp
    	log_end_msg $?
    	;;
    stop)
    	log_daemon_msg "Stopping Redfish upnp discovery" "upnp"
    	export LD_LIBRARY_PATH=/usr/local/lib
   		start-stop-daemon --stop --quiet --exec $PATHFUL_UPNPDISCOVERY --signal KILL 
   		log_end_msg $?
	delete_redfish_desc
    	;;
    restart)
    	log_daemon_msg "Restarting Redfish upnp discovery" "upnp"
    	export LD_LIBRARY_PATH=/usr/local/lib
		start-stop-daemon --stop --quiet --oknodo --exec $PATHFUL_UPNPDISCOVERY --signal KILL
		delete_redfish_desc
		start-stop-daemon -b --start --quiet --exec $PATHFUL_UPNPDISCOVERY --start -- -webdir /conf/upnp
    	log_end_msg $?
	
	;;
     *)
    	echo "Usage: /etc/init.d/redfish_device {start|stop|restart}"
    	exit 1
esac

exit 0
