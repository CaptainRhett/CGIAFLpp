#Runlevel : 3 = S90
#Runlevel : 7 = K47

PATH=/bin:/usr/bin:/sbin:/usr/sbin

lighttpd_start() {
if [ -x /usr/local/sbin/lighttpd ]; then
    if ! `test -e /var/run/lighttpd.pid`; then
        /usr/local/sbin/lighttpd -f /conf/lighttpd.conf -m /usr/local/lib
        echo "Starting lighttpd"
    else
        /bin/ps ax | grep /usr/local/sbin/lighttpd | grep -v grep > /dev/null
        if [ $? == 1 ];then
           rm -f /var/run/lighttpd.pid
           /usr/local/sbin/lighttpd -f /conf/lighttpd.conf -m /usr/local/lib
        else
            echo "Lighttpd is already running!"
        fi
    fi
fi
}

lighttpd_stop() {
echo "Stopping lighttpd"
killall -15 lighttpd
}

lighttpd_restart() {
lighttpd_stop
sleep 3
lighttpd_start
}
test -f /var/tmp/licstat/lighttpd_nolicense && exit 0
case "$1" in
'start')
lighttpd_start
;;
'stop')
lighttpd_stop
;;
'restart')
lighttpd_restart
;;
*)
echo "usage $0 start|stop|restart"
;;
esac 
