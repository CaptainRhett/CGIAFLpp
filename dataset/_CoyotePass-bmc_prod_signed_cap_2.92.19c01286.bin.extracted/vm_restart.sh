#kill process
killall -15 uima
killall -15 uiso
killall -15 usb
killall -9 usb
killall -9 uima
killall -9 uiso
sleep 1

#re-init process
/usr/bin/usb&
/usr/bin/uima&
/usr/bin/uiso&
