#!/bin/sh
# /etc/init.d/network_config.sh: Change network 
#
#
#
if [ $# -ne 2 ]
then
	echo "usage: network_config enbale_adaper  disable_adapter"
	exit -1
fi

times=0
vlanflag=0
#	echo "Channging network adapter ..."

while [ 1 ]
do
	ret=`/sbin/ifconfig | grep $2`
	if [ -z "$ret" ]
	then 	
		break
	else
		/sbin/ifdown $2
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
			echo "Disable network $2 failed ....."
			exit -1
		fi
		echo "Disable network $2 success .."	
	fi
done

sleep 5

let times=0
while [ 1 ]
do
	ret1=`/sbin/ifconfig | grep $1`
	if [ -n "$ret1" ]
	then 
		break
	else
		/sbin/ifup $1
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
			echo "Enable network $1 failed ....."
			exit -1
		fi
		echo "Enable network $1 success .."
		let vlanflag=1
	fi
done	

sleep 5

if [ $1 = "eth0" ]
then
	if [ "$vlanflag" = "1" ]
	then
		/etc/init.d/vlannetworking downvlan0
		sleep 5
		/etc/init.d/vlannetworking start
		echo "Enable network $1 vlan success .."
#keep link or not when eth0 up. 20160526
		echo 1 > /proc/sys/ractrends/ncsi/ControlVetoBit
		let vlanflag=0
	fi
fi


