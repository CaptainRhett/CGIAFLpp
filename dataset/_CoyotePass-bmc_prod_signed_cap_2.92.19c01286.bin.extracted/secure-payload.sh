#!/bin/sh

enc_payload() {
    local PAYLOAD_IN="$1"
    local PAYLOAD_OUT="$2"

    # generate a 16 byte random password.
    PASS=$(hexdump -e '/1 "%02x" ""' -n 16 /dev/urandom)

    # create a one-time-use AES key; store in memory only
    PKEY=$(openssl enc -aes-128-cbc -k $PASS -P -md sha256)
    K=$(echo "$PKEY" | grep ^key | cut -d = -f 2)
    IV=$(echo "$PKEY" | grep ^iv | cut -d = -f 2)

    # acquire the BMC public certificate from impid
    PUB_CERT=$(mktemp pub_certXXXXXX)
    cmdtool --offset --columns 16 --pad 20 20 25 0 0 0 0 10 | \
        sed 's/^\([a-f0-9]\+\):/\1/i' | \
        xxd -r | dd bs=1 skip=1 2>/dev/null > "$PUB_CERT"

    # encrypt the AES key using the public RSA key
    (
        echo "$PKEY"
        echo -n "sha256sum="
        sha256sum "$PAYLOAD_IN" | awk '{print $1'}
    ) | openssl rsautl -encrypt -certin -inkey "$PUB_CERT" \
                        -keyform der -out "$PAYLOAD_OUT"
    rm "$PUB_CERT"

    # encrypt the incoming payload
    cat "$PAYLOAD_IN" | \
        openssl enc -e -aes-128-cbc -K "$K" -iv "$IV" >> "$PAYLOAD_OUT"
}

enc_payload_with_rsa() {
    local PAYLOAD_IN="$1"
    local PAYLOAD_OUT="$2"
    local RSA_CERT="$3"

    # generate a 16 byte random password.
    PASS=$(hexdump -e '/1 "%02x" ""' -n 16 /dev/urandom)

    # create a one-time-use AES key; store in memory only
    PKEY=$(openssl enc -aes-128-cbc -k $PASS -P -md sha256)
    K=$(echo "$PKEY" | grep ^key | cut -d = -f 2)
    IV=$(echo "$PKEY" | grep ^iv | cut -d = -f 2)

    # acquire the BMC public certificate from impid
    PUB_CERT=$RSA_CERT

    # encrypt the AES key using the public RSA key
    (
        echo "$PKEY"
        echo -n "sha256sum="
        sha256sum "$PAYLOAD_IN" | awk '{print $1'}
    ) | openssl rsautl -encrypt -certin -inkey "$PUB_CERT" \
                        -keyform pem -out "$PAYLOAD_OUT"

    # encrypt the incoming payload
    cat "$PAYLOAD_IN" | \
        openssl enc -e -aes-128-cbc -K "$K" -iv "$IV" >> "$PAYLOAD_OUT"
}

dec_payload() {
    local PAYLOAD_IN="$1"
    local PAYLOAD_OUT="$2"

    [ -z "$SIGN_SERVER" ] && SIGN_SERVER=localhost
    [ -z "$KEYID" ] && KEYID=Purley/developmentKeys

    # get the one-time-use AES key by rsa decrypting the first block
    HDR=$(dd if="$PAYLOAD_IN" bs=256 count=1 2>/dev/null | \
           signtool decrypt -server $SIGN_SERVER -k $KEYID)
    ret=$?
    if [ $ret -ne 0 ]; then
        echo "Failed to decrypt header" >&2
        return $ret
    fi

    PKEY=$(echo "$HDR" | head -n 3)
    K=$(echo "$PKEY" | grep ^key | cut -d = -f 2)
    IV=$(echo "$PKEY" | grep ^iv | cut -d = -f 2)

    dd if="$PAYLOAD_IN" bs=256 skip=1 2>/dev/null | \
        openssl enc -d -aes-128-cbc -K "$K" -iv "$IV" > "$PAYLOAD_OUT"

    CHK=$(echo "$HDR" | grep "^sha256sum=" | cut -d = -f 2)
    if [ -n "$CHK" ]; then
        if [ "$(sha256sum "$PAYLOAD_OUT" | awk '{print $1}')" != "$CHK" ]; then
            echo "Failed payload integrity check" >&2
            rm -f "$PAYLOAD_OUT"
            return 1
        fi
    fi
    return 0
}

dec_payload_with_rsa() {
    local PAYLOAD_IN="$1"
    local PAYLOAD_OUT="$2"
    local RSA_KEY="$3"

    # get the one-time-use AES key by rsa decrypting the first block
    HDR=$(dd if="$PAYLOAD_IN" bs=256 count=1 2>/dev/null | \
           openssl rsautl -decrypt -inkey $RSA_KEY)
    ret=$?
    if [ $ret -ne 0 ]; then
        echo "Failed to decrypt header" >&2
        return $ret
    fi

    PKEY=$(echo "$HDR" | head -n 3)
    K=$(echo "$PKEY" | grep ^key | cut -d = -f 2)
    IV=$(echo "$PKEY" | grep ^iv | cut -d = -f 2)

    dd if="$PAYLOAD_IN" bs=256 skip=1 2>/dev/null | \
        openssl enc -d -aes-128-cbc -K "$K" -iv "$IV" > "$PAYLOAD_OUT"

    CHK=$(echo "$HDR" | grep "^sha256sum=" | cut -d = -f 2)
    if [ -n "$CHK" ]; then
        if [ "$(sha256sum "$PAYLOAD_OUT" | awk '{print $1}')" != "$CHK" ]; then
            echo "Failed payload integrity check" >&2
            rm -f "$PAYLOAD_OUT"
            return 1
        fi
    fi
    return 0
}

usage() {
    echo "$0: <e[ncrypt]|e[ncrypt]_rsa|d[ecrypt]|d[ecrypt]_rsa> <in.file> <out.file> <rsa_cert/rsa_key>"
    exit 1
}

[ $# -gt 4 ] && usage

case "$1" in
    d|dec|decrypt)
        dec_payload "$2" "$3"
        ;;
    d_rsa|dec_rsa|decrypt_rsa)
        dec_payload_with_rsa "$2" "$3" "$4"
        ;;
    e|enc|encrypt)
        enc_payload "$2" "$3"
        ;;
    e_rsa|enc_rsa|encrypt_rsa)
        enc_payload_with_rsa "$2" "$3" "$4"
        ;;
    *)
        usage
        ;;
esac

