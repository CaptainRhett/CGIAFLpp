#!/bin/sh
LOCK=/nv/client_certificate/lock
CLIENT_CERT_SCRIPT=/etc/client_cert_request.sh

if [ -f $LOCK ]; then
	flock -n $LOCK $CLIENT_CERT_SCRIPT $@
fi