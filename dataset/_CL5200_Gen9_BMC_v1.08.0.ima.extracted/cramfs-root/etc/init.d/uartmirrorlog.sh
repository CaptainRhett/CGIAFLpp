#!/bin/sh
# /etc/init.d/uartmirrorlog.sh
#
# chkconfig: 2345 10 90
#Runlevel : S = S43
#Runlevel : 6 = K91
#Runlevel : 8 = K91
#Runlevel : 7 = K37
# Restart the service on warm reboot
#Runlevel : 9 = K91
#Runlevel : 9 = S43

PATH=/bin:/usr/bin:/sbin:/usr/sbin

PATHFUL_UARTMIRRORLOG="/usr/local/bin/uartmirrorlog"

test -f /usr/local/bin/uartmirrorlog || exit 0

# Options for start/restart the daemons
#
#
CORE_FEATURES="/etc/core_features"
SOLLOG_IN_RAM="/var/sollog/"
SOLLOG_IN_SPI="/extlog/sollog/"
SOLLOG_IN_REMOTE="/var/sollogremote"
SOLLOG_ARCHIVE_REMOTE="/var/sollogremote/archive"

start_application()
{
    # check if uartmirrorlog application is already running
    # If not, then start the application, else just return
    ps axc | grep $PATHFUL_UARTMIRRORLOG | grep -v $PATHFUL_UARTMIRRORLOG
    if [ $? -ne 0 ];
    then
        /usr/local/bin/uartmirrorlog
    fi
}

start_rsync_remote()
{

    # remote path for sol logging is not mounted so skipping rsync process.
    mount | grep "/var/sollogremote/archive" | grep -v "grep" > /dev/null
    if [ $? -ne 0 ];
    then
        echo -n "Remote path not mounted so skipping rsync process"
        return
    fi

    # Check if the rsync process is already running or not
    # If already running, dont do anything
    ps axc | grep "/etc/rsync_sollog.sh" | grep -v "grep" > /dev/null
    if [ $? -ne 0 ];
    then
        echo -n "rsync for UART Logging is not running. So, starting new"

        # Create the directory in RAM for rsync
        # This is the source for rsync
        if [ ! -d $SOLLOG_IN_REMOTE ];
        then
            mkdir -p $SOLLOG_IN_REMOTE
        fi

        if [ ! -d $SOLLOG_IN_RAM ];
        then
            mkdir -p $SOLLOG_IN_RAM
        fi

        # Start the rsync script to sync between RAM and SPI partition
        /etc/rsync_sollog.sh $SOLLOG_IN_RAM $SOLLOG_IN_REMOTE &
    fi
}

stop_rsync()
{
    PID=`ps -eaf | grep '/var/sollog' | grep -v grep | awk '{print $2}'`
    if [[ "" !=  "$PID" ]]; then
        kill -9 $PID
    fi
}

start_rsync_extlog()
{
    # Check if the rsync process is already running or not
    # If already running, dont do anything
    ps axc | grep "/etc/rsync_sollog.sh" | grep -v "grep" > /dev/null
    if [ $? -ne 0 ];
    then
        echo -n "rsync for UART Logging is not running. So, starting new"

        # Create the directory in RAM for rsync
        # This is the source for rsync
        if [ ! -d $SOLLOG_IN_RAM ]; 
        then
            mkdir -p $SOLLOG_IN_RAM
        fi

        # Start the rsync script to sync between RAM and SPI partition
        /etc/rsync_sollog.sh $SOLLOG_IN_RAM $SOLLOG_IN_SPI &
    fi
}

start_rsync()
{
    #check the storage location, whether to log in remote or extlog
    grep -q 'CONFIG_SPX_FEATURE_UART_LOGGING_REMOTE_SUPPORT' $CORE_FEATURES
    if [ $? -eq 0 ];
    then
        start_rsync_remote
        return
    fi

    grep -q 'CONFIG_SPX_FEATURE_UART_LOGGING_BMC_SUPPORT' $CORE_FEATURES
    if [ $? -eq 0 ];
    then
        start_rsync_extlog
        return
    fi

    return
}

stop_application()
{
    killall -1 uartmirrorlog
    rsync_pid=`ps axc |grep rsync_sollog.sh | awk '{print $1}'`
    kill -1 $rsync_pid
    killall inotifywait
}

case "$1" in
    start)
        echo -n "Starting UART Mirror Log application"
        start_application
        start_rsync
        echo "."
        ;;
    stop)
        echo -n "Stopping UART Mirror Log application"
        stop_application
        echo "."
        ;;
    reload)
        echo -n "Reloading UART Mirror Log apllication"
        echo "dont know what to do with reload right now"
        echo "."
        ;;
    force-reload)
        #   $0 reload
        ;;
    restart)
        echo -n "Restarting UART Mirror Log apllication"
        stop_application
        sleep 1
        start_application
        start_rsync
        echo "."
        ;;
    start-rsync)
        echo -n "Starting the rsync process"
        start_rsync
        echo "."
        ;;
    stop-rsync)
        echo -n "Stopping the rsync process "
        stop_rsync
        echo "."
        ;;
    *)
        echo "Usage: /etc/init.d/uartmirrorlog {start|stop|reload|restart|force-reload|start-rsync|stop-rsync}"
        exit 1
esac

exit 0
