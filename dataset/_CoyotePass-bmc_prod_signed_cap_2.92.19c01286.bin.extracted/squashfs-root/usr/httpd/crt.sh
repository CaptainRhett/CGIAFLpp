#!/bin/sh
GENDIR=/nv/CA/root
SCNF=/usr/httpd/ssl.cnf
CLIENTSCNF=/usr/httpd/clientssl.cnf
UPLOADED_KEY=$GENDIR/private/cakey-upload.pem
MERGED_KEY=/nv/server.pem
PRIVATE_KEY=$GENDIR/private/cakey.pem
CERT=$GENDIR/cacert.pem
DAYS=3652 # ten years (includes 2 leap days)
EXP=$((6 * 30 * 86400)) # check to see if it expires in the next 6 months
LOCKDIR=/var/lock/ssl-key-gen
LOG_TAG=tls-keygen

#Client Certificate parameter
CLIENTCERTDIR=/nv/client_certificate
CLIENTCERT_CERTONLY_DIR=$CLIENTCERTDIR/certonly
CLIENTCERT_CA_DIR=$CLIENTCERTDIR/CA
CLIENT_PEM=$CLIENTCERTDIR/server.pem
CLIENT_CRT=$CLIENTCERTDIR/server.crt
CLIENT_SRL=$CLIENTCERTDIR/server.srl
CLIENT_CA_FILE=$CLIENTCERTDIR/ca.crt
CLIENT_CNF=$CLIENTCERTDIR/ssl.cnf
CLIENT_LOCK=$CLIENTCERTDIR/lock

INTERMEDIATE_NAME=$CLIENTCERTDIR/intermediate

CLIENTCERT_CA_CERTS_FOLDER=$CLIENTCERT_CA_DIR/certs
CLIENTCERT_CA_CRL_FOLDER=$CLIENTCERT_CA_DIR/crl
CLIENTCERT_CA_NEWCERTS_FOLDER=$CLIENTCERT_CA_DIR/newcerts
CLIENTCERT_CA_PRIVATE_FOLDER=$CLIENTCERT_CA_DIR/private
CLIENTCERT_CA_INDEX_TXT=$CLIENTCERT_CA_DIR/index.txt
CLIENTCERT_CA_CRLNUMBER=$CLIENTCERT_CA_DIR/crlnumber

CLIENT_CA_REVOKE_SERVER_CRL_FILE=$CLIENTCERT_CA_CRL_FOLDER/server.crl
CLIENT_CA_REVOKE_INTERMEDIATE_CRL_FILE=$CLIENTCERT_CA_CRL_FOLDER/intermediate.crl
CLIENT_CA_REVOKE_CRL_FILE=$CLIENTCERT_CA_CRL_FOLDER/ca.crl

export RANDFILE=$GENDIR/.rnd

source /etc/monit/scripts/common-funcs

parse_cert_date() {
    local date_type=$1

    local cert_date=$(
        openssl x509 -noout -in $CERT -$date_type | \
            sed -e 's/notBefore=//g' | \
            sed -e 's/notAfter=//g' | \
            sed -e 's/GMT//g' | \
            sed -r 's/(.*):/\1./' | \
            sed -r 's/(( [0-9] )+)/0\1 /' | \
            sed -e 's/://g' | \
            sed -e 's/Jan/01/g' | \
            sed -e 's/Feb/02/g' | \
            sed -e 's/Mar/03/g' | \
            sed -e 's/Apr/04/g' | \
            sed -e 's/May/05/g' | \
            sed -e 's/Jun/06/g' | \
            sed -e 's/Jul/07/g' | \
            sed -e 's/Aug/08/g' | \
            sed -e 's/Sep/09/g' | \
            sed -e 's/Oct/10/g' | \
            sed -e 's/Nov/11/g' | \
            sed -e 's/Dec/12/g'
    )

    local cert_start_year=$(echo $cert_date | awk '{print $NF}')
    cert_date="$cert_start_year ${cert_date//$cert_start_year/}"
    cert_date="${cert_date// /}"

    echo $cert_date
}

Create_Client_Cert_Path()
{
    #Set Client Certificate folder and privilege
    mkdir -p $CLIENTCERTDIR
    mkdir -p $CLIENTCERT_CERTONLY_DIR
    mkdir -p $CLIENTCERT_CA_DIR

    mkdir -p $CLIENTCERT_CA_CERTS_FOLDER
    mkdir -p $CLIENTCERT_CA_CRL_FOLDER
    mkdir -p $CLIENTCERT_CA_NEWCERTS_FOLDER
    mkdir -p $CLIENTCERT_CA_PRIVATE_FOLDER

    if [ ! -f $CLIENTCERT_CA_INDEX_TXT ]; then
        touch $CLIENTCERT_CA_INDEX_TXT
    fi

    echo "02" > $CLIENTCERT_CA_CRLNUMBER

    chown -R httpd:httpd $CLIENTCERTDIR
    chmod 775 $CLIENTCERTDIR
}

Client_Cert_Setting()
{
    #Client Certificate setting

    #Symbol link server.pem to $CLIENTCERTDIR because CAcreateserial will create file where CA located
    #   with privilege problem
    ln -sf ${MERGED_KEY} ${CLIENT_PEM}

    if [ -f $CLIENTSCNF ]; then
        cp ${CLIENTSCNF} ${CLIENT_CNF}
        chown httpd:httpd ${CLIENT_CNF}
        chmod 775 ${CLIENT_CNF}
    fi

    if [ ! -f $CLIENT_LOCK ]; then
        touch $CLIENT_LOCK
        chown httpd:httpd ${CLIENT_LOCK}
        chmod 775 ${CLIENT_LOCK}
    fi
    #Generate Intermediate key, csr, crt
    if [ -f $CLIENT_CNF ]; then
        if [ ! -f $INTERMEDIATE_NAME.key ] || [ ! -f $INTERMEDIATE_NAME.csr ] || [ ! -f $INTERMEDIATE_NAME.crt ]; then
            #Set intermediate dn
            sed -i "68s#distinguished_name = .*#distinguished_name = intermediate_dn#" $CLIENT_CNF
            #Generate a RSA-2048 private key
            openssl genrsa -out $INTERMEDIATE_NAME.key 2048
            #Generate intermediate request
            openssl req -config $CLIENT_CNF -new -key $INTERMEDIATE_NAME.key -out $INTERMEDIATE_NAME.csr
            #Sign the certificate using the server private key and server cert with v3_intermediate_ca extension
            openssl x509 -req -days $DAYS -extfile $CLIENT_CNF -in $INTERMEDIATE_NAME.csr -CA $CLIENT_PEM -CAkey $CLIENT_PEM -out $INTERMEDIATE_NAME.crt -extensions v3_intermediate_ca -CAcreateserial
        fi
    fi
    # Create ca file
    if [ -f $CLIENT_PEM ] && [ -f $INTERMEDIATE_NAME.crt ]; then
        openssl x509 -in ${CLIENT_PEM} -out ${CLIENT_CRT}
        chown httpd:httpd ${CLIENT_CRT}
        chmod 775 ${CLIENT_CRT}

        if [ -d $CLIENTCERT_CERTONLY_DIR ]; then
            cat ${CLIENT_CRT} $INTERMEDIATE_NAME.crt > ${CLIENT_CA_FILE}
            chown httpd:httpd $CLIENT_CA_FILE
            chmod 775 $CLIENT_CA_FILE
        fi
    fi
    #Create ca.crl file with current index.txt if not existed
    if [ ! -f $CLIENT_CA_REVOKE_CRL_FILE ] && [ -f $CLIENT_CNF ]; then
        #Create Server crl
        openssl ca -gencrl -config $CLIENT_CNF -crldays $DAYS -keyfile $CLIENT_PEM -cert $CLIENT_PEM -out $CLIENT_CA_REVOKE_SERVER_CRL_FILE
        #Create Intermediate crl
        openssl ca -gencrl -config $CLIENT_CNF -crldays $DAYS -keyfile $INTERMEDIATE_NAME.key -cert $INTERMEDIATE_NAME.crt -out $CLIENT_CA_REVOKE_INTERMEDIATE_CRL_FILE
        #Combine together
        cat $CLIENT_CA_REVOKE_SERVER_CRL_FILE $CLIENT_CA_REVOKE_INTERMEDIATE_CRL_FILE > $CLIENT_CA_REVOKE_CRL_FILE
        #Change owner and mode
        chown httpd:httpd $CLIENT_CA_REVOKE_SERVER_CRL_FILE $CLIENT_CA_REVOKE_INTERMEDIATE_CRL_FILE $CLIENT_CA_REVOKE_CRL_FILE
        chmod 775 $CLIENT_CA_REVOKE_SERVER_CRL_FILE $CLIENT_CA_REVOKE_INTERMEDIATE_CRL_FILE $CLIENT_CA_REVOKE_CRL_FILE
    fi

    if [ -f $CLIENTCERT_CA_CRLNUMBER ]; then
        chown httpd:httpd ${CLIENTCERT_CA_CRLNUMBER}*
        chmod 775 ${CLIENTCERT_CA_CRLNUMBER}*
    fi

    if [ -f $CLIENT_SRL ]; then
        chown httpd:httpd ${CLIENT_SRL}
        chmod 775 ${CLIENT_SRL}
    fi
}

Remove_Client_Cert_Path()
{
    rm -rf $CLIENTCERTDIR 2> /dev/null
}

validate_key() {
    # Validate the SSL certificate
    logger -t $LOG_TAG -s -p user.info "*** Validating EWS SSL cert $(date)"
    if [ ! -f $CERT -a ! -f $PRIVATE_KEY ]; then
        logger -t $LOG_TAG -s -p user.info "Missing private key and certificate"
        rm -f $MERGED_KEY
        Remove_Client_Cert_Path
        return 1
    fi

    # test the private key for sanity
    # using pkeyutl and -sign/-verify allows us to test
    # rsa and dsa keys using the same mechanism
    local msg_in=$(mktemp /tmp/ssl-msg-XXXXXXXX)
    local sig_file=$(mktemp /tmp/ssl-sig-XXXXXXXX)
    dd if=/dev/urandom bs=32 count=1 of=$msg_in 2>/dev/null
    openssl pkeyutl -inkey $PRIVATE_KEY -sign -in $msg_in -out $sig_file
    local ret=$(openssl pkeyutl -inkey $PRIVATE_KEY -verify -sigfile $sig_file -in $msg_in)
    rm -rf $msg_in $sig_file
    if [ "$ret" != "Signature Verified Successfully" ]; then
        logger -t $LOG_TAG -s -p user.info "Private key is not self-consistent"
        rm -rf $GENDIR $MERGED_KEY
        Remove_Client_Cert_Path
        return 1
    fi

    # check for a cert and then check its sanity
    if [ ! -f $CERT ]; then
        rm -f $MERGED_KEY
        Remove_Client_Cert_Path
        return 1
    fi

    # verify that separate key/cert matches combined key/cert
    if [ $( (
            openssl pkey -pubout -in $PRIVATE_KEY | sha256sum
            openssl x509 -pubkey -noout -in $CERT | sha256sum
            [ -f $MERGED_KEY ] && openssl x509 -pubkey -noout -in $MERGED_KEY | sha256sum
        ) | sort | uniq | wc -l) -ne 1 ]; then

        logger -t $LOG_TAG -s -p user.info "Certificate does not match private key"
        rm -f $CERT $MERGED_KEY
        Remove_Client_Cert_Path
        # if uploaded cert and key are broken, remove them and fall back to self-signed
        if has_custom_https_cert; then
            clear_custom_https_cert
        fi
        return 1
    fi

    # checks below this are only for self-signed certificates
    if has_custom_https_cert; then
        return 0
    fi

    # check for certificate expiration; regenerate if it is close
    local cert_start_date=$(date -d "$(parse_cert_date "startdate")" +%s)
    local cert_end_date=$(date -d "$(parse_cert_date "enddate")" +%s)
    local current_date=$(date +%s)
    openssl x509 -checkend $EXP -noout -in $CERT
    if [ ! $? ] || [ $current_date -lt $cert_start_date ] || [ $current_date -gt $cert_end_date ]; then
        rm -f $MERGED_KEY $CERT
        Remove_Client_Cert_Path
        return 1
    fi

    local crt_dn=$(
        openssl x509 -in $CERT -noout -subject | \
            sed -e 's/subject=/subject= \//;s/ = /=/g;s/, /\//g' | \
            sed -e 's,[^=]*=,,;s,/,\n,g' | \
            grep -v '^\s*$\|emailAddress' | \
            sort | sha256sum
    )
    local cfg_dn=$(
        sed -n -e '/\[ ca_dn \]/,/^$/{/^[a-z0-9]/p}' $SCNF | \
            sed -e 's/^countryName\s*=\s*/C=/' \
                -e 's/^stateOrProvinceName\s*=\s*/ST=/' \
                -e 's/^localityName\s*=\s*/L=/' \
                -e 's/^0.organizationName\s*=\s*/O=/' \
                -e 's/^organizationalUnitName\s*=\s*/OU=/' \
                -e 's/^commonName\s*=\s*/CN=/' \
                -e '/^emailAddress\s*=.s*/d' |
            sort | sha256sum
    )
    # check to see that the DN in the subject matches the config
    if [ "$cfg_dn" != "$crt_dn" ]; then
        # current cert does not match config
        rm -f $CERT $MERGED_KEY
        Remove_Client_Cert_Path
        return 1
    fi

    return 0
}

while :; do
    # lock for concurrency
    mkdir "$LOCKDIR" 2>/dev/null
    if [ $? -eq 0 ]; then
        # we got the lock; put our pid in the file so others can tell if
        # we fail to clean up after ourselves
        echo -n "$$" > "$LOCKDIR/pid"
        break
    else
        # this process did not get the lock; wait for lock to be dropped
        # at which point, the keys should be good to go
        LOCKPID=$(cat "$LOCKDIR/pid")
        while [ -d "$LOCKDIR" ]; do
            if ps | grep -q "^\s*${LOCKPID}.*crt\.sh"; then
                sleep 1
            else
                rm -rf "$LOCKDIR"
                break
            fi
        done
    fi
done

if ! validate_key; then
    mkdir -p $GENDIR/private
    Create_Client_Cert_Path

    if [ ! -f $PRIVATE_KEY ]; then
        logger -t $LOG_TAG -s -p user.info "*** Generate private rsa key..."
        openssl genrsa -out $PRIVATE_KEY 2048
    fi
    if [ ! -f $CERT ]; then
        logger -t $LOG_TAG -s -p user.info "*** Generate self-signed certficate..."
        openssl req -new -x509 -config $SCNF -new -sha256 -key $PRIVATE_KEY \
            -days $DAYS -sha256 -batch -out $CERT
    fi
    if [ ! -f $MERGED_KEY ]; then
        logger -t $LOG_TAG -s -p user.info "*** Creating merged key..."
        cat $CERT $PRIVATE_KEY > $MERGED_KEY
    fi

    Client_Cert_Setting

    logger -t $LOG_TAG -s -p user.info "***************************************************"
    logger -t $LOG_TAG -s -p user.info "**                                               **"
    logger -t $LOG_TAG -s -p user.info "**         TLS key generation complete           **"
    logger -t $LOG_TAG -s -p user.info "**                                               **"
    logger -t $LOG_TAG -s -p user.info "***************************************************"
else
    #If validate_key is OK, only need to do client cert check and setting
    Create_Client_Cert_Path
    Client_Cert_Setting
fi

rm -rf "$LOCKDIR"

