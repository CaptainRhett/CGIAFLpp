#!/bin/sh
# /etc/init.d/network_phy_monitor.sh: monitor network physcial link state
#
#
#

times=0
#	echo "Monitor network physcial link state ..."

while [ 1 ]
do
	ret=`/sbin/ifconfig | grep eth0`
	if [ -n "$ret" ]
	then 	
		break
	else
		/sbin/ifup eth0
#		/sbin/ifdown $2  > /tmp/tmp.dat 2>&1	
#		tmp=`cat /tmp/tmp.dat | grep "not configured"`
#		echo $tmp
#		if [ -n "$tmp" ]
#		then 	
#			ifconfig $2 down
#			break	
#		else
#			continue
#		fi
		sleep 5
		let times++
		echo "times $times"
		if [ "$times" = "5" ]
		then
			echo "Enable network eth0 failed ....."
			exit -1
		fi
		echo "Enable network eth0 success .."	
	fi
done

sleep 5

let times=0
while [ 1 ]
do
	ret1=`/sbin/ifconfig | grep eth1`
	if [ -n "$ret1" ]
	then 
		break
	else
		/sbin/ifup eth1
#		/sbin/ifup $1  2>&1 | tee /tmp/tmp.dat	
#		tmp=`cat /tmp/tmp.dat | grep "already configured"`
#		echo $tmp
#		if [ -n "$tmp" ]
#		then 	
#			ifconfig $1 up
#		fi
		sleep 5
		let times++
		echo "times $times"
		if [ "$times" = "5" ]
		then
			echo "Enable network eth1 failed ....."
			exit -1
		fi
		echo "Enable network eth1 success .."
	fi
done	


