#!/bin/sh
#
#Runlevel : 3 = S98

#Change file(/conf/crontab) access time and modify time to 2000-01-01 00:00 from 1970-01-01 00:00
#For crontab is not loaded correctly when update BMC with socflash, for the file's modify time is 0(1970-01-01 00:00)
echo "logrotate changes the access and modify time of /conf/crontab."
touch -c -d 200001010000 /conf/crontab

#This script has been added temporarily and can be removed in future.
#This script will add the root user in /etc/passwd file,because logrotate works with root user only
if [ -e /etc/passwd ] && [ -e /conf/passwd ]
then
	#deleting the old /bin/false implementation
	grep -q "root:x:15000:15000:root:/root:/bin/false" /conf/passwd
	if [ $? == 0 ]
	then
		sed -i '/root:x:15000:15000:root:\/root:\/bin\/false/d' /conf/passwd
	fi

	#Add root user in /etc/passwd with shell as defshell
	grep -q "root:x:15000:15000:root:/root:/usr/local/bin/smashclp" /etc/passwd
	if [ $? == 1 ]
	then
		echo root:x:15000:15000:root:/root:/usr/local/bin/smashclp >> /etc/passwd
	fi
fi

