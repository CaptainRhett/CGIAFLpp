#!/bin/sh

usage()
{
	echo "Usage: kvm_reset.sh <<arg> [<sess_id>]>"
	echo "       arg: 1 - reset KVM due to change KVM listening port"
	echo "       arg: 2 - reset KVM due to change IP"
	echo "       arg: 3 - force reset KVM with KVM session timeout and <sess_id>"
	echo "       arg: 4 - force reset KVM with web logout and <sess_id>"
}

reset_type=
sess_id=
restart_kvm=

case $1 in
	0)
		reset_type="0"
	;;
	1)
		reset_type="-1"
		restart_kvm="1"
	;;
	2)
		reset_type="-2"
		restart_kvm="1"
	;;
	3)
		reset_type="-3"
		sess_id=$2 
	;;
	4)
		reset_type="-4"
		sess_id=$2 
	;;
	h)
		usage
	;;
	*)
		echo "Unexpected option $1 $2"
		usage
	;;
esac

if [ -n "$reset_type" ] ; then
	echo "$reset_type $sess_id" > /tmp/killsess
	killall -USR1 ikvmserver
	if [ "$restart_kvm" = "1" ]; then
		/etc/init.d/ikvm restart
	fi
fi

